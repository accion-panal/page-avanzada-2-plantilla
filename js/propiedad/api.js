import renderCall from "../propiedad/render.js";

export default async function apiCall() {
  localStorage.removeItem('globalResponse');
  renderCall();
}


