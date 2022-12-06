import { useEffect, useState } from "react";
import Axios from "axios";
import './RequestsLoader.css';
import { Request_Data } from './RequestsData';
import RequestSelector from './requestselector/requestselector';
import DbURL from "../../../../domainconfig";
import { GrNext, GrPrevious } from 'react-icons/gr'

import Requests_Popup from './requestPopup/RequestPopup';

import LoadingIcon from './loadingRequesterAnim'

const RequestLoader = ({ DONATOR_TABLENAME, passingchangesectiondata }) => {

    //STATES
    var [Request_collection, setRequest_collection] = useState([]);//HAVE THE FINAL ARRAY OF OBJECTS TO BE DISPLAYED

    let [RAW_Requests_list, setRAW_Requests_list] = useState([]);//HAVE ALL THE LIST OF REQUESTS CURRENTELY AVAILABLE (RAW DATA)

    let [Requests_list_sorted, setRequests_list_sorted] = useState([]);//ACTS AS A INTERMEDIATE BUCKET FOR REQUESTS (SEARCHING A SINGLE TYPE OF REQUEST) RAW REQUEST LIST -> REQUEST LIST SORTED -> REQUEST ARRAY (Containg the 10 current list)

    const [loaded, setloaded] = useState(0);//IS TURNED ON WHEN THE REQUEST LIST IS FILLED

    var [svgload, setsvgload] = useState(false);//VARIABLE FOR LOADING SCREEN

    var [Request_array, setRequest_array] = useState([]);//LOADS THE RAW REQUEST DATA CORRESPONDING TO THE PAGE 

    var [Page_no, setPage_no] = useState(1);//CURRENT PAGE 

    var [Total_pages, setTotal_pages] = useState(0);//TOTAL NO OF PAGES 

    let filler_size = 0;//THIS VARIABLE DETERMINES THE NUMBER OF ELEMENTS IN EACH PAGE.

    var [Type_of_Request, setType_of_Request] = useState("");//TAKES THE TYPE OF REQUEST

    let [indexdata, setindexdata] = useState(0);//USED IN SENDING INDEX TO REQUEST POP UP

    let [collectiondata, setcollectiondata] = useState({});//IMP* HAVE THE 10 REQUEST IN DISPLAYABLE FORM.

    let [vis, setvis] = useState(false);//VISIBILITY SEMA USED IN VISIBILTY OF REQUEST POP UP.

    //TEMP VARIABLES 
    var profile_pic_array = [];
    var requester_name_array = [];
    var request_type_array = [];
    var request_detail_array = [];
    var user_name_array = [];



    /*----------------------------USE EFFECTS START ---------------------------------------------------------*/

    //THIS USE EFFECT IS CALLED ONCE AND LOADS THE WHOLE DATA REQUEST DATA
    useEffect(() => {

        console.log("USEFFECT 1");

        sync1();

    }, []);

    //THIS USE EFFECT IS CALLED EVERYTIME THE PAGE NO CHANGES 
    useEffect(() => {

        setsvgload(false);

        if (loaded && (Page_no >= 1 || Type_of_Request != "")) {

            console.log("USEFFECT 2 GETTING CALLED!")

            sync2();

        }
    }, [Page_no, Type_of_Request])

    /*----------------------------USE EFFECTS END ---------------------------------------------------------*/





    /*----------------------------SYNCHRONIZER FUNCTIONS START ------------------------------------------------*/

    async function sync1() {

        //Setter Function gets the data from the Request data Module.
        async function setter() {

            //FROM IMPORT REQUEST_DATA() PROMISE.
            await Request_Data().then(data => {

                setRAW_Requests_list(RAW_Requests_list = data);
                //
            });

            console.log("RAW REQUEST LIST IN SETTER " + RAW_Requests_list);
            console.log("setter has ended");
            //console.log("USE EFFECT REQUESTER LIST " + Requests_list);
        }

        console.log("Setter in sync 1 ");
        await setter();

        console.log("SORTER in sync 1 ");
        await SORTER();

        console.log("filler in sync 1 ");
        await filler();

        console.log("profile pic in sync 1 ");
        await getProfilepic();

        console.log("request detail in sync 1 ");
        await getrequestdetail();

        console.log("Requester name in sync 1 ");
        await getrequestername();

        console.log("collectionfiller in sync 1 ");
        await collectionfiller();

        //THE DATA FOR DISPLAYING HAVE BEEN LOADED.
        setloaded(1);

        setsvgload(true);
    }

    async function sync2() {


        //IMPORTANT!!!!!!!! TEMP VARIABLES CLEAN UP
        profile_pic_array = [];
        requester_name_array = [];
        request_type_array = [];
        request_detail_array = [];
        user_name_array = [];

        //IMPORTANT!!!!!!!!CLEANING UP STATE VARIABLES.
        setRequest_collection([]);

        setRequests_list_sorted([]);

        setRequest_array([]);

        //console.log("CHECKING THE REQUEST COLLECTION " + Request_collection.length);
        //console.log("CHECKING THE REQUEST ARRAY " + Request_array.length);
        //console.log("REQUEST LIST " + Requests_list.length);

        await SORTER();

        await filler();

        await getProfilepic();

        await getrequestdetail();

        await getrequestername();

        await collectionfiller();

        setsvgload(true);
    }

    /*----------------------------SYNCHRONIZER FUNCTIONS END ------------------------------------------------*/





    /*----------------------------SORTER ASYNC FUNCTION START------------------------------------------------------*/

    async function SORTER() {

        console.log("SORTER IS CALLED.");

        let Temp_sorted_array = [];

        const size = RAW_Requests_list.length;

        if (Type_of_Request === "all" || Type_of_Request === "") {

            setRequests_list_sorted(Requests_list_sorted = RAW_Requests_list);

            console.log("if in SORTER all , SORTED REQUEST LIST :" + Requests_list_sorted);

        }
        else {

            for (let i = 0; i < size; i++) {

                const underscore_1 = RAW_Requests_list[i].indexOf("_");//first underscore

                const underscore_2 = RAW_Requests_list[i].lastIndexOf("_");//last underscore

                const got_type = RAW_Requests_list[i].substr(underscore_1 + 1, underscore_2 - underscore_1 - 1);


                //CHECKING EQUALITY (MANIPULATION_1)
                if (got_type === Type_of_Request) {

                    console.log("Type of Request in Spinner: " + Type_of_Request);

                    console.log("type of request in sorter: " + got_type);

                    Temp_sorted_array.push(RAW_Requests_list[i]);

                }
            }

            //SETTING THE FINAL SORTED LIST
            setRequests_list_sorted(Requests_list_sorted = Temp_sorted_array);

            console.log("Sorted Requests List after Sorting: " + Requests_list_sorted);

        }
        //console.log("sorted list" + Requests_list_sorted);
        console.log("SOTTER has ended");


    }

    /*----------------------------SORTER ASYNC FUNCTION END--------------------------------------------------------*/






    /*----------------------------ASYNC FUNCTIONS (GETTER AND SETTERS) START---------------------------------------------------------*/

    //THIS ASYNC FUNCTION FILLS THE REQUESTER ARRAY STATE VARIABLE
    async function filler() {

        //fills 10 OR NEEDED elements in Request_array according to page number
        //console.log("entered useeffect for 10 filler");

        const size = Requests_list_sorted.length;

        setTotal_pages(Math.floor(size / 10) + 1);

        var start = Page_no * 10 - 10;

        var end = Page_no * 10;

        let Temp_Request_array = [];

        if (end > size) {

            end = Math.abs((end - size) - end);

            filler_size = Math.abs((end - size) - end) - start;
        }
        else {

            filler_size = 10;
        }

        //console.log("start =" + start);
        //console.log("end =" + end);

        for (var i = start; i < end; i++) {

            Temp_Request_array.push(Requests_list_sorted[i]);

        }

        setRequest_array(Request_array = Temp_Request_array);

        console.log("Request array in filler  = " + Request_array);

        console.log("filler has ended");
    }

    //THIS ASYNC FUNCTION FILLS THE TEMP profile_pic_array , user_name_arraY , request_type_array.
    async function getProfilepic() {

        for (let i = 0; i < filler_size; i++) {

            const underscore_1 = Request_array[i].indexOf("_");//first underscore

            const underscore_2 = Request_array[i].lastIndexOf("_");//last underscore

            const Fullusername = "REQUESTER_" + Request_array[i].substr(underscore_2 + 1);

            user_name_array.push(Fullusername);//fills the username array

            request_type_array.push(Request_array[i].substr(underscore_1 + 1, underscore_2 - underscore_1 - 1));//fills the request type array

            var responseimagedata = await Axios.post(DbURL + "/api/getuserimagedata", {

                username: user_name_array[i]

            });

            if (responseimagedata.data.recordset.length === 0) {

                console.log("Something Bad Happened in getting profile pic!");

            }
            else if (responseimagedata.data.recordset.length === 1) {

                const profile_pic = await btoa(String.fromCharCode(...new Uint8Array(responseimagedata.data.recordset[0].DETAILS.data)));

                profile_pic_array.push(`data:image/*;base64,${profile_pic}`); //fills the profile pic array
            }


        }

        //console.log("profile pic array = " + profile_pic_array);

        //console.log("user name array = " + user_name_array);

        //console.log("Request type array = " + request_type_array);

        console.log("profile pic has ended");

    }

    //THIS ASYNC FUNCTION FILLS THE request_detail_array.
    async function getrequestdetail() {

        for (let i = 0; i < filler_size; i++) {

            var responsedetaildata = await Axios.post(DbURL + "/api/getrequestdetails", {

                TABLE_NAME: Request_array[i],
                SEMA: 0,
                DETAIL_TYPE: "Request_data"

            });

            request_detail_array.push(responsedetaildata.data.recordset[0].DETAILS);//fills the request detaiL array

        }

        //console.log("detail of requests = " + request_detail_array);

        console.log("request detail has ended ");

    }

    //THIS ASYNC FUNCTION FILLS THE requester_name_array.
    async function getrequestername() {

        console.log("getting into resquestername to get names");

        for (let i = 0; i < filler_size; i++) {

            var responseRequesterNameData = await Axios.post(DbURL + "/api/getuserdata", {

                verifiedusername: user_name_array[i]

            });

            requester_name_array.push(responseRequesterNameData.data.recordset[0].DETAILS); //fills the user name array(users real name)

        }

        //console.log("Requester name array = " + requester_name_array);

        console.log("requester name has ended ");
    }

    //THIS ASYNC FUNCTION FILLS THE ARRAY OF OBJECTS NEED TO DISPLAY
    async function collectionfiller() {

        let Temp_Request_collection = [];

        for (let i = 0; i < filler_size; i++) {

            Temp_Request_collection.push({
                image: profile_pic_array[i],
                name: requester_name_array[i],
                type: request_type_array[i],
                detail: request_detail_array[i]
            })

        }

        setRequest_collection(Temp_Request_collection);

        //console.log("FINAL REQUEST COLLECTION :" + Request_collection);

        console.log("collection filler has ended");
    }

    /*----------------------------ASYNC FUNCTIONS (GETTER AND SETTERS) END---------------------------------------------------------*/





    //FUNCTION WHICH CHANGES REQUEST TYPES
    const Request_selected_by_user = (data) => {

        setType_of_Request(data);

        console.log("REQUEST GOT CHANGED TO :" + data);

    }





    /*-----------------------------PAGE CHANGER FUNCTIONALITY START -----------------------------*/

    function next() {

        let test = Page_no;

        test = test + 1;

        if (test > Total_pages) {

        }
        else {
            setPage_no(Page_no + 1);
        }
    }

    function previous() {

        let test = Page_no;

        test = test - 1;

        if (test < 1) {

        }
        else {
            setPage_no(Page_no - 1);
        }
    }

    /*-----------------------------PAGE CHANGER FUNCTIONALITY END -----------------------------*/



    //SENDS POPUP OPEN DATA TO REQUEST POP UP COMPONENT ACTS AS A BRAIN TO MUSULE(REQUEST POPUP) START
    let [random, setrandom] = useState(0);

    function sendData(data) {
        //console.log("getting index : " + data);
        console.log("index from :" + data);
        setindexdata(data);
        setcollectiondata(Request_collection[data]);
        setvis(vis = true);
        //console.log("visivilty :" + vis);
        randomgen();
    }

    function randomgen() {
        if (random === 1) {
            setrandom(!random);
        }
        else {
            setrandom(!random);
        }
    }
    //ENDS 


    return (
        <div className="requestscontainer">

            <div className="requestselectormother">

                <RequestSelector Request_selected_by_user={Request_selected_by_user} />

            </div>


            {svgload && (
                <div className="requestdummyslider">
                    {
                        Request_collection.map((slide, index) => {
                            return (

                                <div className="requestdummyslide" key={index} onClick={(e) => { sendData(index) }}>

                                    <h6 className="typeofrequest">{slide.type}</h6>
                                    <img src={slide.image} className="requestimage" ></img>

                                    <div className="headingRequester">

                                        <p className="requestname">{slide.name}</p>
                                        <hr className="horizontalline" />

                                    </div>

                                    <p className="requestdescription">

                                        {slide.detail}

                                    </p>

                                </div>
                            )
                        })
                    }
                </div>
            )}
            
            {!svgload && (<LoadingIcon />)}

            <Requests_Popup
                index={indexdata}
                collectioncomp={collectiondata}
                visibilitydata={vis} randint={random}
                Requests_list={Request_array}
                DONATOR_TABLENAME={DONATOR_TABLENAME}
                passingchangesectiondata={passingchangesectiondata}
            />

            <div className="pagescroller">

                <GrPrevious className="next/prevButtons" onClick={previous}></GrPrevious>

                <p>{Page_no} out of {Total_pages}</p>

                <GrNext className="next/prevButtons" onClick={next}></GrNext>

            </div>

        </div>
    )

}

export default RequestLoader;

