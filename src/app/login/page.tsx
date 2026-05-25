'use client';
import { useState, useEffect } from 'react';
import './auth.css';

export default function AuthPage() {
    const [isToggled, setIsToggled] = useState(false);
    const [showSigninPassword, setShowSigninPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);

    // Add BoxIcons for the input icons
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="auth-body">
            <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
                <div className="background-shape"></div>
                <div className="secondary-shape"></div>

                <div className="credentials-panel signin">
                    <h2 className="slide-element">Login</h2>
                    <form className="slide-element">
                        <div className="field-wrapper">
                            <input type="text" id="signin-usn" name="signin-usn" placeholder=" " required />
                            <label htmlFor="signin-usn">USN</label>
                            <i className="bx bxs-id-card"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type={showSigninPassword ? "text" : "password"} id="signin-password" name="signin-password" placeholder=" " required />
                            <label htmlFor="signin-password">Password</label>
                            <i 
                                className={`bx ${showSigninPassword ? 'bx-show' : 'bx-hide'} password-toggle`} 
                                onClick={() => setShowSigninPassword(!showSigninPassword)}
                            ></i>
                        </div>
                        <button type="submit" className="submit-button">Login</button>
                    </form>
                    <div className="switch-link slide-element">
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(true); }}>Sign Up</a>
                    </div>
                </div>

                <div className="credentials-panel signup">
                    <h2 className="slide-element">Register</h2>
                    <form className="slide-element">
                        <div className="field-wrapper">
                            <input type="text" id="signup-usn" name="signup-usn" placeholder=" " required />
                            <label htmlFor="signup-usn">USN</label>
                            <i className="bx bxs-id-card"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type="text" id="signup-name" name="signup-name" placeholder=" " required />
                            <label htmlFor="signup-name">Full Name</label>
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type="email" id="signup-email" name="signup-email" placeholder=" " required />
                            <label htmlFor="signup-email">Email Address</label>
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type={showSignupPassword ? "text" : "password"} id="signup-password" name="signup-password" placeholder=" " required />
                            <label htmlFor="signup-password">Password</label>
                            <i 
                                className={`bx ${showSignupPassword ? 'bx-show' : 'bx-hide'} password-toggle`} 
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                            ></i>
                        </div>
                        <div className="field-wrapper">
                            <select id="signup-branch" name="signup-branch" required defaultValue="">
                                <option value="" disabled hidden></option>
                                <option value="cy">Cyber Security</option>
                                <option value="cs">Computer Science (CSE)</option>
                                <option value="is">Information Science (ISE)</option>
                                <option value="ai">AI & ML</option>
                                <option value="ec">Electronics & Comm (ECE)</option>
                                <option value="me">Mechanical Engineering</option>
                                <option value="cv">Civil Engineering</option>
                            </select>
                            <label htmlFor="signup-branch">Branch</label>
                            <i className="bx bxs-graduation"></i>
                        </div>
                        <button type="submit" className="submit-button">Register</button>
                    </form>
                    <div className="switch-link slide-element">
                        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(false); }}>Sign In</a>
                    </div>
                </div>

                <div className="welcome-section signin">
                    <h2 className="slide-element">Welcome Back!</h2>
                    <p className="slide-element">Log in to continue your journey with us.</p>
                </div>

                <div className="welcome-section signup">
                    <h2 className="slide-element">Welcome!</h2>
                    <p className="slide-element">Join us and start your amazing journey.</p>
                </div>
            </div>
        </div>
    );
}
