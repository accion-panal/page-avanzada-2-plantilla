import { getPropertiesForId } from "../services/PropertiesServices.js";
import ExchangeRateServices from "../services/ExchangeRateServices.js";
import { parseToCLPCurrency, clpToUf, validationUF,validationCLP, ufToClp } from '../utils/getExchangeRate.js';

export default async function apiDetalleCall(id, statusId = 1, companyId) {
    let { data } = await getPropertiesForId(id, statusId, companyId);
    const response = await ExchangeRateServices.getExchangeRateUF();
    const ufValue = response?.UFs[0]?.Valor
    const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));

    let realtorInfo = data.realtor;

    let updatedImages = data.images.map(function (image) {
        return image.replace(/\\/g, "//");
    });

    
    //! transformar valor del uf a int
    const cleanedValue = ufValue.replace(/\./g, '').replace(',', '.');
    const ufValueAsInt = parseFloat(cleanedValue).toFixed(0);
    //!--

    console.log(data);
    console.log(updatedImages);
    //* INFORMACION
    //! Informacion principal
    let mainInfo = document.getElementById('main-info-prop');
    if (mainInfo !== null) {

        //! Title and direction */
        document.getElementById('main-info-prop').innerHTML = `
            <h1 class="heading " style="font-weight: bold; color: #4D4D4D;">${data.title}</h1>
            <p>REF:${data.id}</p>
            <p>
                <i class="fa fa-map-marker "  aria-hidden="true"></i>
                ${data.address != null && data.address != undefined && data.address != "" ? data.address : "No registra Direccion"}, ${data.commune != null && data.commune != undefined && data.commune != "" ? data.commune : "No registra comuna"}, ${data.region != null && data.region != undefined && data.region != "" ? data.region : "No registra región"}, Chile
            </p>
        `;

        //! Price */
        document.getElementById('price-info-prop').innerHTML = `
            <div class="col-12" style="display: flex;justify-content: right;">
                <b>
                    <h2 style="font-weight: bold; color: #4D4D4D;">${data.operation}</h2>
                    <h1 class="heading " style="font-weight: bold; color: #4D4D4D;">UF ${validationUF(data.currency.isoCode) ? data.price : clpToUf(data.price, ufValueAsNumber)}</h1>
                </b>
            </div>
            <div class="col-12" style="display: flex;justify-content: right;">
                <h5 class="heading "> CLP   ${validationCLP(data.currency.isoCode) ? parseToCLPCurrency(data?.price): parseToCLPCurrency(ufToClp(data.price, ufValueAsInt))}</h5>
            </div>
        `;

        //! Imagenes en splide */
        let img = '';
        updatedImages.forEach((image, index) => {
            img += `
                <li class="splide__slide ${index === 0 ? 'active' : ''}">
                    <img src="${image || 'img/Sin.png'}" style="height: 600px; width: 100%;" />
                </li>
            `;
        });
        document.getElementById('carrucel-img').innerHTML = img;

        let splide = new Splide('.splide', {
            type: 'fade',
            padding: '5rem',
            rewind: true,
            autoplay: 'play',
        });

        splide.mount();


        //! Description */
        document.getElementById('description-info-prop').innerHTML = `
            <p>${data.description}</p>
            <h5>Caracteristicas generales</h5>
            <p>${data.description}</p>
        `;

        //! Icons */
        document.getElementById('bedrooms-prop').innerHTML = `${data.bedrooms != null && data.bedrooms != undefined && data.bedrooms != "" ? data.bedrooms : "00"}`;
        document.getElementById('bathrooms-prop').innerHTML = `${data.bathrooms != null && data.bathrooms != undefined && data.bathrooms != "" ? data.bathrooms : "00"}`;
        document.getElementById('ParkingLots-prop').innerHTML = `${data.coveredParkingLots != null && data.coveredParkingLots != undefined && data.coveredParkingLots != "" ? data.coveredParkingLots : "00"}`;
        document.getElementById('surface-m2-prop').innerHTML = `${data.surface_m2 != null && data.surface_m2 != undefined && data.surface_m2 != "" ? data.surface_m2 : "00"}`;

        //! Contacto */
        document.getElementById('realtorImage').innerHTML = `
            <div class="img text-center">
                <img src="images/person_4-min.jpg" alt="Image" class="img-fluid" style="width: 80%; max-width: 300px; border-radius: 50%; border: #000 1px solid;">
            </div>
        `;
        document.getElementById('realtorName').innerHTML = `
            <p style="font-size: 35px;"><b>${realtorInfo.name} ${realtorInfo.lastName != null ? realtorInfo.lastName : ''}</b></p>
        `;
        document.getElementById('realtorEmail').innerHTML = `
            <i class="fa fa-envelope-open "aria-hidden="true"></i>
            ${realtorInfo.mail != null && realtorInfo.mail != undefined && realtorInfo.mail != "" ? realtorInfo.mail : "No registra Mail"}
        `;
        document.getElementById('realtorPhone').innerHTML = `
            <i class="fa fa-whatsapp" aria-hidden="true"></i>
            ${realtorInfo.contactPhone != null && realtorInfo.contactPhone != undefined && realtorInfo.contactPhone != "" ? realtorInfo.contactPhone : "No registra Numero"}
        `;

    };
}