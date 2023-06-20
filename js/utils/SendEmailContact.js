import { RealtorSendEmailData } from "../Data/userId.js";
const formEmail = document.getElementById('form-contact');

formEmail.addEventListener('submit', function (e) {
    e.preventDefault();


    let firstName = document.getElementById('nameContact');
    let email = document.getElementById('emailContact');
    let subject = document.getElementById('subjectContact');
    let phone = document.getElementById('phoneContact');
    let message = document.getElementById('messageContact');

    let realtorMail = RealtorSendEmailData.contact;

    if(subject.value===''|| message.value==='' || firstName.value==='' || email.value==='' || phone.value===''){
        return;
    }

    fetch(`https://formsubmit.co/ajax/${realtorMail}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nombre: firstName.value,
            Correo: email.value,
            Telefono: phone.value,
            Sujeto: subject.value,
            Mensaje: message.value,
        })
    })
        .then(response => response.json())
        .then((data) => {
            console.log('SendEmail: ',data)
            console.log(data.success)
        })
        .catch(error => console.log('SendEmailError: ',error));

})