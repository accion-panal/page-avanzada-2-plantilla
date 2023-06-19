import { PropertyData } from "../Data/userId.js";

const form = document.getElementById('form-contact');

let userCompanyId = PropertyData.companyId;

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let alertElement = document.querySelector('.alert');

    let firstName = document.getElementById('namePublic');
    let email = document.getElementById('emailPublic');
    let phone = document.getElementById('phonePublic');

    let selectOperation = document.getElementById('operationType');
    let selectProperty = document.getElementById('typeOfProperty');
    let selectRegion = document.getElementById('regionText');

    if (selectOperation.value === '0' || selectProperty.value === '0' || selectRegion.value === '0' ||
        firstName.value === '' || email.value === '' || phone.value === '') {
        alertElement.textContent = 'Todos los campos son obligatorios';
        alertElement.classList.add('alert-danger');
        alertElement.classList.remove('visually-hidden');
        return;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "companyId": userCompanyId,
        "typeProperty": selectProperty.value,
        "action": selectOperation.value,
        "fullName": firstName.value,
        "email": email.value,
        "phone": phone.value,
        "region": selectRegion.value,
        "commune": "string",
        "address": "string",
        "landArea": "string",
        "termsAndConditions": true
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        //   redirect: 'follow'
    };

    fetch("https://aulen.partnersadvisers.info/contact/2/", requestOptions)
        .then(response => response.text())
        .then((result) => {
            //result: 'ok' + message: 'Mensaje guardado'
            console.log(result)
            let resultObj;
            resultObj = JSON.parse(result);
            console.log(resultObj.status)
            if (resultObj.status === "ok") {
                //Vaciar Inputs
                firstName.value = '';
                email.value = '';
                phone.value = '';
                selectOperation.value = '0';
                selectProperty.value = '0';
                selectRegion.value = '0';
                //Mensaje de Alerta : Success
                let alertElement = document.querySelector('.alert');
                alertElement.textContent = 'El mensaje fue enviado con éxito.';
                alertElement.classList.add('alert-success');
                alertElement.classList.remove('visually-hidden');
                setTimeout(function () {
                    // Ocultar alerta despues de 5seg
                    alertElement.classList.add('visually-hidden');
                    alertElement.classList.remove('alert-success');
                }, 5000);
                return;
            }
            console.log('error: ',result.status);
        })
        .catch((error) => {
            //Mensaje de Alerta : Error
            let alertElement = document.querySelector('.alert');
            alertElement.textContent = 'Ocurrio un error al enviar correo.';
            console.log('Error: ', error);
            alertElement.classList.add('alert-danger');
            alertElement.classList.remove('visually-hidden');
            setTimeout(function () {
                // Ocultar alerta despues de 5seg
                alertElement.classList.add('visually-hidden');
                alertElement.classList.remove('alert-danger');
            }, 5000);
        })

});