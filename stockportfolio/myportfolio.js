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
    CloseEditModal();
}

function ProcessAddPosition(ticker, price, quantity, date) {
    var sendData = "ticker=" + ticker + "&price=" + price + "&quantity=" + quantity + "&date=" + date;
    var p1 = new Promise(function (resolve) {
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
                    console.log(this.responseText);
                }
            }
            xhttp.open("POST", "addData.php", true);
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhttp.send(sendData);
        } else {
            var p2 = new Promise(function (resolve) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve("done");
                    }
                }
                xhttp.open("GET", "createTable.php?ticker=" + ticker, true);
                xhttp.send(null);
            });
            p2.then(function () {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                    }
                }
                xhttp.open("POST", "addData.php", true);
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhttp.send(sendData);
            });
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

// var btn = document.getElementById('btnGetPrice');
// btn.addEventListener('click', function () {
//     var tickerInput = document.getElementById('tickerInput').value;
//     getPrice(tickerInput);
// }, false);


function getToday() {
    var today = new Date();
    return today.toISOString().substring(0, 10);
}


var modal = document.getElementById('modal');

function ShowEditModal() {
    var dateControl = document.querySelector('input[type="date"]');
    dateControl.value = getToday();
    modal.style.display = "block";
}

function CloseEditModal() {
    var ticker = document.getElementById('input-ticker').value = "";
    var ppr = document.getElementById('input-price').value = "";
    var qty = document.getElementById('input-quantity').value = "";
    var dateControl = document.querySelector('input[type="date"]');
    dateControl.value = getToday();
    modal.style.display = "none";
}


function ShowMyHoldings() {
    var mainDiv = document.getElementById('main');
    var totalQty = 0;
    var totalPrice = 0;
    var arrTickerNames = [];
    var arrAvgPrices = [];
    var arrTotalQtys = [];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            for (var i = 0; i < json.length; ++i) {
                for (var j = 0; j < json[i].transaction.length; ++j) {
                    if (j == 0)
                        arrTickerNames.push(json[i].name);
                    totalPrice += json[i].transaction[j].price * json[i].transaction[j].quantity;
                    totalQty += parseInt(json[i].transaction[j].quantity);
                }
                arrAvgPrices.push(Math.round(totalPrice / totalQty * 100) / 100); // rounding in third place
                arrTotalQtys.push(totalQty);
                totalPrice = 0;
                totalQty = 0;
            }
            for (var i = 0; i < json.length; ++i) {
                var holdingsDiv = document.createElement("div");
                holdingsDiv.setAttribute('id', 'holding-' + (i + 1));
                holdingsDiv.setAttribute('class', 'color');
                holdingsDiv.innerHTML = "<ul><li>" + arrTickerNames[i].toUpperCase() + "</li><li>Avg. Price: " + arrAvgPrices[i] + "</li><li>Total Quantity: " + arrTotalQtys[i] + "</li></ul><div id='real-time-price-" + arrTickerNames[i] + "'></div>";
                mainDiv.appendChild(holdingsDiv);
            }
            for (var i = 0; i < json.length; ++i) {
                var holdingsDiv = document.getElementById('holding-' + (i + 1));
                setInterval(GetRealTimePrice, 1000, arrTickerNames[i]);
            }
        }
    }
    xhr.open("GET", "showHoldings.php", true);
    xhr.send(null);
}

function GetRealTimePrice(ticker) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var priceDiv = document.getElementById("real-time-price-" + ticker);
            priceDiv.innerHTML = JSON.parse(this.responseText).price;
        }
    }
    xhr.open("GET", "https://financialmodelingprep.com/api/v3/stock/real-time-price/" + ticker, true);
    xhr.send(null);

}

window.addEventListener('load', ShowMyHoldings, false);