import "./Token.css";
import { useState } from "react"
import { RiAlertFill } from 'react-icons/ri';
const Token = ({vis}) => {


    const [RequestConfirmationText, setRequestConfirmationText] = useState("");//CONFIRMATION TEXT STATE.

    const [ChoiceSelected, setChoiceSelected] = useState(false);//AFTER CLICKING ON REQUEST SATIFIED OR NOT , DISPLAY THE CONFIRMATION INPUT DIVISION BY GETTING TRUE.

    const [TokenConfirm, setTokenConfirm] = useState(false);//AFTER CHECKING CONFIRMATION TEXT , BECOME TRUE.

    const [TokenChoiceType, setTokenChoiceType] = useState(-1);//REQUEST SATISFIED OR NOT SATISFIED TYPE

    const [TokenValue, setTokenValue] = useState(false);//MAIN OUTPUT FROM TOKEN.

    const [FinalSubmitDivsion, setFinalSubmitDivsion] = useState(false);//SET THE FINAL SUBMIT DIVISION VISIBLITY

    //CHECKES FOR ANY CHANGES IN THE INPUT FEILD FOR CONFIRMATION AND MAKES SURES THAT USER HAVE WRITTEN THE RIGHT CONFIRMATION.
    const RequestConfirmationTextChangeNotifier = (e) => {

        setRequestConfirmationText(e.target.value);//SETS THE STATE TO THE INPUT VALUE.

        console.log("TYPING IN THE TEXT FEILD " + e.target.value);

        //IF VALUE == CONFIRM THEN SET setTokenConfirm(true);
        if (e.target.value === "CONFIRM") {

            setTokenConfirm(true);

            alert("CONFIRM");

        }
        else {

            setTokenConfirm(false);

        }


    }

    //AFTER CLICKING ON A RADIO BUTTON , DISPLAY THE CONFRMATION INPUT DIVISION.
    const ConfirmationTypeChanger = (e) => {

        console.log("value of confirmation type changer:" + e.target.value);

        setChoiceSelected(true);//DISPLAYS THE CONFIRMATION INPUT DIVISION.

        //MANUPULATES THE CONFIRMATION INPUT DIVISION.
        if (e.target.value === "1") {
            console.log("Coming to 1");
            setTokenChoiceType(1);
            setRequestConfirmationText("");
        }
        else if (e.target.value === "0") {
            console.log("Coming to 0");
            setTokenChoiceType(0);
            setRequestConfirmationText("");
        }

    }

    //Makes the Final Submit division visible when clicked on submit button 
    const finalSubmitDivision = (e) => {

        if (e.target.value === "1") {
            setFinalSubmitDivsion(true);
        }
        else if (e.target.value === "0") {
            setFinalSubmitDivsion(false);
        }
        
    }

    /*FUNCTION TO SEND FORM DATA , RENAME IF YOU LIKE  */
    const FormSubmit = () => {

    }

    return (
        <div className="TokenMotherContainer">

            {/*UPPER SECTION OF TOKEN START*/ }
            <div className="TokenUpperBar">

                <h2>TOKEN</h2>

                {/*THE VIS FUNCTION IS PASSED AS ARGUMENT FROM REQUESTER/DONATOR CHAT.JS, CONTROLS THE VISIBILITY OF THE TOKEN */ }
                <button id="TokenCloseButton" onClick={() => vis()}><b>X</b></button>

            </div>
            {/*UPPER SECTION 
             * OF TOKEN END*/}

            {/*MIDDLE SECTION OF TOKEN START*/ }
            <form className="TokenFormContainer" >

                <div className="TokenFormContentContainer">

                    <p id="TokenAdvisorySection"><b>NOTE:</b>This is sensitive information , other informatory details go here.</p>

                    {/*
                     THIS IS THE INPUT DIVSION , IT TAKES THE INPUT FROM RADIO BUTTONS AND RADIO BUTTONS WHEN CLICKED UPON 
                     CALLS THE ConfirmationTypeChanger FUNCTION WHICH FIRST OF ALL SETS THE ChoiceSelected VARIABLE SO THAT CONFIRMATION DIVISION CAN BE UNLOCKED AND THEN  TAKES THE DECISION OF THE USER AND SETS IT
                     INTO THE TokenChoiceType VARIABLE   
                     */}
                    <div className="TokenInputdivision">

                        <label id="tokenlabelSatisfied" for="RequestSatisfied">Request Satisfied / Completed</label>

                        <input type="radio" id="RequestSatisfied" name="TokenType" value="1" onChange={(e) => { ConfirmationTypeChanger(e); }} />

                        <label id="tokenlabelNotSatisfied" for="RequestNotSatisfied">Request Not Satified / Not completed</label>

                        <input type="radio" id="RequestNotSatisfied" name="TokenType" value="0" onChange={(e) => { ConfirmationTypeChanger(e); }} />

                    </div>

                    <div className="TokenConfirmationDivision">

                        {/*
                         THIS IS THE CONFIRMATION DIVISION WHICH TAKES THE CONFIRMATION OF THE USER OF THEIR CHOICE
                         */}

                        {ChoiceSelected && (

                            <div className="TokenRequestConfirmationDivision">

                                {(TokenChoiceType === 1 ? true : false) && (

                                    <p id="NoteRequestConfirmationDivision"><b>Note:</b>Type <b>"CONFIRM"</b> to Confirm your Decision to complete the request</p>

                                )}

                                {(TokenChoiceType === 0 ? true : false) && (

                                    <p id="NoteRequestConfirmationDivision"><b>Note:</b>Type <b>"CONFIRM"</b> to Confirm your Decision to leave the chat </p>

                                )}

                                {/*
                                 * THIS IS THE INPUT OF CONFIRMATION DIVISION IT SETS THE RequestConfirmationText VARIABLE
                                 TO THE INPUT GIVEN AND ALSO CALLS THE RequestConfirmationTextChangeNotifier FUNCTION WHENEVER
                                 THERE IS A INPUT AND CHECKS THE INPUT FOR CONFIRM 
                                 */}
                                <input id="RequestConfirmationInput" type="text" value={RequestConfirmationText} minLength="7" maxLength="7" onChange={(e) => { RequestConfirmationTextChangeNotifier(e); }} placeholder="Type CONFIRM" required />

                            </div>
                        )}

                        {!ChoiceSelected && (<p><b>NOTE:</b>Please select one of the given options</p>)}

                    </div>

                </div>

                {/*MIDDLE SECTION
                 * OF TOKEN END*/}


                {/*LOWER SECTION 
                 * OF TOKEN START*/}

                <div className="TokenSubmittionDivision" >

                    {/*THIS DIVISION IS THE SUBMIT DIVISION FIRST IT CHECKS IF THE CONFIRM HAS BEEN INPUTED IN THE CONFIRM DIVISION THEN ONLY IT UNLOCKS THE SUBMIT BUTTON*/ }

                    {TokenConfirm && (

                        <button id="TokenSubmitButton" type="button" value="1" onClick={(e) => finalSubmitDivision(e)} >Submit</button>

                        )}
                   

                    {/*THIS DIVISION IS THE FINAL SUBMIT DIVISION WHEN THE SUBMIT BUTTON IS CLICKED THEN AGAIN IT REQUESTS FOR
                     * THE FINAL CONFIRMATION AS IF THIS WAS NOT DONE BY MISTAKE 
                     */ }
                    {FinalSubmitDivsion && (<div className="TokenFinalSubmitDivsion">

                        <p id="TokenFinalDivisionTopBar"><b>TOKEN CONFIRMATION</b></p>

                        <div className="TokenFinalSubmitDivsionAlert">

                            <RiAlertFill id="TokenAlertImage" />

                            <p id="TokenAlertPara">INFO GOES HERE:</p>

                        </div>

                        <div className="TokenFinalSubmitDivsionButtons">

                            {/* NOTE: FOR KAUSTAV , CALL THE FUNCTION TO SEND DATA HERE */ }
                            <button id="TokenConfirmSubmitButton" type="submit" >confirm</button>

                            <button id="TokenConfirmCancelButton" type="button" value="0" onClick={(e) => finalSubmitDivision(e)} >Cancel</button>

                        </div>

                    </div>)}

                    <button id="TokenCancelButton" type="button" onClick={() => vis() }>Cancel</button>

                </div>

                {/*LOWER SECTION 
                 * OF TOKEN END*/}

            </form>

        </div>
    );
}
export default Token;
