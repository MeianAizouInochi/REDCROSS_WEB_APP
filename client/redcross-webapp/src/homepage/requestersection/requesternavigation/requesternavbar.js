
import "./requesternavbar.css";

import { IoMdArrowDropdown } from 'react-icons/io';

import { BsChatSquareTextFill } from 'react-icons/bs';

const RequesterNavbar = (props) => {

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER START.--------------------------------------------------------------------------------------------------*/
    return (
        <nav className="donatorNavbar">

            { /*DASHBOARD AND CHAT OPTIONS*/ }
            <ul className="donatornavbarulcontainer" >

                { /*ONCLICK DASHBOARD CALLS Rsection Changer FUNCTION IN REQUESTERPAGE COMPONENT*/ }
                <li className="donatornavbarDashboard" onClick={() => { props.passingchangesectiondata(0) }}>

                    Dashboard

                </li>

                { /*ONCLICK CHAT CALLS Rsection Changer FUNCTION IN REQUESTERPAGE COMPONENT*/}
                <li className="donatornavbarchat" onClick={() => { props.passingchangesectiondata(1) }} >

                    Chats

                    <BsChatSquareTextFill className="chaticon" />

                </li>

            </ul>

            { /*NEED WORK HERE!! (IF REQUIRED TO BE KEPT IN UI OR NOT.)*/ }
            <div className="donatorprofilepicdivisionnavbar">

                <img src="/persondefault.svg" className="userimage" alt="what?" />

                <IoMdArrowDropdown />

            </div>

        </nav>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
export default RequesterNavbar;