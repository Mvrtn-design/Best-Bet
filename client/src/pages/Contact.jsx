import React from 'react'
import Help from "./partials/Help";
import { useState } from 'react';
import Layout from './partials/Layout';
import { getHelpText } from "./partials/HelpTexts";

function Contact() {
    const [openHelp, setopenHelp] = useState(false);

    if (openHelp) {
        return (
            <Help trigger={openHelp} setTrigger={setopenHelp}>
                {getHelpText("contact")}
            </Help>)
    }
    function handleClickOpenHelp() {
        setopenHelp(!openHelp);
    }
    return (
        <Layout title='Contacto'>
            <h1>Contáctanos</h1>
            <p>
                We would love to hear from you! If you have any questions, comments, or concerns, please don't hesitate to get in touch. You can reach us by email, phone, or mail, or you can fill out the contact form below.
            </p>

            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Message:
                    <textarea name="message"></textarea>
                </label>
                <button type="submit">Submit</button>
            </form>
            <button className="button-help" onClick={handleClickOpenHelp}>?</button>
        </Layout>
    )
}

export default Contact