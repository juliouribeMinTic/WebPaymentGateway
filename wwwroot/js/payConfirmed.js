document.addEventListener('DOMContentLoaded', () => {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    let token = JSON.parse(localStorage.getItem(urlParams.get('token')));

    document.querySelector('#idTransfer').textContent = token.id_transfer;
    document.querySelector('#stateTransfer').textContent = token.status;
    document.querySelector('#productTransfer').textContent = token.product;
});
