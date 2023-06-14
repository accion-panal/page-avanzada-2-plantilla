import { ContactInformation } from "./userId.js";

const ContactInfo = () => {
    const { information, horario } = ContactInformation;

    let info = document.getElementById('contact-info');
    if (info !== null) {
        info.innerHTML = information.map((i)=>`
            <div class="row "style="font-size: 15px;">
                <div class="col-12 col-xl-1">
                    ${i.icon}
                </div>
                <div class="col-12 col-xl-11 " style="padding-bottom: 20px;">
                    ${i.desc}
                </div>
            </div>
        `).join('');
    }

    let time = document.getElementById('horario-info');
    if (time !== null) {
        time.innerHTML = `
            <b>Horario de atención:</b>
            <br><br>`+ horario.map((i)=>`
                <div class="row"style="font-size: 15px;">
                    <div class="col-12 col-xl-1">
                        ${i.icon}
                    </div>
                    <div class="col-12 col-xl-11">
                        ${i.desc}
                    </div>
                </div>
            `).join('');
    }

}

ContactInfo();
