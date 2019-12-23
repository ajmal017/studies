function getPrice(ticker) {
    var outputDiv = document.getElementById('main');
    var xhttp = new XMLHttpRequest();
    setInterval(function () {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                outputDiv.innerHTML = "";
                outputDiv.innerHTML += JSON.parse(this.responseText).price;
                outputDiv.innerHTML += JSON.parse(this.responseText).symbol;
            }
        }
        xhttp.open("GET", "https://financialmodelingprep.com/api/v3/stock/real-time-price/" + ticker, true);
        xhttp.send(null);
    }, 500);
}

var btn = document.getElementById('btnGetPrice');
btn.addEventListener('click', function () {
    var tickerInput = document.getElementById('tickerInput').value;
    getPrice(tickerInput);
}, false);