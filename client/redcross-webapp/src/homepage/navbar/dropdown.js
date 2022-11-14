import { useState,useEffect } from 'react';
import './dropdown.css';
import AnonymousForm from './donateAnonymous.js';
import UnAnonymousForm from './donateUnanonymous.js';
import { IoMdArrowDropdown } from 'react-icons/io';


export default function DD() {

    const [isOpen, setIsOpen] = useState(false);

    const toggling = () => setIsOpen(!isOpen);

    const [anonymous, setAnonymous] = useState(false);

    const donateAnonymous = () => { setAnonymous(false); }

    const [unanonymous, setUnanonymous] = useState(false);

    const donateUnanonymous = () => { setUnanonymous(false); }       

    return (

        <div className="main">

            <div className="header" onClick={toggling}>

                <p className="Donatenowheading"> Donate now </p>

                <IoMdArrowDropdown className="dropdowndonateicon" />

            </div>

            {isOpen && (

                <div className="container">

                    <ul className="list">

                        <div className="items">

                            <li className="DonateAnonymously" onClick={() => { setAnonymous(true); }}>Donate Anonymously</li>

                            {anonymous && <AnonymousForm cancelAnonymous={donateAnonymous} />}

                            <li className="DonatePublicly" onClick={() => { setUnanonymous(true); }}>Donate Publicly</li>

                            {unanonymous && <UnAnonymousForm cancelUn={donateUnanonymous} />}

                        </div>

                    </ul>

                </div>

                )}
        </div>
    )
}
