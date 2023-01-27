import "./requesterchat.css";

import Axios from "axios";

import { useState, useEffect } from "react";

import { chatRDB } from "../../../authchatsystem/firebaseconfig"

import { ref, push, onValue } from "firebase/database";

import { AiOutlineMenu, AiOutlineSend } from 'react-icons/ai';

import { HiOutlineInboxIn } from 'react-icons/hi';

import DbURL from "../../../domainconfig";

const Requesterchat = (props) => {

    const senderusername = props.username;

    const requesterkeyword = "REQUESTER_";

    const Fullusername = requesterkeyword + senderusername;

    const senderid = requesterkeyword + senderusername;

    const [Currentsentmessage, setCurrentsentmessage] = useState("");

    const [Messagesendervisibility, setMessagesendervisibility] = useState(false);

    const [Currentchatuser, setCurrentchatuser] = useState("");

    const [Chatusermssqldata,setChatusermssqldata] = useState(null);

    const [Roomcode1, setRoomcode1] = useState("");

    const [Chatsmessages, setChatsmessages] = useState([]);

    useEffect(() => {

        Axios.post(DbURL+"/api/getuserchatdata", {

            verifiedusername: Fullusername

        }).then((responsedata) => {

           // console.log(responsedata.data.recordset);

            //console.log(typeof responsedata.data.recordset);

            setChatusermssqldata(responsedata.data.recordset);

            //console.log("ran once.");

        });

    }, []);

    useEffect(() => {

        if (Roomcode1 !== "") {

            onValue(ref(chatRDB, "/CHATS/" + Roomcode1+"/MESSAGES"), (snapshot) => {

                console.log("inside onvalue");

                const firebasechatdata = snapshot.val();

                if (firebasechatdata !== null) {

                    let TEMPCHATARRAY = [];

                    //setChatsmessages(Object.keys(firebasechatdata));

                    //console.log(Object.keys(firebasechatdata));

                    Object.keys(firebasechatdata).map((element) => {

                        TEMPCHATARRAY.push(firebasechatdata[element]);

                    });

                    setChatsmessages(TEMPCHATARRAY);

                }

            });
        }

    }, [Roomcode1]);

    useEffect(() => {

        if (Messagesendervisibility === true) {

            var obj = document.getElementById("Messagedisplay");

            obj.scrollTop = obj.scrollHeight;

        }
        
    }, [Chatsmessages]);


    const sendChatdata = () => {

        let roomcode = Roomcode1;

        let roomcode2 = Currentchatuser + Fullusername;

        push(ref(chatRDB, "/CHATS/" + roomcode+"/MESSAGES"), {

            message: Currentsentmessage,
            senderid: senderid
        });
        push(ref(chatRDB, "/CHATS/" + roomcode2+"/MESSAGES"), {

            message: Currentsentmessage,
            senderid: senderid
        });

    }

    const Updatecurrentmessage = (props) => {

        setCurrentsentmessage(props.target.value);
    }

    const showrequesterchat = (props) => {

        setMessagesendervisibility(true);

        setCurrentchatuser(props);

        setRoomcode1(Fullusername + props);

    }

    const SendMessage = () => {

        if (Currentsentmessage !== "") {

            sendChatdata();

            setCurrentsentmessage("");
        }

        console.log("send is invoked");

    }

    //variable for opening pc chat of requester to chat
    const [pcdonatorchatstate, setpcdonatorchatstate] = useState(true);

    //variable for opening mobile list of requester to chat
    const [mobiledonatorchattingliststate, setmobiledonatorchattingliststate] = useState(false);

    const [mobilechattingversion, setmobilechattingversion] = useState(false);

    const mobiledonatorchatlisttoggler = () => setmobiledonatorchattingliststate(!mobiledonatorchattingliststate);


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


    return (

        <div className="Donatorchat">

            {/* PC DONATOR CHATING SECTION START*/}

            {pcdonatorchatstate && (
                <div className="Donatorchatinglistmothercontainer" >

                    <p className="pcrequesterheading">Donators</p>  

                    <ul className="Donatorchatinglistchildcontainer">
                        
                            {(Chatusermssqldata !== null) && Object.keys(Chatusermssqldata).map((element) => {

                                return (
                                    <li className="Donatorchatingitem" onClick={() => { showrequesterchat(Chatusermssqldata[element].DETAILS) }} key={element} >

                                        {Chatusermssqldata[element].DETAILS}

                                    </li>);

                            })}

                    </ul>

                </div>
            )}

            

            {pcdonatorchatstate && (

                Messagesendervisibility ? < div className="MessageSender">

                    <div className="chattingtouser">

                        {Currentchatuser}

                    </div>

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
                            <img src="/emptyinbox.svg" className="pcdonorchatemptyimage" />
                        </div>
                </div>

            )}

            {/* PC DONATOR CHATING SECTION END*/ }


            {/* MOBILE DONATOR CHATING SECTION START*/ }

            {mobiledonatorchattingliststate && (
                <div className="mobileDonatorchatinglistmothercontainer" >
                    <p className="mobilerequesterheading">Requesters</p>  
                    <ul className="mobileDonatorchatinglistchildcontainer">

                        {(Chatusermssqldata !== null) && Object.keys(Chatusermssqldata).map((element) => {

                            return (

                                <li className="mobileDonatorchatingitem" onClick={() => {
                                    showrequesterchat(Chatusermssqldata[element].DETAILS);
                                    mobiledonatorchatlisttoggler();
                                }

                                } key={element} >

                                    {Chatusermssqldata[element].DETAILS}

                                </li>);

                        })}

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

                                    <HiOutlineInboxIn className="mobilechattingtousermenuicon" onClick={
                                        () => {
                                            mobiledonatorchatlisttoggler();
                                        }
                                    } />
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

            {/* MOBILE DONATOR CHATING SECTION END*/}

        </div>
    );
}
export default Requesterchat;