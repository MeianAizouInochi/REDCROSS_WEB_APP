import './RequestPopup.css'
import { useEffect, useState } from "react";
import DbURL from "../../../../../domainconfig";
import Axios from "axios";
import { FcNext } from 'react-icons/fc'
import { AiFillLock } from 'react-icons/ai'

const Requests_Popup = ({ index, collectioncomp, visibilitydata, randint, Requests_list, DONATOR_TABLENAME, passingchangesectiondata }) => {

    //GLOBAL STATE VARIABLES

    let [visibility, setvisibility] = useState(true);//TURNING OFF / ON THE POP UP , SETTING ITS VISIBILITY.

    let [documents, setdocuments] = useState([]);//COLLECTION OF THE DOCUMENTS THE REQUESTER

    let [loaded, setloaded] = useState(false);//VARIABLE FOR DOCUMENT LOADED

    let [unlockChat, setunlockChat] = useState(false);//FOR LOCKING CHAT BUTTON

    let [Description, setDescription] = useState("");

    /*THIS USER EFFECT SETS THE VISIBILITY , TURNS THE POP UP ON 
  * AND CALLS SYNC 1 FUNCTION WHICH LOADS THE DATA OF THE REQUEST
  * AND ITS LISTING TO A STATE OF RANDINT WHICH IS SET UP IN REQUEST LAODER,
  * THE PARENT COMPONENT WHICH GENERATES THIS RANDINT(A SEMA 0 OR 1)
  * ITS USED SO THAT POP UP OPENS AFTER CLOSING BECAUSE STATE SAVE MEMORY 
  * AND NEED A SIGNAL EVERYTIME LIKE MUSULES AND BRAIN.
  */
    useEffect(() => {

        setvisibility(true);
        console.log("CAME IN USE EFFECT!")
        sync1();

    }, [randint])



    //CHANGE VISIBILITY FUNCTION , POP UP TURN OFF / ON FUNCTION
    function changevisibility() {
        setvisibility(false);
        setunlockChat(false);
    }


    /*-------------------------------ASYNC FUNCTION TO RETRIVE DOCUMENT DATA START----------------------------*/

    let tempdoccollection = [];//FOR LOADING THE DOCUMENTS IN TEMP VARIABLE AND THEN INTO DOCUMENTS

    //LOADS AND SETS THE DOCUMETS
    async function sync1() {

        //THESE CALLS LOAD ALL THE DOCUMENT DATA IN THE TEMP VARIABLE tempdoccollection
        await api_call_template("Document1");

        await api_call_template("Document2");

        await api_call_template("Document3");

        await api_call_template("Document4");

        //SETTING THE DOCUMENTS IN DOCUMENTS FUNCTION
        setdocuments(documents = tempdoccollection);

        //INITIALIZES THE LOADED VARIABLE TO 1 AS A KNOWLEGE OF THAT THE
        //DOCUMENTS HAVE LOADED

        await DescriptionLoader();

        console.log("LOADED THE DOCUMENTS")
        setloaded(true);
    }


    //CALL TO LOAD DOCUMENTS
    async function api_call_template(detailtype) {

        let pictemp = [];
        let desctemp = [];

        const responseDocumentdata = await Axios.post(DbURL + "/api/getrequestdetails", {

            TABLE_NAME: Requests_list[index],
            SEMA: 1,
            DETAIL_TYPE: detailtype

        });


        const pic = await btoa(String.fromCharCode(...new Uint8Array(responseDocumentdata.data.recordset[0].FILE_DETAILS.data)));

        pictemp.push(`data:image/*;base64,${pic}`);

        console.log("pic temp :" + pictemp);

        const desc = responseDocumentdata.data.recordset[0].DETAILS;

        desctemp.push(desc);

        console.log("DESCRIPTION OF DOCUMENT :" + responseDocumentdata.data.recordset[0].DETAILS)
        tempdoccollection.push({
            image: pictemp,
            description: desctemp
        });
    }

    async function DescriptionLoader() {

        const responseDescriptiondata = await Axios.post(DbURL + "/api/getrequestdetails", {

            TABLE_NAME: Requests_list[index],
            DETAIL_TYPE:"",
            SEMA: 2

        });

        if (responseDescriptiondata.data.recordset.length === 0) {
            setDescription(Description = "NO DESCRIPTION OF REQUEST!")
        }
        else {
        
            setDescription(Description = responseDescriptiondata.data.recordset[0].DETAILS_DESCRIPTION)
        }
    }
    //CALL TO LOAD
    /*-------------------------------ASYNC FUNCTION TO RETRIVE DOCUMENT DATA END----------------------------*/






    /*-------------------------------FUNCTIONALITY FOR MOVING TO NEXT DOCUMENT START--------------------- */
    const [current, setcurrent] = useState(0);

    const nextslide = () => {

        setcurrent(current === 4 - 1 ? 0 : current + 1)

    }

    const prevslide = () => {

        setcurrent(current === 0 ? 4 - 1 : current - 1)

    }
    /*-------------------------------FUNCTIONALITY FOR MOVING TO NEXT DOCUMENT END--------------------- */





    /*--------------------CHAT CHECKING SECTION START--------------------------*/


    let [NoOfChats, setNoOfChats] = useState(0);//GET THE NO OF CHAT A DONATOR/REQUESTER HAVE


    // GETS IF THE DONATOR HAVE ALREADY CONFIRMED THE CHAT OR REQUESTER IS ALREADY ENGAGED
    let [RequestEngaged, setRequestEngaged] = useState(false);


    //FUNTION THAT CHECKS THE CONSTRATINTS AND UPDATE TABLE
    async function check() {

        //CHECKS IF THE DONATOR HAVE ALREADY CONFIRMED THE REQUEST
        await already_talked("DONATOR");
        if (RequestEngaged) {



            //CHECK IF THE DONATORS HAVE LESS THAN 5 CHATS.
            await get_no_of_chats("DONATOR");
            if (NoOfChats < 5) {


                //CHECK IF THE REQUESTER HAVE LESS THAN 5 CHATS.
                await get_no_of_chats("REQUESTER");
                if (NoOfChats < 5) {

                    //CHECK IF THE REQUESTER IS ALREADY CHATING TO SOMEONE ELSE ON THE SAME REQUEST
                    await already_talked("REQUESTER");
                    if (RequestEngaged) {

                        //ALERT THE DONATOR THAT THE REQUEST IS ACCEPTED.
                        alert("REQUEST ACCEPTED");

                        //UPDATE THE TABLES OF REQUESTER AND DONATOR
                        await setchat();//FAIL SAFE REQUIRED
                        setRequestEngaged(false);//MEMORY RESET


                    }

                    else {
                        alert("This requester is engaged to another donator , please try another Request")
                    }

                }

                else {
                    alert("THE REQUESTER IS ALREADY CHATTING TO 5 REQUESTERS ,REQUESTER IS A HOE")
                }

            }
            else {
                alert("YOU ARE ALREADY TALKING TO 5 REQUESTERS , DELETE WHATEVER")
            }
        }
        else {
            alert("You have already confirmed the request,check the CHATS section on the nav bar ")
        }
    }


    //FUNCTION TEMPLATE TO GET NO OF CHATS (DONATOR/REQUESTER)
    async function get_no_of_chats(TYPE) {

        let Table_name;

        if (TYPE === "DONATOR") {
            Table_name = DONATOR_TABLENAME;
        }
        else {
            Table_name = "REQUESTER_" + Requests_list[index].substr(Requests_list[index].lastIndexOf('_') + 1);
            //REQUESTER TABLE NAME FIRST CHAT
        }

        console.log("TABLE NAME TO CHECK :" + Table_name);

        const response_of_check = await Axios.post(DbURL + "/api/checkchats", {

            TABELNAME: Table_name,
            SEMA: 0

        });

        console.log("RESPONSE OF RECORD :" + response_of_check.data.recordset.length);

        if (TYPE === "REQUESTER") {
            setNoOfChats(NoOfChats = response_of_check.data.recordset.length);
        }
        if (TYPE === "DONATOR") {
            setNoOfChats(NoOfChats = response_of_check.data.recordset.length);
        }

    }


    //FUNCTION TEMPLATE TO GET DATA TO CHECK IF DONATOR ALREADY CONFIRMED ? / REQUESTER ENGAGED ?
    async function already_talked(TYPE) {

        let Table_name;

        if (TYPE === "DONATOR") {
            Table_name = DONATOR_TABLENAME;
        }
        else {
            Table_name = "REQUESTER_" + Requests_list[index].substr(Requests_list[index].lastIndexOf('_') + 1);
        }

        let selected_Request_search = "CHAT_" + Requests_list[index].substr(Requests_list[index].indexOf('_') + 1);
        console.log(selected_Request_search + " : " + TYPE);

        const response_of_check = await Axios.post(DbURL + "/api/checkchats", {

            TABELNAME: Table_name,
            SEMA: 1,
            TYPE_OF_REQUEST: selected_Request_search

        });

        console.log(JSON.stringify(response_of_check));

        if (TYPE === "DONATOR") {
            if (response_of_check.data.recordset.length === 1) {
                //CHANGING HERE
                //console.log("changing state to fasle when length 1")
                setRequestEngaged(RequestEngaged = false);
                //console.log("STATE NOW " + RequestEngaged)


            }
            else if (response_of_check.data.recordset.length === 0) {
                //console.log("changing state to true when length 0")
                setRequestEngaged(RequestEngaged = true);
                //console.log("STATE NOW " + RequestEngaged)

            }
            else {
                //console.log("DATABASE CORRUPTED ," + Table_name);
                setRequestEngaged(RequestEngaged = false);
            }
        }
        else {
            if (response_of_check.data.recordset.length === 1) {
                //CHANGING HERE
                setRequestEngaged(RequestEngaged = false);

            }
            else if (response_of_check.data.recordset.length === 0) {
                setRequestEngaged(RequestEngaged = true);

            }
            else {
                //console.log("DATABASE CORRUPTED ," + Table_name);
                setRequestEngaged(RequestEngaged = false);
            }
        }

        //console.log("RequestEngaged BOOL CHECK: " + RequestEngaged);

    }


    //FUNCTION TO UPDATE TABLES OF DONATOR AND REQUESTER FOR CHAT IF CONSTRAINS ARE CLEARED
    async function setchat() {

        const Table_name = "REQUESTER_" + Requests_list[index].substr(Requests_list[index].lastIndexOf('_') + 1);

        console.log("REQUESTER TABLE NAME :" + Table_name);
        console.log("DONATOR TABLE NAME :" + DONATOR_TABLENAME);

        const request_type_chat = "CHAT_" + Requests_list[index].substr(Requests_list[index].indexOf('_') + 1);

        console.log("TYPE OF REQUEST CHAT :" + request_type_chat);

        //INSERTING DATA INTO DONATOR 
        Axios.post(DbURL + "/api/newuserinfo", {

            verifiedusername: DONATOR_TABLENAME,
            DETAILS_TYPE: request_type_chat,
            DETAILS: Table_name,
            CONFIRMATION: "1"

        }).then((response) => {

            console.log(response);

            if (response.status === 200) {

                console.log("VALUES GOT INSERTED  FOR DONATOR!");

            }

        }).catch(function (error) {

            console.log(error);

        });

        //INSERTING DATA INTO REQUESTER 
        Axios.post(DbURL + "/api/newuserinfo", {

            verifiedusername: Table_name,
            DETAILS_TYPE: request_type_chat,
            DETAILS: DONATOR_TABLENAME,
            CONFIRMATION: "1"

        }).then((response) => {

            console.log(response);

            if (response.status === 200) {

                console.log("VALUES GOT INSERTED  FOR REQUESTER!");

            }

        }).catch(function (error) {

            console.log(error);

        });

        setunlockChat(true);
    }

    /*--------------------CHAT CHECKING SECTION END--------------------------*/




    return (
        <div className="popupcardmother">

            {(visibility && visibilitydata) && (
                <div className="popupcard">

                    <div className="popuptopbar">

                        <p className="popupclose" onClick={(e) => { changevisibility() }}><b>X</b></p>

                    </div>

                    <p className="popupdetail">{collectioncomp.detail}</p>

                    <div className="block1">

                        <div className="Requester_personal_details">

                            <img src={collectioncomp.image} alt="pop up image" className="popupcardimage" />

                            <p className="popupname">{collectioncomp.name}</p>

                        </div>

                        <p className="popupdescription">

                            {Description}

                        </p>

                    </div>
                    <div className="block2">

                        {loaded && (<div className="Documentsection">

                            {documents.map((slide, index) => {
                                    return (
                                        <div className={index === current ? 'Requestslide active' : 'Requestslide'} key={index}>

                                            {index === current && (
                                                <>
                                                    <img src={slide.image === null ? './BannerOnError.svg' : slide.image} alt='banner' className="Request_Document_image" />

                                                </>
                                            )}

                                        </div>
                                    );
                                })
                            }

                            <FcNext className="right-arrow" onClick={nextslide} />

                        </div>)}


                        {loaded && (<div className="subblock2" >

                            <p className="Request_Document_Description">{documents[current].description}</p>

                            <div className="Request_confirm_block">

                                <div className="button_confirm_block">

                                    <button className="request_confirm_button" onClick={(e) => { check() }}>Confirm Request</button>

                                    <p><b>Note :</b>Only after clicking confirm button you can chat with the requester</p>
                                </div>

                                <div className="button_chat_block">
                                    {unlockChat && (<button className="chat_requester_button" onClick={(e) => { passingchangesectiondata(1) }} >Chat</button>)}
                                    {!unlockChat && (<AiFillLock alt="lockbutton" className="chat_requester_lock" />)}
                                </div>
                            </div>
                        </div>)}
                    </div>

            
        </div>)}

    </div>)
}

export default Requests_Popup;