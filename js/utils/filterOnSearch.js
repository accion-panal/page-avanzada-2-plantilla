import { getPropertiesForCustomUrl } from "../services/PropertiesServices.js";
import { PropertyData,limitDataApi } from '../Data/userId.js'
import { getRegiones } from "../services/PropertiesServices.js";
import paginationCall from "./pagination.js";

import renderCall from "../propiedad/render.js";

//*Inicializar variables
const { CodigoUsuarioMaestro, companyId, realtorId } = PropertyData;
let operation;
let typeOfProperty;
let region;
let commune;
let bathrooms;
let bedrooms;
let parkingLots;
let typePrice;
let minPrice;
let maxPrice;



let globalQuery;
//* Actualizar variables si vienen del index
let storedGlobalQuery = localStorage.getItem('globalQuery');
if (storedGlobalQuery) {
    globalQuery = JSON.parse(storedGlobalQuery);
    console.log('globalQuery: ',globalQuery);

    if(globalQuery.bathrooms != null){
        document.getElementById("bathrooms").value = globalQuery.bathrooms;
    }
    if(globalQuery.bedrooms != null){
        document.getElementById("bedrooms").value = globalQuery.bedrooms;
    }

    if(globalQuery.covered_parking_lots != null){
        document.getElementById("covered_parking_lots").value = globalQuery.covered_parking_lots;
    }
    if(globalQuery.max_price != null){
        document.getElementById("max_price").value = globalQuery.max_price;
    }
    if(globalQuery.min_price != null){
        document.getElementById("min_price").value = globalQuery.min_price;
    }
    if(globalQuery.operationType != null){
        /* document.getElementById("operationType").value = globalQuery.operationType; */

        if(globalQuery.operationType == 'venta'){document.getElementById('flexRadioDefault1').checked = true}
        if(globalQuery.operationType == 'arriendo'){document.getElementById('flexRadioDefault2').checked = true}
        if(globalQuery.operationType == 'arriendo_temporal'){document.getElementById('flexRadioDefault3').checked = true}
    }
    if(globalQuery.typePrice != null){
        /* document.getElementById("operationType").value = globalQuery.operationType; */

        if(globalQuery.typePrice == 'uf'){document.getElementById('inlineRadio1').checked = true}
        if(globalQuery.typePrice == 'clp'){document.getElementById('inlineRadio2').checked = true}
    }
    //* Actualizar variable segun el globalQuery
    if(globalQuery.region != null){
        //globalQuery.region = 2
        //select region = 2 Antofagasta
        //buscar = Antofagasta
        const regionData = data.regions.find(region => region.id == globalQuery.region);
        region = `${regionData.name}`;
        console.log(region)

    }
    //* Actualizar variable segun el globalQuery
    if(globalQuery.commune != null){
        //globalQuery.commune = 5
        //select commune = Calama
        //buscar = Calama
        let aux = await getCommune(globalQuery.region);
        const communeData = aux.data.find(commune => commune.id == globalQuery.commune);
        commune = `${communeData.name}`
        console.log(commune)

    }
    //* Actualizar variable segun el globalQuery
    if(globalQuery.typeOfProperty != null){
        typeOfProperty = globalQuery.typeOfProperty;
    }
    
} 


//* Actualizar variables
//! Operacion
document.getElementById('flexRadioDefault1').addEventListener('change', mostrarValor);
document.getElementById('flexRadioDefault2').addEventListener('change', mostrarValor);
document.getElementById('flexRadioDefault3').addEventListener('change', mostrarValor);
function mostrarValor(event) {
    operation = event.target.value;
}

//!Tipo de propiedad
document.getElementById('typeOfProperty').addEventListener('change' ,(element) => {
    typeOfProperty =  element.target.value;
})

//! Region
document.getElementById("regionTextId").addEventListener( "change", (element) => {
    region = element.target.value;
    console.log('id region: ',region);
    if(region == '0'){
        commune = '0';
        console.log('id commune: ',commune);
    }
})

//! Comuna
document.getElementById("communeTextId").addEventListener( "change", (element) => {
    commune = element.target.value;  
})

//! Habitaciones
document.getElementById("bedrooms").addEventListener( "change", (element) => { 
    bedrooms =  element.target.value;
})

//! Estacionamientos
document.getElementById("covered_parking_lots").addEventListener( "change", (element) => {
    parkingLots = element.target.value;  
})

//! Baños
document.getElementById("bathrooms").addEventListener( "change", (element) => {
    bathrooms= element.target.value; 
})

//! precio- UF or CLP
document.getElementById('inlineRadio1').addEventListener('change', saveTypePrice);
document.getElementById('inlineRadio2').addEventListener('change', saveTypePrice);
function saveTypePrice(event) {
    typePrice = event.target.value;
}
//! Precio Minimo
document.getElementById("min_price").addEventListener( "change", (element) => {
    // return element.target.value;
    minPrice = element.target.value;
})

//! Precio Maximo
document.getElementById("max_price").addEventListener( "change", (element) => {
    maxPrice= element.target.value;
})
  

function disabledButton(){
    let buttonSearch = document.getElementById('buscar2');
    buttonSearch.disabled = true;
}
function activeButton(){
    let buttonSearch = document.getElementById('buscar2');
    buttonSearch.disabled = false;
}

//TODO: Al hacer click en buscar, Mostrara todos los valores guardados
document.getElementById('buscar2')?.addEventListener('click', async() => {
    console.log('=======================')
    console.log('FilterOnSearch')
    //* mostrar spinner loading
    document.getElementById("buscar2").innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
    disabledButton();

    //todo: RESCATAR Y SEPARAR EL ID Y NAME DE REGION
    /* let idRegion = parseInt(region.match(/\d+/)[0]);
    console.log(idRegion); */
    let nameRegion;
    if(region !== undefined && region !== ''){nameRegion = region.replace(/\d+/, '').trim();}

    //* Validar Variables no sean undefined
    operation = (operation !== undefined && operation !== '' && operation !== '0') ? '&operationType=' + operation : '';
    typeOfProperty = (typeOfProperty !== undefined && typeOfProperty !== '' && typeOfProperty !== '0') ? '&typeOfProperty=' + typeOfProperty : '';
    nameRegion = (nameRegion !== undefined && nameRegion !== '' && nameRegion !== '0') ? '&region=' + nameRegion : '';
    commune = (commune !== undefined && commune !== '' && commune !== '0') ? '&commune=' + commune : '';
    bedrooms = (bedrooms !== undefined && bedrooms !== '' && bedrooms !== '0') ? '&bedrooms=' + bedrooms : '';
    bathrooms = (bathrooms !== undefined && bathrooms !== '' && bathrooms !== '0') ? '&bathrooms=' + bathrooms : '';
    parkingLots = (parkingLots !== undefined && parkingLots !== '' && parkingLots !== '0') ? '&covered_parking_lots=' + parkingLots : '';
    minPrice = (minPrice !== undefined && minPrice !== '' && minPrice !== '0') ? '&min_price=' + minPrice : '';
    maxPrice = (maxPrice !== undefined && maxPrice !== '' && maxPrice !== '0') ? '&max_price=' + maxPrice : '';

    //! TypePrice
    typePrice = (typePrice !== undefined && typePrice !== '') ? '&typePrice=' + typePrice : '';


    //* Mostrar variables en console log
    console.log('operation ',operation); //operacion - venta,arriendo,etc
    console.log('typeOfProperty ',typeOfProperty); //typeOfProperty
    console.log('region ',nameRegion); //typeOfProperty
    console.log('commune ',commune); //typeOfProperty
    console.log('bedrooms ',bedrooms); //bedrooms
    console.log('bathrooms ',bathrooms); //bedrooms
    console.log('parkingLots ',parkingLots); //Estacionamientos
    console.log('typePrice ',typePrice); //tipo de price
    console.log('minPrice ',minPrice); //precio minimo
    console.log('maxPrice ',maxPrice); //precio maximo


    //* Generar url
    let urlFilters = operation+typeOfProperty+nameRegion+commune+bedrooms+bathrooms+parkingLots+minPrice+maxPrice;
    console.log(urlFilters);
    //* Hacer peticion a la api     | el segundo digito es el limit
    let response = await getPropertiesForCustomUrl(1,limitDataApi.limit,CodigoUsuarioMaestro,1,companyId,realtorId,urlFilters);
    console.log(response);
    //* Guardar el response en el globalResponse
    localStorage.setItem('globalResponse', JSON.stringify(response));


    /* localStorage.removeItem('globalResponse'); */


    //* mostrar el global response EN CONSOLE.LOG();
    /* let storedGlobalResponse = localStorage.getItem('globalResponse');
    let globalResponse;
    if (storedGlobalResponse) {
        globalResponse = JSON.parse(storedGlobalResponse);
    }
    console.log('stored: ',globalResponse); */

    localStorage.setItem('countPage', JSON.stringify(1));
    renderCall();
    paginationCall();

    //* Quitar la concadenacion &operationType
    operation = operation.replace('&operationType=', '');
    typeOfProperty = typeOfProperty.replace('&typeOfProperty=', '');
    nameRegion = nameRegion.replace('&region=', '');
    commune = commune.replace('&commune=', '');
    bedrooms = bedrooms.replace('&bedrooms=', '');
    bathrooms = bathrooms.replace('&bathrooms=', '');
    parkingLots = parkingLots.replace('&covered_parking_lots=', '');
    minPrice = minPrice.replace('&min_price=', '');
    maxPrice = maxPrice.replace('&max_price=', '');

    //* quitar spinner loading
    document.getElementById("buscar2").innerHTML = `Buscar`;
    activeButton();

});