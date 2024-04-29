import React from 'react'

export function getHelpText(page) {
    switch (page) {
        case "home": return (
            <div>
                <h2 >Cuadro de ayuda para la página de inicio</h2>
                <hr></hr>
                <p>
                    Bienvenido a BEST BET. Esta es la página principal, donde encontrarás enlaces rápidos a diversas funciones de nuestra plataforma.
                </p>
                <p>
                    Debajo de la cabecera, encontrará una galería de imágenes con enlaces a diferentes secciones de nuestra plataforma. La primera imagen está vinculada a la página "Amistoso".
                    Esta página te permite iniciar rápidamente un partido amistoso con otro usuario.
                </p>
                <p>
                    La segunda imagen es una foto de un campo de fútbol, y está enlazada a la página "Visualizar clubes".
                    Esta página te permite visualizar y gestionar los diferentes clubes de fútbol que forman parte de nuestra plataforma.
                </p>
                <p>
                    La tercera imagen es una foto de un estadio, y está enlazada a la página "Torneo". Esta página te permite crear y gestionar torneos para los clubes de fútbol de nuestra plataforma.
                </p>
                <p>
                    Esperamos que disfrute utilizando nuestra plataforma. Si tiene alguna sugerencia o comentario, no dude en hacérnoslo saber. Siempre estamos buscando formas de mejorar nuestro sitio web y ofrecer la mejor experiencia posible a nuestros usuarios.
                </p>
            </div>
        );
        case "match":
            return (
                <div> <h2 >Cuadro de ayuda: partido amistoso</h2>
                    <hr></hr>
                    <p>En la parte superior de la página, hay dos menús desplegables para seleccionar los equipos local y visitante para el partido. El usuario puede seleccionar un equipo de una lista de equipos disponibles.</p>
                    <p> Una vez que el usuario ha seleccionado los equipos, haga clic en el botón "VER PARTIDO" para pasar a la siguiente sección.</p>
                    <p>La siguiente sección muestra los detalles del partido, incluidos los equipos, la fecha y el lugar del partido, y el marcador actual. El usuario puede realizar apuestas sobre el partido haciendo clic en uno de los tres botones, cada botón corresponde a un resultado diferente del partido (es decir, el equipo local gana, el partido termina en empate, o el equipo visitante gana), y tiene una cuota asociada, que es la cantidad de dinero que el usuario ganará si su apuesta tiene éxito. </p>
                    <p>Debajo de los detalles del partido, hay una sección para realizar apuestas. El usuario puede introducir la cantidad de dinero que desea apostar y, a continuación, hacer clic en uno de los tres botones para realizar la apuesta. El usuario también puede aumentar o disminuir la cantidad de dinero que quiere apostar utilizando los botones "+" y "-". Una vez que el usuario ha realizado sus apuestas, puede hacer clic en el botón "Realizar apuesta" para enviar sus apuestas. </p>
                    <p> En la parte derecha de la página, hay una sección para mostrar la información del perfil del usuario, incluyendo su nombre de usuario, el número de monedas que tiene y el número de apuestas que ha realizado. El usuario puede hacer clic en el botón "Ver Apuestas" para ver sus apuestas actuales. </p>
                </div>
            );
        case "clubs":
            return (
                <div>
                    <h2>Cuadro de ayuda: visualización de clubes</h2>
                    <hr></hr>
                    <p>
                        Bienvenido a la página de Clubes Esta página está diseñada para proporcionarle información sobre diversos clubes deportivos de toda la plataforma.
                        Aquí tienes un desglose de las diferentes secciones de la página:
                    </p>
                    <ul>
                        <li>
                            <strong>Lista de clubes: </strong>En la parte izquierda de la página encontrarás una lista de clubes.
                            Cada nombre de club es un botón sobre el que se puede hacer clic. Al hacer clic en el nombre de un club, la página mostrará información detallada sobre ese club en la parte derecha de la página.
                        </li>
                        <li>
                            <strong>Información del club: </strong>Al hacer clic en el nombre de un club, la información del club aparecerá en esta sección.
                            La información suele incluir el nombre completo del club, el país, el estadio, los colores y el apodo.
                        </li>
                    </ul>
                </div>
            )
        case "contact":
            return (
                <div>
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
                </div>
            )
        default:
            return null;
    }
}