const hiddenElements = () => {
    document.querySelector('.list-group').classList.toggle('list');
    document.querySelector('.list-group').classList.toggle('d-none');
    document.querySelector('.btn-return').classList.toggle('d-none');

    document.querySelector('.list-service').classList.toggle('d-none');
    document.querySelector('.list-service').classList.toggle('list');
}


const addEventToBtnGroup = () => {
    document.querySelectorAll('.btn-group').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelector('#spin').className += "loading show";
            hiddenElements();
            loadServices(await getServices(e.target.value));
        });
    });
};

const addEventToGoPay = () => {
    document.querySelectorAll('.btn-service').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.location.href = `${DOMAIN}Payment?idService=${e.target.value}&uid=uid1234`;
        });
    });
};


const loadServices = (services) => {
    data = '';
    services.forEach(service => {
        data += `
        <div class="service d-flex justify-content-between">
            <div>
                <h2>${service.name}</h2>
                <h3>Precio: $ <span class="price-service">${service.price}</span></h3>
            </div>
            <div>
                <button class="btn btn-service" value=${service.id}>Pagar</button>
            </div>
        </div>
<hr />
        `
    });

    const listProducts = document.querySelector('.list-service');
    listProducts.innerHTML = '';
    listProducts.innerHTML = data;

    addEventToGoPay();

    document.querySelector('#spin').className = "";
}


document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#spin').className += "loading show";
    const groups = await getGroups();
    if (groups[0]) {
        data = '';
        groups.forEach(group => {
            data += `
            <div class="container-paciente mt-5 container">
              <div class="paciente-servicios row g-4 px-0">
                <div class="paciente-servicios-item col-md-6 d-sm-flex">
                    <div class="paciente-servicios-item-icono"><img class="icon_categoria" src="${group.image}" alt="imagen producto "></div>
                    <div class="paciente-servicios-item-boton">
                <button class="btn btn-group" data-name="${group.name}" data-price="${group.price}" value="${group.id}">${group.name}</button>
                    </div>
                </div>
            </div>
            </div>`
        });
    }


    const listProducts = document.querySelector('.list-group');
    listProducts.innerHTML = '';
    listProducts.innerHTML = data;

    addEventToBtnGroup();

    document.querySelector('#spin').className = "";
});

document.querySelector('.btn-return').addEventListener('click', () => {
    hiddenElements();
});