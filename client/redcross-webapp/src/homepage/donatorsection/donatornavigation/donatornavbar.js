import "./donatornavbar.css";

import { IoMdArrowDropdown } from 'react-icons/io';

import { BsChatSquareTextFill } from 'react-icons/bs';

const DonatorNavbar = (props) => {

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (
        <nav className="donatorNavbar">

            <ul className="donatornavbarulcontainer" >

                { /*WHEN CLICKED ON DASHBOARD, SETTING THE DONATOR PAGE DSECTION VARIABLE TO 0*/ }
                <li className="donatornavbarDashboard" onClick={() => { props.passingchangesectiondata(0) }}>

                    Dashboard

                </li>

                { /*WHEN CLICKED ON CHAT, SETTING THE DONATOR PAGE DSECTION VARIABLE TO 1*/}
                <li className="donatornavbarchat" onClick={() => { props.passingchangesectiondata(1) }} >

                    Chats

                    <BsChatSquareTextFill className="chaticon" />

                </li>

            </ul>

            { /*UI ELEMENTS AND DONATOR PROFILE PIC*/ }
            <div className="donatorprofilepicdivisionnavbar">

                <img src="/persondefault.svg" className="userimage" alt="what?" />

                <IoMdArrowDropdown />

            </div>

        </nav>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
export default DonatorNavbar;