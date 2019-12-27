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

function getToday() {
    var today = new Date();
    return today.toISOString().substring(0, 10);
}

function GetYesterday() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().substring(0, 10);
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
                arrAvgPrices.push(Math.round(totalPrice / totalQty * 1000) / 1000); // rounding in third place
                arrTotalQtys.push(totalQty);
                totalPrice = 0;
                totalQty = 0;
            }
            for (var i = 0; i < json.length; ++i) {
                var holdingsDiv = document.createElement("div");
                holdingsDiv.setAttribute('id', 'holding-' + (i + 1));
                holdingsDiv.setAttribute('class', 'color');
                holdingsDiv.innerHTML = "<ul><li>" + arrTickerNames[i].toUpperCase() + "</li><li id='avg-price-" + arrTickerNames[i] + "'>Avg. Price: " + arrAvgPrices[i] + "</li><li id='total-qty-" + arrTickerNames[i] + "'>Total Quantity: " + arrTotalQtys[i] + "</li></ul><div id='real-time-price-" + arrTickerNames[i] + "'></div><div id='today-gain-" + arrTickerNames[i] + "'></div><div id='total-gain-" + arrTickerNames[i] + "'></div>";
                mainDiv.appendChild(holdingsDiv);
            }
            for (var i = 0; i < json.length; ++i) {
                var holdingsDiv = document.getElementById('holding-' + (i + 1));
                setInterval(GetRealTimePrice, 2000, arrTickerNames[i], holdingsDiv, arrTotalQtys[i]);
                // setInterval(CalcTodayGain, 2000, arrTickerNames[i]);
                // setTimeout(CalcTodayGain, 2500, arrTickerNames[i]);
                // setTimeout(function run(ticker, jsonLen) {
                //     CalcTodayGain(ticker, jsonLen);
                //     setTimeout(run, 1000, ticker, jsonLen);
                // }, 5000, arrTickerNames[i], json.length);
            }
        }
    }
    xhr.open("GET", "showHoldings.php", true);
    xhr.send(null);
}

function GetRealTimePrice(ticker, holdingsDiv, totalQty) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var priceDiv = document.getElementById("real-time-price-" + ticker);
            priceDiv.innerHTML = JSON.parse(this.responseText).price;
            ShowTodayGain(JSON.parse(this.responseText).price, ticker, holdingsDiv, totalQty);
            ShowTotalGain(JSON.parse(this.responseText).price, ticker, holdingsDiv, totalQty);
        }
    }
    xhr.open("GET", "https://financialmodelingprep.com/api/v3/stock/real-time-price/" + ticker, true);
    xhr.send(null);

}

function ShowTodayGain(realTimePrice, ticker, holdingsDiv, totalQty) {
    var yesterday = GetYesterday();
    var selectGain = document.getElementsByTagName('select')[0].value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var previousPrice = JSON.parse(this.responseText).historical[0].open;
            var outputDiv = document.getElementById("today-gain-" + ticker);
            var todayGain = Math.round((realTimePrice - previousPrice) * 1000) / 1000;
            var totalTodayGain = todayGain * totalQty;
            outputDiv.innerHTML = todayGain + " " + totalTodayGain;
            if (selectGain === "today") {
                ColoringTodayGain(todayGain, holdingsDiv);
            }
        }
    }
    xhr.open("GET", "https://financialmodelingprep.com/api/v3/historical-price-full/" + ticker + "?from=" + yesterday + "&to=" + yesterday, true);
    xhr.send(null);
}

function ShowTotalGain(realTimePrice, ticker, holdingsDiv, totalQty) {
    var selectGain = document.getElementsByTagName('select')[0].value;
    var extractFloat = /[+-]?\d+(\.\d+)?/g;
    var avgPrice = parseFloat(document.getElementById("avg-price-" + ticker).firstChild.nodeValue.match(extractFloat)[0]);
    var totalGain = Math.round((realTimePrice - avgPrice) * totalQty * 1000) / 1000;
    var outputDiv = document.getElementById("total-gain-" + ticker);
    outputDiv.innerHTML = totalGain;
    if (selectGain === "total") {
        ColoringTotalGain(totalGain, holdingsDiv);
    }

}

function ColoringTodayGain(todayGain, holdingsDiv) {
    if (todayGain > 0) {
        holdingsDiv.style.backgroundColor = "#00cc66";
        holdingsDiv.style.border = "1px solid #006633";
    } else if (todayGain < 0) {
        holdingsDiv.style.backgroundColor = "#ff4d4d";
        holdingsDiv.style.border = "1px solid #cc0000";
    } else {
        holdingsDiv.style.backgroundColor = "lightgray";
        holdingsDiv.style.border = "1px solid gray";
    }
}

function ColoringTotalGain(totalGain, holdingsDiv) {
    if (totalGain > 0) {
        holdingsDiv.style.backgroundColor = "#00cc66";
        holdingsDiv.style.border = "1px solid #006633";
    } else if (totalGain < 0) {
        holdingsDiv.style.backgroundColor = "#ff4d4d";
        holdingsDiv.style.border = "1px solid #cc0000";
    } else {
        holdingsDiv.style.backgroundColor = "lightgray";
        holdingsDiv.style.border = "1px solid gray";
    }
}

window.addEventListener('load', ShowMyHoldings, false);