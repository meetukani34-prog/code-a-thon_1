/**
 * Skill-Graph Automated Sorting — Resume/Job Matching Engine
 * 
 * Parses resume text against job requirements, matches skills and projects,
 * and outputs a skill_match_score (0-1).
 */

interface JobRequirement {
  company: string;
  position: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minProjects: number;
  requiredCertifications: string[];
}

interface ResumeData {
  skills: string[];
  projects: Array<{ title: string; technologies: string[]; verified: boolean }>;
  certifications: string[];
  gpa?: number;
  experience?: string;
}

interface MatchResult {
  overallScore: number;       // 0-1
  skillMatchPct: number;
  projectRelevancePct: number;
  certificationMatchPct: number;
  matchedSkills: string[];
  missingSkills: string[];
  verifiedProjects: number;
  recommendation: 'strong_match' | 'moderate_match' | 'weak_match' | 'no_match';
  autoSlotEligible: boolean;
}

// Common skill aliases for fuzzy matching
const SKILL_ALIASES: Record<string, string[]> = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts'],
  'python': ['py', 'python3'],
  'react': ['reactjs', 'react.js'],
  'node': ['nodejs', 'node.js'],
  'postgresql': ['postgres', 'pgsql', 'pg'],
  'mongodb': ['mongo'],
  'machine learning': ['ml', 'deep learning', 'dl'],
  'artificial intelligence': ['ai'],
  'amazon web services': ['aws'],
  'google cloud': ['gcp', 'google cloud platform'],
  'microsoft azure': ['azure'],
  'docker': ['containerization'],
  'kubernetes': ['k8s'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'devops'],
  'sql': ['structured query language'],
  'html': ['html5'],
  'css': ['css3', 'scss', 'sass'],
};

/**
 * Normalize a skill name for comparison.
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[^a-z0-9\s\/\+\#\.]/g, '');
}

/**
 * Check if two skills match (with alias support).
 */
function skillsMatch(skill1: string, skill2: string): boolean {
  const n1 = normalizeSkill(skill1);
  const n2 = normalizeSkill(skill2);

  if (n1 === n2) return true;

  // Check aliases
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const allForms = [canonical, ...aliases].map(normalizeSkill);
    if (allForms.includes(n1) && allForms.includes(n2)) return true;
  }

  // Partial match (one contains the other)
  if (n1.length > 3 && n2.length > 3) {
    if (n1.includes(n2) || n2.includes(n1)) return true;
  }

  return false;
}

/**
 * Extract skills from raw resume text.
 */
export function parseResumeText(text: string): ResumeData {
  const lines = text.toLowerCase().split('\n');
  const skills: string[] = [];
  const projects: ResumeData['projects'] = [];
  const certifications: string[] = [];

  // Known skill keywords to extract
  const knownSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask',
    'sql', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest api',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'html', 'css', 'sass', 'tailwind', 'figma',
    'git', 'agile', 'scrum', 'jira',
    'data structures', 'algorithms', 'system design',
  ];

  for (const skill of knownSkills) {
    if (text.toLowerCase().includes(skill)) {
      skills.push(skill);
    }
  }

  // Extract project sections
  let inProjectSection = false;
  let currentProject: { title: string; technologies: string[] } | null = null;

  for (const line of lines) {
    if (line.includes('project') || line.includes('portfolio')) {
      inProjectSection = true;
      continue;
    }
    if (inProjectSection && line.trim().startsWith('-')) {
      if (currentProject) {
        projects.push({ ...currentProject, verified: false });
      }
      currentProject = { title: line.replace('-', '').trim(), technologies: [] };
    }
    if (line.includes('certif') || line.includes('certificate')) {
      const cert = line.replace(/[-•*]/g, '').trim();
      if (cert.length > 5) certifications.push(cert);
    }
  }
  if (currentProject) {
    projects.push({ ...currentProject, verified: false });
  }

  return { skills, projects, certifications };
}

/**
 * Match a resume against job requirements.
 */
export function matchSkillGraph(
  resume: ResumeData,
  requirement: JobRequirement
): MatchResult {
  // Skill matching
  const allRequiredSkills = [...requirement.requiredSkills, ...requirement.preferredSkills];
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of requirement.requiredSkills) {
    const found = resume.skills.some(s => skillsMatch(s, reqSkill));
    if (found) matchedSkills.push(reqSkill);
    else missingSkills.push(reqSkill);
  }

  for (const prefSkill of requirement.preferredSkills) {
    const found = resume.skills.some(s => skillsMatch(s, prefSkill));
    if (found) matchedSkills.push(prefSkill);
  }

  const skillMatchPct = allRequiredSkills.length > 0
    ? matchedSkills.length / allRequiredSkills.length
    : 0;

  // Project relevance
  const verifiedProjects = resume.projects.filter(p => p.verified).length;
  const projectRelevancePct = requirement.minProjects > 0
    ? Math.min(1, resume.projects.length / requirement.minProjects)
    : (resume.projects.length > 0 ? 1 : 0.5);

  // Certification matching
  const matchedCerts = requirement.requiredCertifications.filter(
    reqCert => resume.certifications.some(c => c.toLowerCase().includes(reqCert.toLowerCase()))
  );
  const certificationMatchPct = requirement.requiredCertifications.length > 0
    ? matchedCerts.length / requirement.requiredCertifications.length
    : 1;

  // Weighted overall score
  const overallScore = Math.round((
    0.50 * skillMatchPct +
    0.30 * projectRelevancePct +
    0.20 * certificationMatchPct
  ) * 100) / 100;

  // Determine recommendation
  let recommendation: MatchResult['recommendation'] = 'no_match';
  if (overallScore >= 0.75) recommendation = 'strong_match';
  else if (overallScore >= 0.50) recommendation = 'moderate_match';
  else if (overallScore >= 0.25) recommendation = 'weak_match';

  // Must have at least 60% required skill match and no critical missing skills
  const requiredMatchPct = requirement.requiredSkills.length > 0
    ? matchedSkills.filter(s => requirement.requiredSkills.includes(s)).length / requirement.requiredSkills.length
    : 1;

  return {
    overallScore,
    skillMatchPct: Math.round(skillMatchPct * 100),
    projectRelevancePct: Math.round(projectRelevancePct * 100),
    certificationMatchPct: Math.round(certificationMatchPct * 100),
    matchedSkills,
    missingSkills,
    verifiedProjects,
    recommendation,
    autoSlotEligible: requiredMatchPct >= 0.6 && overallScore >= 0.5,
  };
}
