import "./donatorchat.css";

import Axios from "axios";

import { useState, useEffect } from "react";

import { chatRDB } from "../../../authchatsystem/firebaseconfig"

import { ref, push, onValue } from "firebase/database";

import { AiOutlineMenu, AiOutlineSend } from 'react-icons/ai';

import { HiOutlineInboxIn } from 'react-icons/hi';

import DbURL from "../../../domainconfig";

const Donatorchat = (props) => {

    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES----------------------------------------------------------------------------------------------------------------------*/

    const senderusername = props.username; // GETTING USERNAME FROM DONATOR PAGE.

    const donatorkeyword = "DONATOR_" // MAKING A KEYWORD VARIABLE FOR DONATOR.

    const Fullusername = donatorkeyword + senderusername; // CREATING FULL USERNAME.

    const senderid = Fullusername; // CREATING SENDER ID.

    const [Currentsentmessage, setCurrentsentmessage] = useState(""); // CURRENT MESSAGE STATE. 

    const [Messagesendervisibility, setMessagesendervisibility] = useState(false); // MESSAGE SENDER VISIBILIITY.

    const [Currentchatuser, setCurrentchatuser] = useState(""); // STORING CURRENT CHAT USER.

    const [Chatusermssqldata,setChatusermssqldata] = useState(null); /// STORING CHAT USER MSSQL DATA.

    const [Roomcode, setRoomcode] = useState(""); // STORING ROOM CODE FOR CHAT.

    const [Chatsmessages, setChatsmessages] = useState([]); // STORING CHAT MESSAGES.

    const [chatinglistclasschecker, setchatinglistclasschecker] = useState(true); // CHATTING LIST CLASS CHECKER SEMAPHORE.

    //variable for opening pc chat of requester to chat
    const [pcdonatorchatstate, setpcdonatorchatstate] = useState(true);

    //variable for opening mobile list of requester to chat
    const [mobiledonatorchattingliststate, setmobiledonatorchattingliststate] = useState(false);

    const [mobilechattingversion, setmobilechattingversion] = useState(false);

    //anonymous function identifier for toggling mobile donator chatting list value.
    const mobiledonatorchatlisttoggler = () => setmobiledonatorchattingliststate(!mobiledonatorchattingliststate);

    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END.----------------------------------------------------------------------------------------------------------------------*/

    /*
     * THIS USE EFFECT HOOK RUNS ONCE AFTER THE CHAT IS MOUNTED OR RENDERED FOR FIRST TIME.
     * THIS USE EFFECT HOOK CONTAINS A EVENT LISTENER WHICH IS ATTACHED TO THE WINDOW. (PARASITE FUNCTOIN)
     */
    useEffect(() => {

        window.innerWidth > 801 ? setpcdonatorchatstate(true) : setpcdonatorchatstate(false);

        window.innerWidth <= 801 ? setmobilechattingversion(true) : setmobilechattingversion(false);

        window.innerWidth <= 801 ? setmobiledonatorchattingliststate(true) : setmobiledonatorchattingliststate(false);

        window.addEventListener("resize", () => {

            window.innerWidth <= 801 ? setmobilechattingversion(true) : setmobilechattingversion(false);

            window.innerWidth > 801 ? setpcdonatorchatstate(true) : setpcdonatorchatstate(false);

            //window.innerWidth <= 801 ? setmobiledonatorchattingliststate(true) : setmobiledonatorchattingliststate(false);
        });

    }, []);

    /*
     * THIS USE EFFECT HOOK RUNS ONCE AFTER THE CHAT IS MOUNTED OR RENDERED FOR FIRST TIME. 
     */
    useEffect(() => {

        // MAKING AN API CALL TO GET USER CHAT DATA, FOR GETTING CHAT DATA FROM DB.
        Axios.post(DbURL + "/api/getuserchatdata", { verifiedusername: Fullusername }).
            then((responsedata) => {

                setChatusermssqldata(responsedata.data.recordset);

            });
    }, []);

    /*
     * ON SELECTION OF A REQUESTER FROM THE CHATTING LIST.
     * IT CHANGES THE CHAT VISIBILITY TO TRUE FOR THAT PARTICULAR REQUESTER.
     * THEIR CHAT IS THEN LOADED.
     * AND DISPLAYED.
     */
    const showrequesterchat = (props) => {

        setMessagesendervisibility(true);

        setCurrentchatuser(props);

        setRoomcode("DONATOR_" + senderusername + props);

    }

    /*
     * THIS USE EFFECT SHOULD RUN ONLY WHEN ROOMCODE STATE IS CHANGED AND THE COMPONENT RE-RENDERS.
     */
    useEffect(() => {

        if (Roomcode !== "") // CHECKING IF ROOMCODE IS NOT EMPTY.
        {
            // CALLING FIREBASE ON VALUE CHANGE FUNCTION, IT IS MOUNTED AND  RUNS WHENEVER THERE IS A CHANGE IN FIREBASE DB.
            onValue(ref(chatRDB, "/CHATS/" + Roomcode + "/MESSAGES"), (snapshot) => {

                const firebasechatdata = snapshot.val();

                if (firebasechatdata !== null) {

                    let TEMPCHATARRAY = []; // TEMPORARY ARRAY FOR STORING DATA

                    Object.keys(firebasechatdata).map((element) => { // MAPPING DATA FROM SNAPSHOT FIREBASECHATDATA TO TEMPCHATARRAY.

                        TEMPCHATARRAY.push(firebasechatdata[element]);

                    });

                    setChatsmessages(TEMPCHATARRAY); // SETTING THE TEMP ARRAY TO STATE. 

                }
            });
        }
        else
        {
            //do nothing
        } 

    }, [Roomcode]);

    /*
     * THIS USE EFFECT HOOK RUNS ONLy WHEN CHAT MESSAGES STATE HAS ANY CHANGES MADE TO IT.
     */
    useEffect(() => {

        if (Messagesendervisibility === true) {// CHECKS IF MESSAGE SENDER IS VISIBLE TO USER.

            // SCROLLING MESSAGE TO BOTTOM MOST PORTION.
            var obj = document.getElementById("Messagedisplay"); 

            obj.scrollTop = obj.scrollHeight;
        }
    }, [Chatsmessages]);

    /**
     * UPDATE CURRENT MESSAGE  COMPONENT
     * 
     * JUST CHANGES THE CURRENT MESSAGE STATE.
     */
    const Updatecurrentmessage = (props) => {

        setCurrentsentmessage(props.target.value);
    }

    /*
     * THIS COMPONENT INVOKES THE SEND CHAT DATA FUNCTION TO SEND NEW CHAT MESSAGE.
     */
    const SendMessage = () => {

        if (Currentsentmessage !== "") {

            sendChatdata();

            setCurrentsentmessage("");
        }
        else {
            //do nothing
        }
    }

    /*
     * SEND CHAT DATA FUNCTION.
     * ITS SENDS CHAT DATA TO FIREBASE DB.
     */
    const sendChatdata = () => {

        let roomcode = Roomcode;// GETTING ROOMCODE. 

        var roomcode2 = Currentchatuser + Fullusername; //CREATING ROOMCODE2

        // PUSHING CHANGES TO RTDB IN ROOMCODE
        push(ref(chatRDB, "/CHATS/" + roomcode+"/MESSAGES"), {

            message: Currentsentmessage,
            senderid: senderid
        });

        // PUSHING CHANGES IN RTDB IN ROOMCODE2.
        push(ref(chatRDB, "/CHATS/" + roomcode2+"/MESSAGES"), {

            message: Currentsentmessage,
            senderid: senderid
        });
    }

    /*
     * NEED TO CHECK THE REQUIREMENT FOR THIS COMPONENT.
     */
    const changevaluechatinglistclasschecker = () => {

        setchatinglistclasschecker(!chatinglistclasschecker);

    }

    /*
     * NEED TO CHECK THE REQUIREMENT FOR THIS COMPONENT.
     */
    const chattinglisttyperetuner = () => {

        (Chatusermssqldata !== null) && Object.keys(Chatusermssqldata).map((element) => {
            return (

                <li onClick={() => { showrequesterchat(Chatusermssqldata[element].DETAILS) }} key={element} >

                    {Chatusermssqldata[element].DETAILS}

                </li>);
        })
    }


    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER--------------------------------------------------------------------------------------------------*/
    return (
        <div className="Donatorchat">

            { /*
             * PC DONATOR CHATING SECTION START.
             * THIS SECTION IS VISIBLE ONLY IF  PC DONATOR CHAT STATE IS TRUE.
             * */}

            {pcdonatorchatstate && (
                <div className="Donatorchatinglistmothercontainer" >

                    <p className="pcrequesterheading">Requesters</p>  

                    <ul className="Donatorchatinglistchildcontainer">

                        { /*
                         * CHECKS IF CHAT USER MSSQL DATA IS NULL.
                         * IF NOT, THEN MAPS EVERY ELEMENT OF IT TO THE CHAT LIST.
                         * IT PLACES AN ON CLICK LISTENER ON EVERY ELEMENT, FOR INVOKING THE SHOW REQUESTER CHAT FUNCTION.
                         */ }

                        {(Chatusermssqldata !== null) &&
                            Object.keys(Chatusermssqldata)
                            .map((element) => {

                            return (
                                <li className="Donatorchatingitem" onClick={() => {

                                    showrequesterchat(Chatusermssqldata[element].DETAILS) // THE FUNCTION SET ON CLICK LISTENER.

                                }} key={element}>

                                    { /* THE ELEMENT IN THE LIST*/}

                                    {Chatusermssqldata[element].DETAILS} 

                                </li>
                                );
                            })
                        }
                    </ul>

                </div>
            )}

            { /*
             * THIS SECTION ALSO CHECKS THE MESSAGE SENDER VISIBILITY ALONG WITH THE PC DONATOR CHAT STATE.
             */ }
            {pcdonatorchatstate && (

                Messagesendervisibility ? < div className="MessageSender">

                    { /*
                     * THIS HANDLES THE WHOLE PC MESSAGE SENDER UI.
                     */ }

                    <div className="chattingtouser">

                        {Currentchatuser}

                    </div>

                    { /*
                     * THIS IS THE MESSAGE DISPLAY BOX UI.
                     */ }
                    <div className="Messagedisplay" id="Messagedisplay">

                        {Chatsmessages?.map((element, index) => {

                            return (

                                <p key={index} style={element.senderid === senderid ? {
                                    textAlign: "right",
                                    padding: "1rem",
                                    marginRight: "1%",
                                    width: "auto",
                                    maxWidth: "40%",
                                    textAlign: "end",
                                    alignSelf: "end",
                                    backgroundColor: "#962743",
                                    borderRadius: "1rem",
                                    color: "white",
                                    transition: "ease-in",
                                    transitionDuration: "0.5s"
                                } :
                                    {
                                        
                                        padding: "1rem",
                                        marginLeft: "1%",
                                        width: "auto",
                                        maxWidth: "40%",
                                        textAlign: "start",
                                        alignSelf: "start",
                                        backgroundColor: "#FF8790",
                                        borderRadius: "1rem",
                                        color: "white",
                                        transition: "ease-in",
                                        transitionDuration: "0.5s"
                                    }} >

                                    {element.message}

                                </p>);
                        })}

                    </div>

                    { /*
                     * THIS IS THE MESSAGE BOX AND SEND BUTTON UI.
                     */ }
                    <div className="Messageboxsendbuttondisplay">

                        <input className="donatorchatinput"
                            type="text"
                            value={Currentsentmessage}
                            onChange={(e) => { Updatecurrentmessage(e); }}
                            placeholder="enter your text here.."
                        />

                        <div className="donatorchatsendbuttoncontainer">

                            <AiOutlineSend className="donatorchatsendbutton" onClick={() => { SendMessage(); }} />

                        </div>

                    </div>

                </div> : <div className="MessageSender">

                        <div className="pcnooneselectedforchat">
                            
                            <h1 className="pcnooneselectedforchattext">No one for chat selected!</h1>

                            <img src="./emptyinbox.svg" className="pcdonorchatemptyimage" />

                        </div>
                </div>

            )}

            {/* PC DONATOR CHATING SECTION END*/ }


            {/* MOBILE DONATOR CHATING SECTION START*/ }

            {mobiledonatorchattingliststate && (
                <div className="mobileDonatorchatinglistmothercontainer" >

                    <p className="mobilerequesterheading">Requesters</p>  

                    <ul className="mobileDonatorchatinglistchildcontainer">

                        {(Chatusermssqldata !== null) &&
                            Object.keys(Chatusermssqldata)
                                .map((element) => {

                                    return (
                                        <li className="mobileDonatorchatingitem" onClick={() => {

                                            showrequesterchat(Chatusermssqldata[element].DETAILS);

                                            mobiledonatorchatlisttoggler();

                                        }} key={element}>

                                            {Chatusermssqldata[element].DETAILS}

                                        </li>
                                    );
                                })
                        }

                    </ul>

                </div>
            )}



            {mobilechattingversion && (
                < div className="mobileversionmessagesender">
                    {
                        (
                            Messagesendervisibility ? < div className="mobileMessageSender">
                                
                                <div className="mobilechattingtouser">

                                    <div className="mobilechattingtousermenucontainer">

                                        <HiOutlineInboxIn className="mobilechattingtousermenuicon" onClick={() => { mobiledonatorchatlisttoggler(); }} />

                                    </div>

                                    <p className="mobilechattingtousername">{Currentchatuser}</p>

                                </div>

                                <div className="mobileMessagedisplay" id="Messagedisplay">

                                    {Chatsmessages?.map((element, index) => {

                                        return (

                                            <p key={index} style={element.senderid === senderid ? {
                                                textAlign: "right",
                                                padding: "1rem",
                                                marginRight: "1%",
                                                width: "auto",
                                                maxWidth: "40%",
                                                textAlign: "end",
                                                alignSelf: "end",
                                                fontSize:"1rem",
                                                backgroundColor: "#962743",
                                                borderRadius: "1rem",
                                                color: "white",
                                                transition: "ease-in",
                                                transitionDuration: "0.5s"
                                            } :
                                                {
                                                    padding: "1rem",
                                                    marginLeft: "1%",
                                                    width: "auto",
                                                    maxWidth: "40%",
                                                    textAlign: "start",
                                                    alignSelf: "start",
                                                    fontSize: "1rem",
                                                    backgroundColor: "#FF8790",
                                                    borderRadius: "1rem",
                                                    color: "white",
                                                    transition: "ease-in",
                                                    transitionDuration: "0.5s"
                                                }} >

                                                {element.message}

                                            </p>);
                                    })}

                                </div>

                                <div className="mobileMessageboxsendbuttondisplay">

                                    <input
                                        type="text"
                                        value={Currentsentmessage}
                                        onChange={(e) => { Updatecurrentmessage(e); }}
                                        className="mobiledonatorchatinput"
                                        placeholder="enter your text here.."
                                    />

                                    <div className="mobiledonatorchatsendbuttoncontainer">

                                        <AiOutlineSend className="mobiledonatorchatsendbutton" onClick={() => { SendMessage(); }} />

                                    </div>


                                </div>

                            </div> : <div className="mobileMessageSender">

                                    <h1 className="mobileheadingnooneselected">No one for chat selected!</h1>

                            </div>

                        )
                    }
                
                </div>)
            }

            {/* MOBILE DONATOR CHATING SECTION END*/ }

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
export default Donatorchat;