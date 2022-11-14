import './feedbackpage.css';


const Feedbackpage = () => {

    return (
        <div className="feedbackcontainer">
            <div className="feedbackheadingcontainer">
                <p className="feedbackfourmheadingtext">
                    Feedback Fourm
                    <hr className="hrlinebelowfeedbackheading" />
                </p>
            </div>
            <div className="feedbackbodycontainer">
                <label className="feedbackbodyName"><p>Name</p>
                    <input className="feedbackbodyNameinput"
                        type="text"
                        placeholder="Enter your name"
                    />
                </label>
                <label className="feedbackbodyEmail"><p>Email id</p>
                    <input
                        className="feedbackbodyEmailinput"
                        type="email"
                        placeholder="Enter your email id"
                    />
                </label>
                <label className="feedbackbodyPhoneno"><p>Mobile number</p>
                    <input
                        className="feedbackbodyPhoneinput"
                        type="tel"
                        placeholder="Enter your Mobile numbers"
                    />
                </label>
                <label className="feedbackbodydescription"><p>Description</p>
                    <input
                        className="feedbackbodydescriptioninput"
                        type="tel"
                        placeholder="Enter your feedback here"
                    />
                </label>
                <button className="feedbackbodysubmitbutton">Submit</button>
            </div>
        </div>   
        )
}

export default Feedbackpage;