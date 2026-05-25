import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

interface QRTokenPayload {
  courseId: string;
  campusId: string;
  sessionId: string;
  timestamp: number;
  nonce: string;
  expiresAt: number;
}

interface QRValidationResult {
  valid: boolean;
  reason?: string;
  payload?: QRTokenPayload;
}

const TOKEN_LIFETIME_MS = 4000; // 4 seconds
const GEO_FENCE_RADIUS_METERS = 500; // 500m campus radius

/**
 * Generate a rolling QR token that expires in 4 seconds.
 * The token is encrypted and contains a unique nonce to prevent replay attacks.
 */
export function generateQRToken(courseId: string, campusId: string): string {
  const secret = process.env.ENCRYPTION_SECRET || 'default-dev-secret-key-32chars!';
  const now = Date.now();
  
  const payload: QRTokenPayload = {
    courseId,
    campusId,
    sessionId: uuidv4(),
    timestamp: now,
    nonce: uuidv4().slice(0, 8),
    expiresAt: now + TOKEN_LIFETIME_MS,
  };

  const jsonPayload = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(jsonPayload, secret).toString();
  
  // Create HMAC signature for integrity verification
  const signature = CryptoJS.HmacSHA256(encrypted, secret).toString().slice(0, 16);
  
  return `${encrypted}.${signature}`;
}

/**
 * Validate a QR token.
 * Checks: signature integrity, expiration, and course matching.
 */
export function validateQRToken(token: string, expectedCourseId: string): QRValidationResult {
  const secret = process.env.ENCRYPTION_SECRET || 'default-dev-secret-key-32chars!';
  
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, reason: 'Invalid token format' };
    }

    const [encrypted, signature] = parts;

    // Verify signature
    const expectedSig = CryptoJS.HmacSHA256(encrypted, secret).toString().slice(0, 16);
    if (signature !== expectedSig) {
      return { valid: false, reason: 'Invalid signature — possible tampering' };
    }

    // Decrypt payload
    const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      return { valid: false, reason: 'Decryption failed' };
    }

    const payload: QRTokenPayload = JSON.parse(decrypted);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return { valid: false, reason: 'Token expired (4-second window exceeded)' };
    }

    // Check course match
    if (payload.courseId !== expectedCourseId) {
      return { valid: false, reason: 'Course ID mismatch' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'Token parsing error' };
  }
}

/**
 * Validate GPS geofence — checks if coordinates are within campus radius.
 */
export function validateGeofence(
  studentLat: number,
  studentLng: number,
  campusLat: number,
  campusLng: number,
  radiusMeters: number = GEO_FENCE_RADIUS_METERS
): boolean {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((campusLat - studentLat) * Math.PI) / 180;
  const dLng = ((campusLng - studentLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((studentLat * Math.PI) / 180) *
      Math.cos((campusLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusMeters;
}

/**
 * Validate WiFi MAC address against allowed campus profiles.
 */
export function validateWiFiProfile(
  clientMAC: string,
  allowedMACs: string[]
): boolean {
  if (!clientMAC || allowedMACs.length === 0) return false;
  const normalized = clientMAC.toUpperCase().replace(/[:-]/g, '');
  return allowedMACs.some(
    mac => mac.toUpperCase().replace(/[:-]/g, '') === normalized
  );
}
