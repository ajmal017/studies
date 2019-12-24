function getPrice(ticker) {
    var outputDiv = document.getElementById('main');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            outputDiv.innerHTML = "";
            outputDiv.innerHTML += JSON.parse(this.responseText).price;
            outputDiv.innerHTML += JSON.parse(this.responseText).symbol;
        }
    }
    xhttp.open("GET", "https://financialmodelingprep.com/api/v3/stock/real-time-price/" + ticker, true);
    xhttp.send(null);
}

function GetPositionInput() {
    var ticker = document.getElementById('input-ticker').value.toLowerCase();
    var ppr = document.getElementById('input-price').value;
    var qty = document.getElementById('input-quantity').value;
    var date = document.getElementById('input-date').value;
    if (document.getElementsByName('type')[0].checked === true) ProcessAddPosition(ticker, ppr, qty, date);
    else if (document.getElementsByName('type')[1].checked === true) ProcessRemovePosition(ticker, ppr, qty, date);
}

function ProcessAddPosition(ticker, price, quantity, date) {
    var p1 = new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText === "true") resolve(true);
                else resolve(false);
            }
        }
        xhttp.open("GET", "tableList.php?ticker=" + ticker, true);
        xhttp.send(null);
    });
    p1.then(function (isTableExist) {
        if (isTableExist === true) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // 테이블에 input 정보 입력
                }
            }
            xhttp.open(); // addData.php 만들기 method는 post사용
            xhttp.send(null);
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "createTable.php?ticker=" + ticker, true);
            xhttp.send(null);
        }
    });
}

function ProcessRemovePosition(ticker, price, quantity, date) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

        }
    }
    xhttp.open();
    xhttp.send(null);
}

var btn = document.getElementById('btnGetPrice');
btn.addEventListener('click', function () {
    var tickerInput = document.getElementById('tickerInput').value;
    getPrice(tickerInput);
}, false);



var dateControl = document.querySelector('input[type="date"]');
dateControl.value = getToday();

function getToday() {
    var today = new Date();
    return today.toISOString().substring(0, 10);
}


var modal = document.getElementById('modal');

function ShowEditModal() {
    modal.style.display = "block";
}

function CloseEditModal() {
    modal.style.display = "none";
}