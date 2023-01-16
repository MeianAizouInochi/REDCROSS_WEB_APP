
import DonatorNavbar from "./donatornavigation/donatornavbar";

import { useLocation } from "react-router-dom";

import Donatordashboard from "./dashboard/donatordashboard";

import Donatorchat from "./chat/donatorchat";

import { useState } from "react";

const Donatorpage = (props) => {

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES------------------------------------------------------------------------------------------------------------------------------------*/
    let username = props.UsernameData;

    const [Dsection, setDsection] = useState(0);
    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END------------------------------------------------------------------------------------------------------------------------------------*/

    /*
     *CHANGE SECTION COMPONENT TO AUTOMATE CHANGING SECTION FROM DAASHBOARD TO CHAT IN DONATOR SECTION.
     */
    const changesection = (props) => {

        setDsection(props);
    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (

        <div className="Donatorpage">

            <div className="Donatornavbar">

                { /*SENDING CHANGE SECTION AS PARAMETER FOR CHANGING SECTION ON CLICK IN DONATOR NAVBAR*/ }
                <DonatorNavbar passingchangesectiondata={changesection} />

            </div>

            { /*IF DSECTION VALUE IS 0, THEN DASHBOARD IS VISIBLE TO END USER ELSE CHAT IS VISIBLE.*/ }
            {Dsection === 0 ? <div className="Donatordashboard">

                <Donatordashboard username={username} passingchangesectiondata={changesection} />

            </div> : <div className="Donatordashboard">

                    <Donatorchat username={username} />

            </div>
            }

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/
}
export default Donatorpage;