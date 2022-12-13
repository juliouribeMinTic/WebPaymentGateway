/*
    RECORDAR Revisar EL DOMINIO Y LA URLPAYPSE

*/

const URLAPIS = 'http://104.208.216.173:8083';
const DOMAIN = 'http://localhost:5003/';
//const DOMAIN = 'http://104.208.216.173/PayLink/';
const URLPAYPSE = 'http://localhost:5003/PayLink/PseValidate';
//const URLPAYPSE = 'http://104.208.216.173/PayLink/PayLink/PseValidate';


const apiGet = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.status == 200) {
            return data;
        } else {
            alert(`Error Code -- ${response.status}`);
        }
    } catch (e) {
        alert(`Error -- ${e}`);
    }
}

const getGroups = async () => {
    const { groups } = await apiGet(`./data/dataGroups.json`);
    return groups;
}

const getServices = async (idGroup) => {
    const { services } = await apiGet(`./data/dataServices.json`);
    return services.filter(service => service.group_id == idGroup);
}

const getServicesById = async (id) => {
    const { services } = await apiGet(`./data/dataServices.json`);
    return services.filter(service => service.id == id)[0];
}


const getDataBanksPSE = async () => {
    const { banks } = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/bancosPSE`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        }
    });

    return banks;
};

const getDataBankPSEById = async (id) => {
    const { banks } = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/bancosPSE`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        }
    });

    return banks.filter(bank => bank.code == id)[0];
};


const createTransferPSE = async (codeBank, token, service) => {
    data = {
        "carrier": {
            "id": "PSE",
            "extra_params": {
                "bank_code": "1022",
                "response_url": `${URLPAYPSE}?token=${token}`,
                "user": {
                    "name": "User full name",
                    "fiscal_number": 12312312313,
                    "type": "N",
                    "type_fis_number": "CC",
                    "ip_address": "201.0.90.12"
                }
            }
        },
        "user": {
            "id": "sdf",
            "email": "user@example.com",
            "phone_number": "9878987677",
            "address": {
                "street": "calle 1",
                "number": "10",
                "district": "district",
                "city": "Cartagena",
                "state": "Bolivar",
                "zip": "130001"
            }
        },
        "order": {
            "country": "COL",
            "currency": "COP",
            "dev_reference": "1",
            "amount": parseFloat(service.price.toFixed(2)),
            "vat": 0,
            "description": service.name
        }
    }


    const { transaction } = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/transferenciaPSE`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
        body: JSON.stringify(data),
    });

    return transaction;
};


const validateStatePSE = async (idTransferencia) => {
    const { transaction } = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/estadoTransferenciaPSE?transactionId=${idTransferencia}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        }
    });
    return transaction;
};

const addCards = async (card) => {
    const data = {
        "user": {
            "id": "4",
            "email": "user@example.com"
        },
        "card": {
            "number": card.number,
            "holder_name": card.holder_name,
            "expiry_month": card.expiry_month,
            "expiry_year": card.expiry_year,
            "cvc": card.cvc,
            "type": card.type
        }
    }

    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/agregarTarjeta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
        body: JSON.stringify(data),
    });
    return response;
}


const getListCards = async (uid) => {
    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/listarTarjetas?uid=${uid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
    });
    return response;
}

const getCardByToken = async (uid, token) => {
    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/listarTarjetas?uid=${uid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
    });
    return response.cards.filter(card => card.token == token)[0];
}

const deleteCard = async (tokenCard, uid) => {

    const data = {
        "card": {
            "token": `${tokenCard}`
        },
        "user": {
            "id": `${uid}`
        }
    }

    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/eliminarTarjeta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
        body: JSON.stringify(data),
    });


    return response;
}

const transferByTokenCard = async (service, user, card) => {
    const data = {
        "user": {
            "id": uid,
            "email": "user@example.com"
        },
        "order": {
            "amount": 11.1,
            "description": service.name,
            "vat": 0,
            "dev_reference": "referencia"
        },
        "card": {
            "token": card.token
        }
    }

    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/pagoConTokenTarjeta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
        body: JSON.stringify(data),
    });

    return response
}


const transferByCard = async (service, user, card) => {
    const data = {
        "user": {
            "id": uid,
            "email": "user@example.com"
        },
        "order": {
            "amount": 11.1,
            "description": service.name,
            "vat": 0,
            "dev_reference": "referencia"
        },
        "card": {
            "number": card.number,
            "holder_name": card.holder_name,
            "expiry_month": card.expiry_month,
            "expiry_year": card.expiry_year,
            "cvc": card.cvc,
            "type": card.type
        }
    }

    const response = await apiGet(`${URLAPIS}/Davivienda/PasarelaDePago/pagoConTarjeta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        },
        body: JSON.stringify(data),
    });

    return response
}



