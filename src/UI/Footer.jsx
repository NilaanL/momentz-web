import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                <div className="col1">
                    <p className="footer-description">Automate and simplify photo sharing for your events.
Let AI do the work!
Our smart camera captures every perspective, making photo sharing seamless and automated with AI.</p>
                </div>
                <div className="col2">
                    <h4 className="footer-title">Contact</h4>
                    <p className="footer-list">Phone: 123-456-7890</p>
                    <p className="footer-list">Email: momentz@gmail.com</p>
                </div>
                <div className="col2">
                    <h4 className="footer-title">Services</h4>
                    <p className="footer-list">BIRTH DAY</p>
                    <p className="footer-list">CORPORATE EVENTS</p>
                    <p className="footer-list">WEDDINGS</p>
                    <p className="footer-list">CONVOCATIONS</p>
                </div>
                <div className="col2">
                    <h4 className="footer-title">Customers</h4>
                    <p className="footer-list">Hospitals</p>
                    <p className="footer-list">Gyms</p>
                    <p className="footer-list">Offices</p>
                    <p className="footer-list">Houses</p>
                </div>
                <div className="col2">
                    <h4 className="footer-title">About</h4>
                    <p className="footer-list">Help</p>
                    <p className="footer-list">Privacy Policy</p>
                    <p className="footer-list">Terms & Conditions</p>
                </div>
            </div>
            <div className="Copyright">
            Copyright, All Rights Resreved Mometz.com

            </div>
        </footer>
    );
}

export default Footer;