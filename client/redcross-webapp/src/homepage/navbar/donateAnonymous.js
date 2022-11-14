import { useState } from 'react';
import './donateAnonymous.css';
export default function AnonymousForm(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneno, setPhoneno] = useState("");
    const [amount, setAmount] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('your data was recorded');
    }
    return (
        <div className="formmothercointainer">
            <div className="formcointainer">
                <form onSubmit={handleSubmit} className="formclass">
                    <label className="donateAnonymousformheading">
                        <p className="donateAnonymousformheadingtext">DONATE ANONYMOUSLY</p>
                        <div className="donateAnonymousclosebuttoncointainer">
                            <p className="closebtn" onClick={() => { props.cancelAnonymous(); }}>X</p>
                        </div>
                    </label>
                    <div  className="donateAnonymousinputdivision">
                        <label className="donateAnonymousformName">Name<br />
                            <input className="donateAnonymousformNameinput"
                            type="text"
                            value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                    </label>
                    <label className="donateAnonymousformEmail">Email id<br />
                            <input
                                className="donateAnonymousformEmailinput"
                            type="email"
                            value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email id"
                            />
                    </label>
                    <label className="donateAnonymousformPhoneno">Mobile number<br />
                            <input
                                className="donateAnonymousformPhoneinput"
                            type="tel"
                            value={phoneno}
                                onChange={(e) => setPhoneno(e.target.value)}
                                placeholder="Enter your Mobile numbers"
                            />
                    </label>
                    <label className="donateAnonymousformAmount">Amount to donate<br />
                            <input
                                className="donateAnonymousformAmountinput"
                            type="number"
                            value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter the amount you want to donate"
                            />
                        </label>
                    </div>
                    <div className="agreementsection">                 
                        <p className="donateAnonymousformagreement">I,agree to share all the required details by Redcross and I know that my details will not be forwarded to the Officials</p><br />
                        <div className="donatecheckboxcontainer">
                            <input type="checkbox" className="donateAnonymousformcheckbox" />
                        </div>
                    </div>
                    <input type="submit" value="Confirm" className="donateAnonymousconfirm" />
                </form>
            </div>
            
        </div>
        )
}
           // <input type="click" value="Cancel" /><br />