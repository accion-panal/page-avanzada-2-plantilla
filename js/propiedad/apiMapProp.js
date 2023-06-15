import { getProperties } from "../services/PropertiesServices.js";
import	ExchangeRateServices from  "../services/ExchangeRateServices.js";
import {parseToCLPCurrency, clpToUf} from "../utils/getExchangeRate.js";
import { PropertyData, limitDataApi } from "../Data/userId.js";

export default async function apiCallMap() {
    const { CodigoUsuarioMaestro, companyId, realtorId } = PropertyData;

    

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2lvdmVyYWhlcm5hbmRlemJpZGF0YSIsImEiOiJjbDMwZHc4cmswMDdqM2NydmIzYWF0cGl4In0.hsYQFPebleAB4j6mRckMzQ'
    const map = new mapboxgl.Map({

        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.680628,-33.469970],
        // projection: 'globe',
        zoom:10,

    });

    /* let {data} = await getProperties(1, 10, CodigoUsuarioMaestro, 1, companyId, realtorId); */

    let data;
    let response;

    const response2 = await ExchangeRateServices.getExchangeRateUF();
    const ufValue = response2?.UFs[0]?.Valor
    const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));

    //* Rescatar datos del globalResponse
    //! si hay informacion, entra al if, de lo contrario al else
    let storedGlobalResponse = localStorage.getItem('globalResponse');
    if (storedGlobalResponse && storedGlobalResponse.length>0) {
        response = JSON.parse(storedGlobalResponse);
        let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
        localStorage.setItem('LimitPages', JSON.stringify(maxPage));
        /* localStorage.setItem('countPage', JSON.stringify(1)); */

        data = response.data;
    } 
    else {
        //* el segundo digito es el limit
        response = await getProperties(1, limitDataApi.limit, CodigoUsuarioMaestro, 1, companyId, realtorId);
        //* Guardar el response en el localStorage
        localStorage.setItem('globalResponse', JSON.stringify(response));

        let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
        localStorage.setItem('LimitPages', JSON.stringify(maxPage));
        console.log('max-page: ',maxPage);
        localStorage.setItem('countPage', JSON.stringify(1));
        paginationCall();

        data = response.data;
    }


    console.log('data en map: ',data);
    const promiseMap = new Promise(
        (resolve)=>{
        data.map(data => {

                if(data.LngLat === null )return;

                const LngLat= data.LngLat.replace('{','').replace('}','').replace(',', '').replace('Lat', "").split(':');


                const propiedad = [parseFloat(LngLat[1]) , parseFloat(LngLat[2])];

                // create the popup
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <span>${data.title}</span>
                <br>
                <br>
                <a href="/property-single.html?${data.id}&realtorId=${0}&statusId=${1}&companyId=${1}" name="VerDetalle"  class="more d-flex align-items-center float-start">
                <span class="label" >Ver Detalle</span>
                <span class="arrow"><span class="icon-keyboard_arrow_right"></span></span>
                </a>`)

                // create DOM element for the marker
                const el = document.createElement('div');
                el.id = 'marker';


                new mapboxgl.Marker({
                    color: '#000',
                    scale: .8
                })

           


                    .setLngLat(propiedad)
                    .setPopup(popup) // sets a popup on this marker
                    .addTo(map);
            })
            resolve()
        }
    )
    promiseMap.then(()=>{

        map.on('load', function () {
            map.resize();
        });
        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style

        });
    })


    document.getElementById('container-prop-slide').innerHTML = data.map(data => `
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

