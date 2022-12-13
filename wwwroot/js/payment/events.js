/* TODO: Add Event Listener*/
document.addEventListener('DOMContentLoaded', async () => {
    let flagExistService = true;
    document.querySelector('#spin').className += "loading show";

    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);

    /*
        TODO: APIS USER
    */

    if (urlParams.get('uid')) {
        uid = urlParams.get('uid')
        const { cards, result_size } = await getListCards(uid);
        if (result_size > 0) {
            showOwnCards(cards);
        }
    }
    const idService = urlParams.get('idService');
    if (idService) {
        service = await getServicesById(idService);
        (service) ? showService(service) : flagExistService = false;
    }
    (idService && uid && flagExistService) ? hiddenMainElements('optionPaid') : document.querySelector('#spinMessage').innerHTML = `<h2>Error Servicio o Usuario no encontrado !!</h2>`;
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
            $('.expiry').on('keyup', () => {
                document.querySelector('.expiracion').textContent = $('.expiry').val();
                if ($('.expiry').val() === '') {
                    document.querySelector('.expiracion').textContent = 'MM / YY';
                }
                showPosicionCard(true);
            });
            hiddenMainElements('divCardForm');
        } else if (optionSelected == 'pse') {
            showBanks(await getDataBanksPSE());
            hiddenMainElements('divPseForm');
        } else if (optionSelected == 'ownCard') {
            showInfoConfirmData('card');
            hiddenMainElements('confirmTransfer');
        }
    }
});

document.querySelector('#confirmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('#spin').className += "loading show";
    if (e.target.dataset.type == 'pse') {
        const token = generateToken();
        const transaction = await createTransferPSE(idData, token, service);

        localStorage.setItem(`${token}`, transaction.id);
        document.querySelector('#btnToPSE').setAttribute('href', transaction.bank_url);
        //document.querySelector('#tokenData').textContent = token;
        //document.querySelector('#linkData').textContent = `${URLPAYPSE}?token=${token}`;
        //document.querySelector('.btn-return').classList.add('d-none');
        hiddenMainElements('divPseTransfer');

    } else if (e.target.dataset.type == 'card') {
        const response = await transferByTokenCard(service, { id: 'hola' }, dataConfirm.additionalData);
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
        $('#mensaje-bugueado').html('');
        document.querySelector('.btn-return').classList.add('d-none');
        document.querySelector('#optionPaid').classList.remove('d-none');
        document.querySelector('#divCardForm').classList.add('d-none');
        document.querySelector('#divPseForm').classList.add('d-none');
        document.querySelector('#confirmTransfer').classList.add('d-none');
        // cleanInputs();
    });
});



$("#add-card-form").submit((e) => {
    e.preventDefault();
    let myCard = $('#my-card');
    $('#mensaje-bugueado').text("");
    cardToSave = myCard.PaymentForm('card');

    if (cardToSave == null) {
        $('#mensaje-bugueado').text("Información de la tarjeta incorrecta");
    } else {
        submitButton.attr("disabled", "disabled").text("Procesando Tarjeta...");
        let email = "prueba@test.com";

        /* Add Card converts sensitive card data to a single-use token which you can safely pass to your server to charge the user.
         *
         * @param uid User identifier. This is the identifier you use inside your application; you will receive it in notifications.
         * @param email Email of the user initiating the purchase. Format: Valid e-mail format.
         * @param card the Card used to create this payment token
         * @param success_callback a callback to receive the token
         * @param failure_callback a callback to receive an error
         */
        Payment.addCard(uid, email, cardToSave, successHandler, errorHandler);

    }
});


document.querySelector('#tarjeta').addEventListener('click', () => {
    document.querySelector('#tarjeta').classList.toggle('active');
});


$('#card-number').keyup(() => {
    let valorInput = $('#card-number').val();
    document.querySelector('#tarjeta .numero').textContent = valorInput;

    if (valorInput == '') {
        document.querySelector('#tarjeta .numero').textContent = '#### #### #### ####';
        document.querySelector('#logo-marca').innerHTML = '';
    }

    // document.querySelector('#logo-marca').innerHTML = '';
    // const imagen = document.createElement('img');
    // if (valorInput[0] == 4) {
    //     imagen.src = 'img/logos/visa.png';
    //     document.querySelector('#logo-marca').appendChild(imagen);
    // } else if (valorInput[0] == 5) {
    //     imagen.src = 'img/logos/mastercard.png';
    //     document.querySelector('#logo-marca').appendChild(imagen);
    // }

    showPosicionCard(true);
});

$('#the-card-name-id').keyup(() => {
    let valorInput = $('#the-card-name-id').val();
    document.querySelector('#tarjeta .nombre').textContent = valorInput;
    if (valorInput == '') {
        document.querySelector('#tarjeta .nombre').textContent = '';
    }
    showPosicionCard(true);
});

$('#cvc').keyup(() => {
    let valorInput = $('#cvc').val();
    document.querySelector('.ccv').textContent = valorInput;
    showPosicionCard(false);
});


document.querySelector('.js-payment-checkout').addEventListener('click', (e) => {
    e.preventDefault();
    paymentCheckout.open({
        user_id: uid,
        user_email: '', //optional
        user_phone: '', //optional
        order_description: service.name,
        order_amount: service.price,
        order_vat: 0,
        order_reference: `#${service.id}`,
        //order_installments_type: 2, // optional: The installments type are only available for Ecuador and Mexico. The valid values are: https://paymentez.github.io/api-doc/#payment-methods-cards-debit-with-token-base-case-installments-type
        //order_taxable_amount: 0, // optional: Only available for Ecuador. The taxable amount, if it is zero, it is calculated on the total. Format: Decimal with two fraction digits.
        //order_tax_percentage: 10 // optional: Only available for Ecuador. The tax percentage to be applied to this order.
    });
});

window.addEventListener('popstate', () => {
    paymentCheckout.close();
});


