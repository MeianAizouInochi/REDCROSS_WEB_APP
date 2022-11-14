import { useEffect, useState } from "react";
import Axios from "axios";
import "./staffdashboard.css";
import Staffstatistics from './statistics/staffstatistics';

const Staffdashboard = (props) => {

    return (

        <div className="staffAccountinfocontainer" >

            <div className="staffAccountinfo">

                <div className="staffAccountinfocover">

                    <div className="staffProfilepicContainer">

                        <img src="/persondefault.svg" className="staffProfilepic" />

                    </div>

                    <div className="staffinfo">

                        <section className="staffnamecontainer">

                            <p className="staffName">Name</p>

                            <p className="staffNamedata">staffname</p>

                        </section>

                        <section className="staffmobilecontainer">

                            <p className="staffmobile">Mobile Number</p>

                            <p className="staffmobiledata">staff Mobilenumber</p>

                        </section>

                        <section className="staffadhaarcontainer">

                            <p className="staffadhaar">Adhaar Number:</p>

                            <p className="staffadhaardata">Staff Adhaar Number:</p>

                        </section>

                        <section className="staffpancontainer">

                            <p className="staffpan">Pan Number</p>

                            <p className="staffpandata">staff Pan Number</p>

                        </section>

                        <section className="staffaddresscontainer">

                            <p className="staffaddress">Address</p>

                            <p className="staffaddressdata">staff Address</p>

                        </section>

                        <section className="staffusernamecontainer">

                            <p className="staffusername">Username:</p>

                            <p className="staffusernamedata">Staff username</p>

                        </section>

                    </div>

                </div>

            </div>

            <div className="staffstatistics">

                <p className="staffstatisticsText">Statistics</p>

                <div className="staffstatisticscover">

                    <Staffstatistics />

                </div>

            </div>

        </div>
    );
}

export default Staffdashboard;