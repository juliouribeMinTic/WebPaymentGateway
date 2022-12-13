let dataConfirm = {}
let service;
let idData;
let newCard;


const random = () => Math.random().toString(36).substr(2);
const generateToken = () => random() + random();


const getOptionSelected = (group) => {
    let opt;
    document.getElementsByName(`${group}`).forEach(radio => {
        if (radio.checked) {
            opt = radio.value;

            if (radio.dataset.obj) {
                idData = radio.dataset.obj;
            }
        }
    });
    return opt;
};

const validateInputs = () => {
    let flagInputEmpty = true;
    document.querySelectorAll('.input-card').forEach(input => {
        (input.value === '') ? input.classList.add('error-radio') : input.classList.remove('error-radio');
    });

    (document.querySelector('#selectYear').value == '0') ? document.querySelector('#selectYear').classList.add('error-radio') : document.querySelector('#selectYear').classList.remove('error-radio');
    (document.querySelector('#selectMes').value == '0') ? document.querySelector('#selectMes').classList.add('error-radio') : document.querySelector('#selectMes').classList.remove('error-radio');
    (document.querySelector('#numCard').value.length !== 19) ? document.querySelector('#numCard').classList.add('error-radio') : document.querySelector('#numCard').classList.remove('error-radio');


    flagInputEmpty = (document.querySelector('.error-radio')) ? false : true;

    return flagInputEmpty
}

const cleanInputs = () => {
    document.querySelectorAll('.input-card').forEach(input => {
        if (input.id != 'documentType') {
            document.querySelector(`#${input.id}`).value = '';
        }
    });
    document.querySelector('#tarjeta .year').textContent = 'YY';
    document.querySelector('#tarjeta .mes').textContent = 'MM';
    document.querySelector('.ccv').textContent = '';
    document.querySelector('#logo-marca').innerHTML = '';
    document.querySelector('#tarjeta .numero').textContent = '#### #### #### ####';
    document.querySelector('#tarjeta .nombre').textContent = '';
}


const showPosicionCard = (flagPositionCard) => {
    (document.querySelector('#tarjeta').classList.contains('active') && flagPositionCard) ? document.querySelector('#tarjeta').classList.remove('active') : (!document.querySelector('#tarjeta').classList.contains('active') && !flagPositionCard) ? document.querySelector('#tarjeta').classList.add('active') : undefined;
}

const hiddenMainElements = (onlyNotHidden) => {
    setTimeout(() => {
        document.querySelector('#optionPaid').classList.add('d-none');
        document.querySelector('#confirmTransfer').classList.add('d-none');
        document.querySelector('#divCardForm').classList.add('d-none');
        document.querySelector('#divPseForm').classList.add('d-none');
        document.querySelector('#divPseTransfer').classList.add('d-none');


        document.querySelector(`#${onlyNotHidden}`).classList.remove('d-none');
        document.querySelector('#spin').className = "";
    }, 200);
}

// * Select del mes generado dinamicamente.
const generateMonths = () => {
    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = (i < 10) ? `0${i}` : i;
        document.querySelector('#selectMes').appendChild(opt);
    }
}

// * Select del año generado dinamicamente.
const generateYears = () => {
    const year = new Date().getFullYear();
    for (let i = year; i <= year + 8; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i;
        document.querySelector('#selectYear').appendChild(opt);
    }
}

const showBanks = (banks) => {
    let data = '';
    banks.forEach(bank => {
        if (bank.code != 0) {
            data += `<div class="input-radio pse">
                    <input type="radio" data-obj="${bank.code}" id="${bank.code}" name="bankInstitutions" value="${bank.code}">
                        <label for="${bank.code}">
                            ${bank.name}
                        </label>
                    </div>`;
        }
    });
    document.querySelector('#listBank').innerHTML = '';
    document.querySelector('#listBank').innerHTML = data
}

const showService = (service) => {
    // document.querySelector('.image-service').setAttribute('src',`https://robohash.org/${service.id}`);
    document.querySelector('#titleService').textContent = service.name;
    document.querySelector('#priceService').textContent = service.price;
}


const showOwnCards = (cards) => {
    document.querySelector('#ownCards').innerHTML = '';
    let data = '';
    cards.forEach(card => {
        if (card.status == "valid") {
            data += `
                <div class="input-radio own-card">
                    <input data-obj="${card.token}" type="radio" id="creditOwmCard${card.bin}" name="methodPaid" value="ownCard">
                    <label for="creditOwmCard${card.bin}">
                        <img class="img-own-card" width="30px" src="${(card.type === 'vi') ? 'img/logos/visa.png' : 'img/logos/mastercard.png'}" alt="tarjeta credito">
                        <p class="text-own-card">${(card.type === 'vi') ? 'Visa' : 'Mastercard'}  ${card.bin}**********</p>
                    </label>
                </div>
            `;
        }
    });

    document.querySelector('#ownCards').innerHTML = data;
}


const showInfoConfirmData = async (type) => {
    let data = '';
    if (type == 'ownCard') {
        const card = await getCardByToken(1, idData);
        data = `<div class="input-radio">
                    <img class="img-own-card" width="40px" src="${(card.type === 'vi') ? 'img/logos/visa.png' : 'img/logos/mastercard.png'}" alt="tarjeta credito">
                    <p class="text-own-card">${(card.type === 'vi') ? 'Visa' : 'Mastercard'}  ${card.bin}**********</p>
                </div>`;

        dataConfirm['addionalData'] = card;
        document.querySelector('#type-method').textContent = 'Pago con tarjeta';

    } else if (type == 'newCard') {
        document.querySelector('#type-method').textContent = 'Pago con tarjeta';
        data = `<div class="input-radio">
                    <img class="img-own-card" width="40px" src="${(newCard.type === 'vi') ? 'img/logos/visa.png' : 'img/logos/mastercard.png'}" alt="tarjeta credito">
                    <p class="text-own-card">${(newCard.type === 'vi') ? 'Visa' : 'Mastercard'}  ${newCard.number.slice(0, 6)}**********</p>
                </div>`;

        dataConfirm['addionalData'] = newCard;
        document.querySelector('#type-method').textContent = 'Pago con tarjeta';

    } else if (type == 'pse') {
        const bank = await getDataBankPSEById(idData);
        data = `<div class="input-radio">
                    <p class="text-own-card">${bank.name}</p>
                </div>`;

        dataConfirm['addionalData'] = bank;
        document.querySelector('#type-method').textContent = 'Pago por PSE';
    }

    dataConfirm['type'] = type;
    document.querySelector('.additional-info-paid').innerHTML = '';
    document.querySelector('.additional-info-paid').innerHTML = data;
    document.querySelector('#confirmForm').dataset.type = dataConfirm.type;
    document.querySelector('#confirmBtn').classList.remove('d-none');
    /*(dataConfirm.type == 'pse') ? document.querySelector('#confirmBtn').classList.remove('d-none') : document.querySelector('#confirmBtn').classList.add('d-none');*/
}


/* TODO: Add Event Listener*/

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#spin').className += "loading show";
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);

    if (urlParams.get('uid')) {
        const { cards, result_size } = await getListCards(urlParams.get('uid'));
        if (result_size > 0) {
            showOwnCards(cards);
        }
    }
    const idService = urlParams.get('idService');
    if (idService) {
        const service = await getServicesById(idService);
        if (service) {
            showService(service);
        }
    }

    hiddenMainElements('optionPaid');
});


document.querySelector('#formMethod').addEventListener('submit', async (e) => {
    e.preventDefault();
    let optionSelected = getOptionSelected('methodPaid');

    if (!optionSelected) {
        document.querySelectorAll('.input-radio').forEach(radio => radio.classList.add('error-radio'));
    } else {
        document.querySelector('#spin').className += "loading show";

        document.querySelectorAll('.input-radio').forEach(radio => radio.classList.remove('error-radio'));
        document.querySelector('.btn-return').classList.remove('d-none');

        if (optionSelected && optionSelected === 'credit' || optionSelected === 'debit') {
            cleanInputs();
            generateMonths();
            generateYears();
            hiddenMainElements('divCardForm');
        } else if (optionSelected == 'pse') {
            const banks = await getDataBanksPSE();
            showBanks(banks);
            hiddenMainElements('divPseForm');
        } else if (optionSelected == 'ownCard') {
            showInfoConfirmData('ownCard');
            hiddenMainElements('confirmTransfer');
        }
    }
});

// Paso Tarjeta
document.querySelector('#cardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateInputs()) {
        newCard = {};

        newCard["number"] = document.querySelector('#numCard').value.replace(/\s+/g, '');
        newCard["holder_name"] = document.querySelector('#nameUser').value.toLowerCase();
        newCard["expiry_month"] = document.querySelector('#selectMes').value;
        newCard["expiry_year"] = document.querySelector('#selectYear').value;
        newCard["cvc"] = document.querySelector('#codeSecurity').value;
        newCard["type"] = (document.querySelector('#numCard').value[0] == 4) ? 'vi' : (document.querySelector('#selectYear').value == 4) ? 'mc' : '';


        showInfoConfirmData('newCard');
        hiddenMainElements('confirmTransfer');
        cleanInputs();
    }
});

document.querySelector('#confirmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('#spin').className += "loading show";
    if (e.target.dataset.type == 'pse') {
        const token = generateToken();
        const transaction = await createTransferPSE(idData, token);

        localStorage.setItem(`${token}`, transaction.id);
        document.querySelector('#btnToPSE').setAttribute('href', transaction.bank_url);
        document.querySelector('#tokenData').textContent = token;
        document.querySelector('#linkData').textContent = `${URLPAYPSE}?token=${token}`;
        document.querySelector('.btn-return').classList.add('d-none');
        hiddenMainElements('divPseTransfer');
    }
    document.querySelector('#spin').className = "";   
});


// Paso PSE
document.querySelector('#pseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const optionBank = getOptionSelected('bankInstitutions')
    if (!optionBank) {
        document.querySelectorAll('.pse').forEach(radio => radio.classList.add('error-radio'));
    } else {
        document.querySelector('#spin').className += "loading show";
        document.querySelectorAll('.pse').forEach(radio => radio.classList.remove('error-radio'));
        showInfoConfirmData('pse');
        hiddenMainElements('confirmTransfer');
    }
});

// Boton regresar
document.querySelectorAll('.btn-return').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.btn-return').classList.add('d-none');
        document.querySelector('#optionPaid').classList.remove('d-none');
        document.querySelector('#divCardForm').classList.add('d-none');
        document.querySelector('#divPseForm').classList.add('d-none');
        document.querySelector('#confirmTransfer').classList.add('d-none');
        cleanInputs();
    });
});

document.querySelector('#tarjeta').addEventListener('click', () => {
    document.querySelector('#tarjeta').classList.toggle('active');
});



document.querySelector('#numCard').addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    document.querySelector('#numCard').value = valorInput
        // Eliminamos espacios en blanco
        .replace(/\s/g, '')
        // Eliminar las letras
        .replace(/\D/g, '')
        // Ponemos espacio cada cuatro numeros
        .replace(/([0-9]{4})/g, '$1 ')
        // Elimina el ultimo espaciado
        .trim();

    document.querySelector('#tarjeta .numero').textContent = valorInput;

    if (valorInput == '') {
        document.querySelector('#tarjeta .numero').textContent = '#### #### #### ####';
        document.querySelector('#logo-marca').innerHTML = '';
    }

    document.querySelector('#logo-marca').innerHTML = '';
    const imagen = document.createElement('img');
    if (valorInput[0] == 4) {
        imagen.src = 'img/logos/visa.png';
        document.querySelector('#logo-marca').appendChild(imagen);
    } else if (valorInput[0] == 5) {
        imagen.src = 'img/logos/mastercard.png';
        document.querySelector('#logo-marca').appendChild(imagen);
    }

    showPosicionCard(true);
});


document.querySelector('#nameUser').addEventListener('keyup', (e) => {
    let valorInput = e.target.value;
    document.querySelector('#nameUser').value = valorInput.replace(/[0-9]/g, '');
    document.querySelector('#tarjeta .nombre').textContent = valorInput;

    if (valorInput == '') {
        document.querySelector('#tarjeta .nombre').textContent = '';
    }

    showPosicionCard(true);
});

// * Select mes
document.querySelector('#selectMes').addEventListener('change', (e) => {
    document.querySelector('#tarjeta .mes').textContent = e.target.value;
    showPosicionCard(true);
});

// * Select Año
document.querySelector('#selectYear').addEventListener('change', (e) => {
    document.querySelector('#tarjeta .year').textContent = e.target.value.slice(2);
    showPosicionCard(true);
});

document.querySelector('#codeSecurity').addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    document.querySelector('#codeSecurity').value = valorInput
        // Eliminar los espacios
        .replace(/\s/g, '')
        // Eliminar las letras
        .replace(/\D/g, '');

    document.querySelector('.ccv').textContent = valorInput;

    showPosicionCard(false);
});


