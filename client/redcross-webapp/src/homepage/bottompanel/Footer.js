import React from "react";
import './Footer.css'
import { useEffect, useState } from "react";

// icons

import {
    FaFacebookSquare,
    FaInstagramSquare,
    FaLinkedinIn,
    FaTwitterSquare,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope
  } from "react-icons/fa";

const Footer = (props) => {

    

    return (

        <section className="Footer">

            <div className="footer-container">

                <div className="footer-left">

                    <div className="footer-left-aboutus">

                        <p className="bottomfooterheading">Redcross Mohali</p>

                        <div className="footer-left-aboutus-links">
                            <p onClick={(e) => { props.changepagetofooter(1); }}>About us</p>
                            <p onClick={(e) => { props.changepagetofooter(0); }}>Home</p>
                        </div>

                    </div>

                </div>

                <div className="footer-mid">

                    <p className="footercontractus">Contact</p>

                    <div className="footer-mid-map">

                        <FaMapMarkerAlt /><span>&nbsp; &nbsp; SAS Nagar Sector - 76 </span>

                            <br></br>&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;

                            <span>Mohali , Punjab - 160055</span>

                    </div>

                    <div className="footer-mid-phone-number">

                        <div>

                            <FaPhoneAlt />&nbsp;&nbsp; +91 123-456-7890

                        </div>

                    </div>

                    <div className="footer-mid-email-id">

                        <div>

                           <FaEnvelope />&nbsp;&nbsp; support@redcross.com 

                        </div>

                    </div>

                </div>

                <div className="footer-right">

                   

                        <div className="footer-right-officials-social-media">

                            <p>

                            <a href="https://twitter.com/ICRC"
                                    className="Twitter">
                                    <FaTwitterSquare   />
                                </a>

                                &nbsp;&nbsp;&nbsp;&nbsp;

                                <a href="https://www.facebook.com/IFRC/"
                                    className="Facebook">
                                    <FaFacebookSquare  />
                                </a>

                                &nbsp;&nbsp;&nbsp;&nbsp;

                                <a href="https://www.instagram.com/icrc/"
                                    className="Instagram">
                                    <FaInstagramSquare   />
                                </a>

                                &nbsp;&nbsp;&nbsp;&nbsp;

                                <a href="https://www.linkedin.com/company/icrc/"
                                    className="LinkedinIn">
                                    <FaLinkedinIn />
                                </a>

                               

                            </p>

                        </div>

                        <div className="footer-right-officials-link">

                        <p onClick={(e) => { props.changepagetofooter(2); } }>Feedback</p>
                        <p onClick={(e) => { props.changepagetofooter(3); }}>T&C Privacy Policy</p>
                        <p onClick={(e) => { props.changepagetofooter(4); }}>Tie-Ups</p>

                        </div>

                    

            </div>

        </div>    

            <div className="footer-copyright">

                <p> <b>Red Cross Mohali © 2022</b></p>

            </div>

            

        </section>
                
    );
}

export default Footer;