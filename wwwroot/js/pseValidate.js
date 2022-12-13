const apiGet = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}


const setDataBanksPSE = async (idTransferencia) => {
    const { transaction } = await apiGet(`http://104.208.216.173:8083/Davivienda/PasarelaDePago/estadoTransferenciaPSE?transactionId=${idTransferencia}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImJlNTJjMjllLTI3Y2MtNDdiYy05ODFhLTljMzcwMjUyMzk3MiIsIm5hbWUiOiI3OTU3OTk5OTgiLCJUaXBvRG9jdW1lbnRvIjoiQ0MiLCJqdGkiOiJmMjE3MTNhYy0xODc1LTRlOWUtOGRlYi1iNmZlN2JhMGJjNmIiLCJuYmYiOjE2NjkzMTE1NTAsImV4cCI6MTY2OTMxNTE1MCwiaWF0IjoxNjY5MzExNTUwLCJpc3MiOiJob3NwaXRhbCIsImF1ZCI6ImVtcGxlYWRvc0hvc3BpdGFsIn0.pnEbw_5okYqySpYsp2338pvyJsbbU2XuYkTxY0GHmtzyKG1XPTE_Vjpl0Z9pJkLf4xBo6vY2k2rPqyjjOdcU3A",
            "Access-Control-Allow-Origin": '*',
        }
    });

    const pseForm = document.querySelector('#statusTransfer');
    pseForm.textContent = (transaction.status == 'failure') ? 'Fallida' : (transaction.status == 'approved') ? pseForm.textContent = 'Aprobado' : (transaction.status == 'pending') ? pseForm.textContent = 'Pendiente' : (transaction.status == 'rejected') ? pseForm.textContent = 'Rechazada' : 'NO INFO';

    pseForm.classList.add((transaction.status == 'failure') ? 't-red' : (transaction.status == 'approved') ? 't-green' : (transaction.status == 'pending') ? 't-gray' : (transaction.status == 'rejected') ? 't-red' : '');
    return transaction.status;
};

const timerValidateState = async (idTransferencia) => {
    let i = 0;
    let status = await setDataBanksPSE(idTransferencia);
    while ((status == 'failure' || status == 'pending') && i < 3) {
        ((i) => {
            setTimeout(async () => {
                status = await setDataBanksPSE(idTransferencia);
                ((status != 'failure' && status != 'pending') || i == 2) ? document.querySelector('#spin').removeAttribute('class') : '';
                ((status != 'failure' && status != 'pending') || i == 2) ? document.querySelector('.mensaje-spin').classList.add('d-none') : '';
            }, 2000 * i)
        })(i++)
    }
    return status
}



document.addEventListener('DOMContentLoaded', async function () {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    const idTransferencia = localStorage.getItem(urlParams.get('token'));
    if (idTransferencia) {
        const status = await timerValidateState(idTransferencia);
        (status == 'approved' || status == 'rejected') ? document.querySelector('#spin').classList.remove('loading') : '';
        (status == 'approved' || status == 'rejected') ? document.querySelector('.mensaje-spin').classList.add('d-none') : '';
        document.querySelector('#mensaje').textContent = (status == 'failure' || status == 'pending') ? 'Su transacción aun esta en proceso, enviaremos un correo con la confirmación o rechazo.' : (status == 'approved' || status == 'rejected') ? 'Su transacción fue existosa, gracias por su compra.' : '';
    }
});


