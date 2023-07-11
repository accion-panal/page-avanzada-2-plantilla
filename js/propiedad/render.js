import { getProperties } from "../services/PropertiesServices.js";
import ExchangeRateServices from "../services/ExchangeRateServices.js";
import { parseToCLPCurrency, clpToUf,validationUF } from "../utils/getExchangeRate.js";
import { PropertyData, limitDataApi } from "../Data/userId.js";
import paginationCall from "../utils/pagination.js";
import apiCallMap from "../propiedad/apiMapProp.js";

export default async function renderCall() {
    //* INICIALIZACION DE VARIABLES
    const { CodigoUsuarioMaestro, companyId, realtorId } = PropertyData;
    let response;

    //* Rescatar datos del globalResponse
    //! si hay informacion, entra al if, de lo contrario al else
    let storedGlobalResponse = localStorage.getItem('globalResponse');
    if (storedGlobalResponse) {
        response = JSON.parse(storedGlobalResponse);
        let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
        localStorage.setItem('LimitPages', JSON.stringify(maxPage));
        /* localStorage.setItem('countPage', JSON.stringify(1)); */
        paginationCall();
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
    }

    //! console log para saber el contenido del response despues del if
    console.log('response in render.js',response)

    //* Guardamos el data del response en una variable data 
    let data = response.data;
    console.log('data in render.js',data)

    //todo: Modificar url de image
    data = data.map(item => {
        // Reemplazar "\\" por "//" en la propiedad "image"
        item.image = item.image.replace(/\\/g, "//");
        return item;
    });

    //* Cositas para el uf
    const response2 = await ExchangeRateServices.getExchangeRateUF();
    const ufValue = response2?.UFs[0]?.Valor;
    const ufValueAsNumber = parseFloat(ufValue.replace(",", "."));

    //todo: Filtros Extras
    const filtroSelect = document.getElementById('FilterPrice');
    filtroSelect.addEventListener('change', handleFilterChange);
    function handleFilterChange() {
        console.log('=========== handleFilterChange ===========')
        //* Se rescata el value del select
        const selectedValue = filtroSelect.value;
        console.log(selectedValue);
        console.log(data);
        console.log(response);
      
        if (selectedValue === 'MayorMenor') {
          //* la data ordenada se guarda en response.data
          //* y se actualiza el localStorage de globalResponse
          response.data = data.sort((a, b) => b.price - a.price);
          localStorage.setItem('globalResponse', JSON.stringify(response));
        } else {
          //* la data ordenada se guarda en response.data
          //* y se actualiza el localStorage de globalResponse
          response.data = data.sort((a, b) => a.price - b.price);
          localStorage.setItem('globalResponse', JSON.stringify(response));
        }
        console.log('dataOrdenadaResponse: ',response);
        //* Se llama al showItems para actualizar las cards
        showItems();
    }

    //todo: LLamamos a la funcion que muestra las cards
    showItems();

    //todo: innerHTML de las propiedades encontradas
    document.getElementById("total-prop").innerHTML = `${response.meta.totalItems} Propiedades encontradas`;

    //todo: creacion de la funcion ShowItems
    function showItems() {
        //* si container-propiedad es distinto de Null, hara un innerHTML
        //! esto es para evitar errores
        let containerGrid = document.getElementById('container-propiedad');
        if (containerGrid !== null) {
            document.getElementById("container-propiedad").innerHTML = data.map(data =>`
                <div class="col-xs-12 col-md-6 col-lg-4 carta-grilla">
                    <div class="property-item text-center">
                        <a href="/property-single.html?${data.id}&statusId=${1}&companyId=${companyId}" class="img">
                            ${data.image.endsWith('.jpg') ? `<img src=${data.image} alt="Image" class="img-fluid">`:`<img src='https://res.cloudinary.com/dbrhjc4o5/image/upload/v1681933697/unne-media/errors/not-found-img_pp5xj7.jpg' alt="Image" class="img-fluid">`}
                        </a>
                        <div class="property-content border">
                            <p style="margin-bottom: 0;"> <i class="fa fa-map-marker fa-lg"></i> ${data.address != null && data.address != undefined && data.address != "" ? data.address : "No registra dirección"},${data.commune != null & data.commune != undefined && data.commune != "" ? data.commune : "No registra comuna"}</p>
                            <a href="/property-single.html?${data.id}&statusId=${1}&companyId=${companyId}">
                                <span class="city d-block mb-3 text-transform-2" style="font-weight: bold;font-size: 30px;">${data.title}</span>
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
                                            <div class="col-12">${validationUF(data.currency.isoCode) ? data.price : clpToUf(data.price, ufValueAsNumber)}</div>
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
                </div>
            `).join("");   
        };

        let containerMap = document.getElementById('div-map-section');
        if (containerMap !== null) {
            apiCallMap()
        };
    };
}
