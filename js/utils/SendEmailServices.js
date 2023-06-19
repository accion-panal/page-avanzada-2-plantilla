import { RealtorSendEmailData } from "../Data/userId.js";
const formEmail = document.getElementById('form-contact');

formEmail.addEventListener('submit', function (e) {
    e.preventDefault();
    let realtorMail = RealtorSendEmailData.public;

    let firstName = document.getElementById('namePublic');
    let email = document.getElementById('emailPublic');
    let phone = document.getElementById('phonePublic');

    let selectOperation = document.getElementById('operationType');
    let selectProperty = document.getElementById('typeOfProperty');
    let selectRegion = document.getElementById('regionText');

    if(selectOperation.value==='0'|| selectProperty.value==='0' || selectRegion.value==='0' ||
       firstName.value==='' || email.value==='' || phone.value===''){
        return;
    }

    fetch(`https://formsubmit.co/ajax/${realtorMail}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            Nombre: firstName.value,
            Correo: email.value,
            Telefono: phone.value,
            Operacion: selectOperation.value,
            Propiedad: selectProperty.value,
            Region: selectRegion.value,
        })
    })
        .then(response => response.json())
        .then((data) => {
            console.log('SendEmail: ',data)
            console.log(data.success)
            console.log('mensaje enviado');
        })
        .catch(error => console.log('SendEmailError: ',error));

})