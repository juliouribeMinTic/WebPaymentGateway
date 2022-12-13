/* Config Paymantez */

/**
     * Init library
     *
     * @param env_mode `prod`, `stg`, `local` to change environment. Default is `stg`
     * @param payment_client_app_code provided by Paymentez.
     * @param payment_client_app_key provided by Paymentez.
     */

dataPayment = {
    'APP_CODE': 'DV-HOMIL-STG-CO-CLIENT',
    'APP_KEY': 'PZUZk5KIT4XOS5NoOURXuwuZd9fFxs',
}

Payment.init('stg', dataPayment.APP_CODE, dataPayment.APP_KEY);

let form = $("#add-card-form");
let submitButton = form.find("button");
let submitInitialText = submitButton.text();
let cardToSave;

/* -------------------------------- */


let uid;
let dataConfirm = {}
let service;
let idData;
let newCard;
let transfer = {};

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

const cleanInputs = () => {
    $('#card-number').val('');
    $(".card-type-icon").removeAttr("style");
    $('#the-card-name-id').val('')
    $('#cvc').val('').removeAttr("style");
    $('#exp-month').val('').removeAttr("style");
    $('#exp-year').val('').removeAttr("style");
    $('.expiry').val('').removeAttr("style");
    $('#mensaje-bugueado').text('');

    document.querySelector('#tarjeta .expiracion').textContent = 'MM / YY';
    document.querySelector('.ccv').textContent = '';
    document.querySelector('#logo-marca').innerHTML = '';
    document.querySelector('#tarjeta .numero').textContent = '#### #### #### ####';
    document.querySelector('#tarjeta .nombre').textContent = '';
    document.querySelectorAll('.has-error').forEach(element => {
        element.classList.remove('has-error');
    })
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
        $('#mensaje-bugueado').text('');

        document.querySelector(`#${onlyNotHidden}`).classList.remove('d-none');
        document.querySelector('#spin').className = "";
    }, 150);
}

const showBanks = (banks) => {
    if (banks[0]) {
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
        document.querySelector('#listBank').innerHTML = data
    }
}

const showService = (service) => {
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
                    <div class="d-flex justify-content-between">
                        <label for="creditOwmCard${card.bin}">
                            <img class="img-own-card" width="30px" src="${(card.type === 'vi') ? 'img/logos/visa.png' : (card.type === 'mc') ? 'img/logos/mastercard.png' : ''}">
                            <p class="text-own-card">${(card.type === 'vi') ? 'Visa' : (card.type === 'vi') ? 'Mastercard' : ''}  ${card.bin}**********</p>
                        </label>
                        <div class="justify-content-end">
                            <button class="delete-card btn-danger mr-2" data-card="${card.token}">X</button>
                        </div>
                    </div>
                </div>
             `;
        }
    });
    document.querySelector('#ownCards').innerHTML = data;
    allowEventBtnDelete();
}


const showInfoConfirmData = async (type) => {
    let data = '';
    let flagBtn = true;
    if (type == 'card') {
        const card = await getCardByToken(uid, idData);
        if (card) {
            data = `<div class="input-radio">
                         <img class="img-own-card" width="40px" src="${(card.type === 'vi') ? 'img/logos/visa.png' : (card.type === 'mc') ? 'img/logos/mastercard.png' : ''}" alt="tarjeta credito">
                         <p class="text-own-card">${(card.type === 'vi') ? 'Visa' : 'Mastercard'}  ${card.bin}**********</p>
                     </div>`;

            dataConfirm['additionalData'] = card;
            document.querySelector('#type-method').textContent = 'Pago con tarjeta';
        } else {
            flagBtn = false;
        }

    } else if (type == 'pse') {
        const bank = await getDataBankPSEById(idData);
        if (bank) {
            data = `<div class="input-radio">
                         <p class="text-own-card">${bank.name}</p>
                     </div>`;

            dataConfirm['additionalData'] = bank;
            document.querySelector('#type-method').textContent = 'Pago por PSE';
        } else {
            flagBtn = false;
        }
    }

    dataConfirm['type'] = type;
    document.querySelector('.additional-info-paid').innerHTML = '';
    document.querySelector('.additional-info-paid').innerHTML = data;
    document.querySelector('#confirmForm').dataset.type = dataConfirm.type;

    if (!flagBtn) {
        document.querySelector('#type-method').textContent = '<h2>ERROR -- TARJETA NO ENCONTRADA</h2> <br> (Intente mas tarde, comuniquese con un administrador)';
    } else {
        document.querySelector('#confirmBtn').classList.remove('d-none');
    }

}

const allowEventBtnDelete = () => {
    document.querySelectorAll('.delete-card').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const tokenCard = e.target.dataset.card;
            const flag = confirm("¿Desea eliminar esta tarjeta?");
            if (flag) {
                const status = await deleteCard(tokenCard, uid);
                if (status.message == 'card deleted') {
                    location.reload();
                }
            }
        })
    });
}



let successHandler = (cardResponse) => {
    if (cardResponse.card.status === 'valid') {
        newCard = cardResponse.card;
        idData = cardResponse.card.token;
        showInfoConfirmData('card');
        hiddenMainElements('confirmTransfer');

    } else if (cardResponse.card.status === 'review') {
        $('#mensaje-bugueado').html('Card Under Review<br>' +
            'status: ' + cardResponse.card.status + '<br>' +
            "Card Token: " + cardResponse.card.token + "<br>" +
            "transaction_reference: " + cardResponse.card.transaction_reference
        );
        location.reload();
    } else {
        $('#mensaje-bugueado').html('Error<br>' +
            'status: ' + cardResponse.card.status + '<br>' +
            "message Token: " + cardResponse.card.message + "<br>"
        );
    }
    submitButton.removeAttr("disabled");
    submitButton.text(submitInitialText);
};

let errorHandler = (err) => {
    $('#mensaje-bugueado').html(err.error.type);
    submitButton.removeAttr("disabled");
    submitButton.text(submitInitialText);
};


let paymentCheckout = new PaymentCheckout.modal({
    client_app_code: dataPayment.APP_CODE,
    client_app_key: dataPayment.APP_KEY,
    locale: 'es', // User's preferred language (es, en, pt). English will be used by default.
    env_mode: 'stg', // `prod`, `stg`, `local` to change environment. Default is `stg`
    onResponse: (response) => {
        (response.transaction && response.transaction.status === 'success') ? $('#mensaje-bugueado').html("Transaccion exitosa") : $('#mensaje-bugueado').html('Error<br>' + "message: " + response.error.type + "<br>");
        if (response.transaction.status == 'success') {
            transfer = {
                id_transfer: response.transaction.id,
                status: response.transaction.status,
                product: response.transaction.product_description
            }
            redirectConfirmPay();
        } else {
            $('#mensaje-bugueado').html('<br>ERROR<br>' +
                'status: ' + response.transaction.current_status + '<br>' +
                "message: " + response.transaction.message + "<br>" +
                "id_transference: " + response.transaction.id
            );
        }
    }
});


const redirectConfirmPay = () => {
    const token = generateToken();

    localStorage.setItem(`${token}`, JSON.stringify(transfer));

    window.location.href = `${DOMAIN}PayConfirmed?token=${token}`;
}