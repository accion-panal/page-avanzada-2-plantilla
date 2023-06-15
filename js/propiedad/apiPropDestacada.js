import { getProperties } from "../services/PropertiesServices.js"
import	ExchangeRateServices from  "../services/ExchangeRateServices.js";

import {parseToCLPCurrency, clpToUf} from "../utils/getExchangeRate.js";
import { PropertyData } from "../Data/userId.js";

export default async function apiDestCall() {
    const { CodigoUsuarioMaestro, companyId, realtorId } = PropertyData;
    let {data} = await getProperties(1, 10, CodigoUsuarioMaestro, 1, companyId, realtorId);
    let filtrado = data.filter(data => data.highlighted != null && data.highlighted  != false );

    const response = await ExchangeRateServices.getExchangeRateUF();
    const ufValue = response?.UFs[0]?.Valor
    const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));
      
    document.getElementById('container-prop-destacada').innerHTML = filtrado.map(data => `
        <li class="splide__slide">
            <div class="property-item" style="margin:0 10px">
                <a href="/property-single.html?${data.id}&statusId=${1}&companyId=${companyId}" class="img">
                    <img src="images/img_1.jpg.png" alt="Image" class="img-fluid">
                </a>
                <div class="property-content">
                    <p style="margin-bottom: 0;"> COD: ${data.id} </p>
                    <p style="margin-bottom: 0;"> <i class="fa fa-map-marker fa-lg"></i> ${data.address != null && data.address != undefined && data.address != "" ? data.address : "No registra dirección"}, ${data.commune != null & data.commune != undefined && data.commune != "" ? data.commune : "No registra comuna"}</p>
                    <a href="/property-single.html?${data.id}&statusId=${1}&companyId=${companyId}">
                        <span class="city d-block mb-3 text-transform" style="font-weight: bold;font-size: 30px;">${data.title}</span>
                    </a>
                    <div class="" style="border-top: 2px solid gray;">
                        <div class="row p-3 ">
                            <div class="col-5 hr-l">
                                <div class="row ">
                                    <div class="col-12">Dormitorios</div>
                                    <div class="col-12">${data.bedrooms != undefined && data.bedrooms != "" && data.bedrooms != null ? data.bedrooms : "0"}</div>
                                </div>
                            </div>
                            <div class="col-3 hr-l">
                                <div class="row ">
                                    <div class="col-12">UF</div>
                                    <div class="col-12">${clpToUf(data.price, ufValueAsNumber)}</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="row">
                                    <div class="col-12">M2</div>
                                    <div class="col-12">${data.surface_m2 != undefined && data.surface_m2 != "" && data.surface_m2 != null ? data.surface_m2 : "0"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    `).join('');

    let splide = new Splide(".splide", {
    type    : 'loop',
    perPage : 3,
    autoplay: 'play',
    // autoWidth: true,
    drag:true,
    breakpoints:{
        1399:{perPage:2},
        991:{perPage:1}
    }});
    splide.mount();
}

document.addEventListener("DOMContentLoaded", function () {
	let splide = new Splide(".splide");
	// let splideList = new Splide(".splide");
	// splideList.mount();
	splide.mount();
});

apiDestCall()