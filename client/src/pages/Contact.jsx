import React from 'react'
import Help from "./partials/Help";
import { useState } from 'react';

function Contact() {
    const [openHelp, setopenHelp] = useState(false);

    if (openHelp) {
        return (
            <Help trigger={openHelp} setTrigger={setopenHelp}>

                <h2 >Cuadro de ayuda para la página de inicio</h2>
                <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
                    Si tienes alguna duda o inquietud no dudes en preguntarnos.       </p>
                <div style={{ backgroundColor: `red` }} className="my-div" >
                    ...
                </div>
            </Help>)
    }
    function handleClickOpenHelp() {
        setopenHelp(!openHelp);
    }
    return (
        <div>
            <h1>Contact Us</h1>
            <p>
                We would love to hear from you! If you have any questions, comments, or concerns, please don't hesitate to get in touch. You can reach us by email, phone, or mail, or you can fill out the contact form below.
            </p>
            <h2>Email</h2>
            <p>
                You can email us at [email address]. We will do our best to respond to your inquiry as soon as possible.
            </p>
            <h2>Phone</h2>
            <p>
                You can call us at [phone number]. Our phone lines are open Monday through Friday, 9am to 5pm EST.
            </p>
            <h2>Mail</h2>
            <p>
                You can mail us at [mailing address]. Please allow 7-10 business days for delivery.
            </p>
            <h2>Contact Form</h2>
            <p>
                If you prefer, you can also fill out the contact form below. We will receive your message and get back to you as soon as we can.
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
        </div>
    )
}

export default Contact