import { useEffect, useRef, useState } from 'react'
import './index.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Refs for pipeline animations
  const pipelineRef = useRef<HTMLDivElement>(null)
  const nodeStackRef = useRef<HTMLDivElement>(null)
  const nodeXRef = useRef<HTMLDivElement>(null)
  const nodeShieldRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  
  const beamGlowRef = useRef<SVGPathElement>(null)
  const beamCoreRef = useRef<SVGPathElement>(null)
  const beamGradientRef = useRef<SVGLinearGradientElement>(null)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    let animationFrameId: number;
    let state = 'p1';
    let lastStateChange = performance.now();
    let dPath = "";
    
    const updatePath = () => {
      if (!pipelineRef.current || !nodeStackRef.current || !nodeXRef.current || !nodeShieldRef.current) return;
      
      const pRect = pipelineRef.current.getBoundingClientRect();
      const sRect = nodeStackRef.current.getBoundingClientRect();
      const xRect = nodeXRef.current.getBoundingClientRect();
      const shRect = nodeShieldRef.current.getBoundingClientRect();
      
      const startX = sRect.left + sRect.width/2 - pRect.left;
      const startY = sRect.top  + sRect.height/2 - pRect.top;
      
      const midX = xRect.left + xRect.width/2 - pRect.left;
      const midY = xRect.top + xRect.height/2 - pRect.top;
      
      const endX = shRect.left + shRect.width/2 - pRect.left;
      const endY = shRect.top + shRect.height/2 - pRect.top;
      
      dPath = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
      
      if (beamGlowRef.current) beamGlowRef.current.setAttribute('d', dPath);
      if (beamCoreRef.current) beamCoreRef.current.setAttribute('d', dPath);
    };

    const animate = (time: number) => {
      const elapsed = time - lastStateChange;
      let percentage = 0;

      if (!nodeStackRef.current || !nodeShieldRef.current || !splashRef.current || !beamGradientRef.current || !beamGlowRef.current || !beamCoreRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (state === 'p1') {
        percentage = Math.min(elapsed / 800, 1) * 0.5; // 0 to 0.5
        
        if (percentage < 0.4) {
          nodeStackRef.current.classList.add('active');
        } else {
          nodeStackRef.current.classList.remove('active');
        }
        
        if (elapsed >= 800) {
          state = 'splash';
          lastStateChange = time;
          beamGlowRef.current.style.opacity = '0';
          beamCoreRef.current.style.opacity = '0';
          splashRef.current.classList.add('animate');
        }
      } else if (state === 'splash') {
        if (elapsed >= 800) {
          state = 'p2';
          lastStateChange = time;
          splashRef.current.classList.remove('animate');
          beamGlowRef.current.style.opacity = '0.6';
          beamCoreRef.current.style.opacity = '1';
        }
      } else if (state === 'p2') {
        percentage = 0.5 + Math.min(elapsed / 800, 1) * 0.5; // 0.5 to 1.0
        
        if (percentage > 0.6 && percentage < 1.0) {
          nodeShieldRef.current.classList.add('active');
        }
        
        if (elapsed >= 800) {
          nodeShieldRef.current.classList.remove('active');
          state = 'idle';
          lastStateChange = time;
        }
      } else if (state === 'idle') {
        if (elapsed >= 1000) {
          state = 'p1';
          lastStateChange = time;
        }
      }

      if (state === 'p1' || state === 'p2') {
        const center = percentage * 100;
        beamGradientRef.current.setAttribute('x1', `${center - 5}%`);
        beamGradientRef.current.setAttribute('x2', `${center + 5}%`);
        beamGradientRef.current.setAttribute('y1', '0%');
        beamGradientRef.current.setAttribute('y2', '0%');
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updatePath);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav>
        <div className="nav-logo">Xero</div>
        
        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#">Method</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
          <div className="nav-actions">
            <a href="#" className="btn-login">Login</a>
            <a href="#" className="btn-signup">Sign Up</a>
          </div>
        </div>

        <button 
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* HERO CARD */}
      <section className="hero-card">
        <div className="hero-grid"></div>

        {/* ICON PIPELINE */}
        <div className="icon-pipeline" ref={pipelineRef}>
          <svg className="beam-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse" ref={beamGradientRef}>
                <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
                <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path ref={beamGlowRef} stroke="url(#beam-gradient)" strokeWidth="2" filter="url(#glow)" opacity="0.6" fill="none" />
            <path ref={beamCoreRef} stroke="url(#beam-gradient)" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Left Node */}
          <div className="icon-node node-light-left" id="node-stack" ref={nodeStackRef}>
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>

          <div className="pipeline-line"></div>

          {/* Center Wrapper */}
          <div className="center-wrapper">
            <div className="splash" ref={splashRef}></div>
            <div className="icon-node-center" id="node-x" ref={nodeXRef}>
              <svg viewBox="0 0 40 40">
                <path d="M29.56 12L20.17 22.13L13.1 12H7.23L17.26 26.39L7 37.49H12.72L22.65 26.75L30.12 37.49H36L25.33 22.2L35.03 12H29.56ZM13.88 13.56L29.6 35.85H32.48L16.74 13.56H13.88Z" />
              </svg>
            </div>
          </div>

          <div className="pipeline-line right"></div>

          {/* Right Node */}
          <div className="icon-node node-light-right" id="node-shield" ref={nodeShieldRef}>
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
        </div>

        {/* HERO TEXT */}
        <div className="hero-content">
          <h1 className="hero-heading">
            The simple way
            <strong>encryption your data</strong>
          </h1>
          <p className="hero-sub">
            Fully managed data encrypting service and annotation<br/>
            platform for teams of all industries.
          </p>
          <a href="#" className="btn-cta">Get Started</a>
        </div>
      </section>

      {/* BRANDS ROW */}
      <div className="brands">
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path fill="var(--bg)" d="M8 9h8v2H8zm0 4h6v2H8z" />
          </svg>
          Expedia
        </div>
        
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="4" fill="currentColor" />
            <circle cx="5" cy="16" r="3.5" fill="currentColor" />
            <circle cx="19" cy="16" r="3.5" fill="currentColor" />
          </svg>
          asana
        </div>
        
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <polyline points="4,8 20,8" />
            <polyline points="8,12 16,12" />
            <polyline points="4,16 20,16" />
          </svg>
          zenefits
        </div>
        
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15.5" cy="8.5" r="2.5" fill="currentColor" />
            <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 9.5 L14 11.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 11.5 L10.5 15.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="16" r="2" fill="currentColor" />
          </svg>
          HubSp<span className="hubspot-dot"></span>t
        </div>
        
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3 v18" />
            <path d="M3 12 h18" />
            <path d="M5.5 5.5 l13 13" />
            <path d="M18.5 5.5 l-13 13" />
          </svg>
          loom
        </div>
      </div>
    </>
  )
}

export default App
