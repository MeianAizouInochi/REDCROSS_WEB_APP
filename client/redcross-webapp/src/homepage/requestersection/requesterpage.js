
import RequesterNavbar from "./requesternavigation/requesternavbar";

import { useLocation } from "react-router-dom";

import Requesterdashboard from "./dashboard/requesterdashboard";

import Requesterchat from "./chat/requesterchat";

import { useState } from "react";

const Requesterpage = (props) => {

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES---------------------------------------------------------------------------------------------------------------------------------------*/
    let username = props.UsernameData;

    const [Rsection, setRsection] = useState(0);
    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END------------------------------------------------------------------------------------------------------------------------------------*/

    /*
     *CHANGE SECTION COMPONENT TO AUTOMATE CHANGING SECTION FROM DAASHBOARD TO CHAT IN REQUESTER SECTION.
     */
    const changesection = (props) => {

        setRsection(props)
    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER START.--------------------------------------------------------------------------------------------------*/
    return (

        <div className="Requesterpage">

            { /*REQUESTER SECTION NAVBAR- CONTAINS DASHBOARD AND CHAT SECTIONS*/ }
            <div className="Requesternavbar">

                <RequesterNavbar passingchangesectiondata={changesection} />

            </div>

            { /*Rsection VALUE DECIDES THE RENDERING OF DASHBOARD OR CHAT SECTIONS*/ }
            {Rsection === 0 ? <div className="Requesterdashboard">

                <Requesterdashboard username={username} />

            </div> : (Rsection === 1 && < div className="Requesterdashboard">

                <Requesterchat username={username} />

            </div>) 
            }

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
export default Requesterpage;