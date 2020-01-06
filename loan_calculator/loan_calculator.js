window.addEventListener('DOMContentLoaded', loadEventListeners);
const calculateBtn = document.getElementById('btn-calculate');
let timeouts = [];

function loadEventListeners() {
    calculateBtn.addEventListener('click', function () {
        const notifyDiv = document.getElementById('div-notify-wrong');
        if(notifyDiv !== null) {
            notifyDiv.style.display = 'none';
        }
        document.getElementById('div-loading').style.display = 'block';
        document.getElementById('div-result').style.display = 'none';
        if (timeouts.length != 0) {
            timeouts.forEach(function(func) {
                clearTimeout(func);
            })
        }
        timeouts.push(setTimeout(calculateResults, 1700));
    });
}

function calculateResults() {
    const amountInput = document.getElementById('input-amount');
    const interestInput = document.getElementById('input-interest');
    const yearsInput = document.getElementById('input-yrs-to-repay');
    const monthlyPaymentResult = document.getElementById('input-monthly-payment');
    const totalPaymentResult = document.getElementById('input-total-payment');
    const totalInterestResult = document.getElementById('input-total-interest');

    const principal = parseFloat(amountInput.value);
    const calculatedInterest = parseFloat(interestInput.value) / 100 / 12;
    const calculatedPayments = parseFloat(yearsInput.value) * 12;

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
        monthlyPaymentResult.value = monthly.toFixed(3);
        totalPaymentResult.value = (monthly * calculatedPayments).toFixed(3);
        totalInterestResult.value = ((monthly * calculatedPayments) - principal).toFixed(3);
        document.getElementById('div-loading').style.display = 'none';
        document.getElementById('div-result').style.display = 'grid';
    } else {
        if (document.getElementById('div-notify-wrong') === null) {
            showErrorMsg('Please check the numbers you entered');
        }
    }
}

function showErrorMsg(errorMsg) {
    document.getElementById('div-loading').style.display = 'none';
    const mainDiv = document.getElementById('div-main');
    const notifyDiv = document.createElement('div');
    const notifySpan = document.createElement('span');
    notifyDiv.id = 'div-notify-wrong';
    notifySpan.appendChild(document.createTextNode(errorMsg));
    notifyDiv.appendChild(notifySpan);
    mainDiv.insertBefore(notifyDiv, document.getElementById('div-calc'));


    setTimeout(clearErrorMsg, 3500);
}

function clearErrorMsg() {
    document.getElementById('div-notify-wrong').remove();
}