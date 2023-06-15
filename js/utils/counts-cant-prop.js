import { getProperties } from "../services/PropertiesServices.js";
import { PropertyData, limitDataApi } from "../Data/userId.js";


const countsProps = async () => {
    const {CodigoUsuarioMaestro, companyId, realtorId} = PropertyData;
    const response = await getProperties(1, limitDataApi.limit, CodigoUsuarioMaestro, 1, companyId, realtorId);
    const data = response.data;

    document.getElementById("count-total-prop").innerHTML = `
        <div class="row section-counter  ">
            <div class="counter-wrap mb-5 mb-lg-0">
                <span class="number">
                    <span class="countup" style="font-weight: bold;font-size: 60px; color: #999999;">${ response.meta.totalItems }</span>
                </span>
                <span class="caption text-black-50">Total de Propiedades</span>
            </div>
        </div>
    `;

    /* document.getElementById("count-sale-prop").innerHTML = `<span class="number"><span class="countup" style="font-weight: bold;font-size: 50px; color: #999999;">298</span>
	</span>
  <span class="caption text-black-50">Propiedades Vendidas</span>`;

    document.getElementById("count-lease-prop").innerHTML = `<span class="number"><span class="countup" style="font-weight: bold;font-size: 50px; color: #999999;">181</span>
	</span>
  <span class="caption text-black-50">Propiedades Arrendadas</span>`; */

}

countsProps();
