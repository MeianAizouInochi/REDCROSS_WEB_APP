//logo import.
import logo from './redcrosslogo.png';

//paired css file import.
import "./navbar.css";

//router components import.
import { Link, useNavigate } from 'react-router-dom';

//icon imports.
import { AiOutlineMenu } from 'react-icons/ai';

//react hooks import.
import { useState, useEffect } from 'react';

//Language component import.
import Language from './changelanguage.js'

//Dropdown menu component import.
import DD from './dropdown.js';

import  Axios  from 'axios';

import DbURL from "../../domainconfig";

export default function Navbar(props) {

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES------------------------------------------------------------------------------------------------------------------------------------*/

    const [Logo, setLogo] = useState(null); // VARIABLE FOR LOGO.

    const [navigationpopup, setnavigationpopup] = useState(false); // THIS IS FLAG FOR NAVIGATION POP UP

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END.------------------------------------------------------------------------------------------------------------------------------------*/

    /*
     * THIS USE EFFECT HOOK GETS CALLED ONCE WHEN THIS COMPONENT MOUNTS.
     * IT HAS A PARASITE FUNCTION OF EVENT LISTENER FOR WINDOW RESIZE.
     */
    useEffect(() => {
     
        window.addEventListener("resize", () => { // EVERT LISTENER FOR WINDOW RESIZE.

            window.innerWidth > 801 && setnavigationpopup(false);

        });

        return window.removeEventListener("resize", ()=> { // CLEANER FUNCTION
            
            window.innerWidth > 801 && setnavigationpopup(false);

        });

    }, []);

    /*
     * THIS USE EFFECT HOOK GETS CALLED ONCE TO CALL GET LOGO FUNCTION.
     */
    useEffect(() => {

        GetLogo();

    }, []);

    /*
     * GET LOGO IS AN ASYNCHRONOUS FUNCTION.
     * CALLING ANYTHING AFTER THIS FUNCTION's CALL MAY RUN THEM BOTH AS SAME TIME.
     */
    const GetLogo = async() => {

        const requiredURL = DbURL + "/api/admin/getdblogo";
        
        const response = await Axios.post(requiredURL, { withCredentials: true }); // MAKING API CALL TO DB FOR GETTING  LOGO PIC

        if (response.data.recordset.length === 0) {

            setLogo(null);

        }
        else if (response.data.recordset.length === 1) {

            /*
             * CONVERTING DATA FROM API CALL TO DISPLAyABLE DATA AND STORING IT INTO STATE.
             */
            const imagedata = await btoa(String.fromCharCode(...new Uint8Array(response.data.recordset[0].PICTURE.data)));

            setLogo(imagedata);

        }

    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (
        <nav className="navbar">

            { /*PUTTING THE LOGO FROM THE STATE INTO THE IMG*/ }
            <img src={Logo===null?logo:`data:image/png;base64,${Logo}`} className="redcrosslogo" alt="Redcross Logo" />

            <AiOutlineMenu className="navbartoggle-button" onClick={() => setnavigationpopup(!navigationpopup)} />

            <ul className={navigationpopup ? "navigationoptions-mobile" : "navigationoptions"}  >

                <li className="donatenow">

                    <DD />

                </li>


                { /*THE BUTTON VISIBILITY ON THE NAVBAR DEPENDING ON THE LOG STATUS OF THE USER*/}

                {props.info === null ?
                    <div className="loggerbuttons">

                        <li className="Signin" onClick={() => { props.VisChangerLogin(); }} >

                            Log in

                        </li>

                        <li className="Signup" onClick={() => { props.VisChangerSignup(); }} >

                            Sign up

                        </li>

                    </div> :

                    <div>

                        <li className="loggerbuttons" onClick={() => { props.LogOuttodefault() }} >

                            Log out

                        </li>

                    </div>
                }

            </ul>

        </nav>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
