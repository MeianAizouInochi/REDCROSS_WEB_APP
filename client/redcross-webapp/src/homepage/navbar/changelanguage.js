import './changelanguage.css';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

export default function Language(props) {

    const [ischange, setIsChange] = useState(false);

    const changing = () => setIsChange(!ischange);

    return (
        <div className="languageDialogbox">

            <div className="languageDialogboxheader" onClick={changing}>

                <p className="languageDialogboxheader">Change Language</p>

                <IoMdArrowDropdown className="languageDialogboxDropdown" />

            </div>

            {ischange && (

                <div className="languageDialogboxcointainer">

                    <ul className="languageDialogboxlist">

                        <div className="languageDialogboxitems">

                            <li className="languageDialogboxenglish">English</li>

                            <li className="languageDialogboxhindi">हिन्दी</li>

                        </div>

                    </ul>

                </div>
            )}
        </div>

        )
} 