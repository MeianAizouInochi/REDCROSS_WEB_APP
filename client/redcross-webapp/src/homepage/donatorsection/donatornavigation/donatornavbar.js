import "./donatornavbar.css";
import { IoMdArrowDropdown } from 'react-icons/io';
import { BsChatSquareTextFill } from 'react-icons/bs';

const DonatorNavbar = (props) => {

    return (
        <nav className="donatorNavbar">

            <ul className="donatornavbarulcontainer" >

                <li className="donatornavbarDashboard" onClick={() => { props.passingchangesectiondata(0) }}>

                    Dashboard

                </li>

                <li className="donatornavbarchat" onClick={() => { props.passingchangesectiondata(1) }} >

                    Chats

                    <BsChatSquareTextFill className="chaticon" />

                </li>

            </ul>

            <div className="donatorprofilepicdivisionnavbar">

                <img src="/persondefault.svg" className="userimage" alt="what?" />

                <IoMdArrowDropdown />

            </div>

        </nav>
    );
}
export default DonatorNavbar;