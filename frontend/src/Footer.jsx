import React from 'react';
import './Footer.css';

const Footer = () => {
    // Generate an array of letters from A to Z
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    return (
        <>

            <div className="footer-container">
                <div className="row">
                
                    <div className="footer-info">
                        <strong>A-Z List</strong> Search anime by a to z list
                    </div>
                    <div className="letter-links">
                        {letters.map((letter, index) => (
                            <a key={index} href={`#${letter}`}>
                                {letter}
                            </a>
                        ))}
                    </div>
                    <div className="website-title">
                        Animeki <i className="fa-brands fa-discord"></i><i className="fa-brands fa-twitter"></i><i className="fa-brands fa-reddit"></i>
                    </div>
                    <div className="copy-right">
                    Copyright © animeki.to. All Rights Reserved 
                    </div>
                </div>
            </div>

        </>
    );
};

export default Footer;
