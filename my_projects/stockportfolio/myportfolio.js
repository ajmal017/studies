window.addEventListener('DOMContentLoaded', initiateListners, false);
import {
	stockList
} from './modules/stocklist.js';
Date.prototype.adjustHourToEasternTime = function (h) {
	this.setHours(this.getHours() + h);
	return this;
}

function initiateListners() {
	ShowMyHoldings();
	document.getElementById('btn-open-modal').addEventListener('click', showEditModal);
	document.getElementById('btn-close-modal').addEventListener('click', closeEditModal);
	document.getElementById('btn-edit-position').addEventListener('click', getInputData);
	document.getElementById('main').addEventListener('click', e => {
		if (e.target.classList.contains('material-icons')) {
			const companyName = e.target.parentNode.parentNode.children[1].textContent;
			const ticker = e.target.parentNode.parentNode.children[2].textContent;
			liquidatePosition(companyName, ticker);
		}
	})
}

function getInputData() {
	const ticker = document.getElementById('input-ticker').value.toLowerCase();
	const ppr = document.getElementById('input-price').value;
	const qty = document.getElementById('input-quantity').value;
	const date = document.getElementById('input-date').value;
	if (document.getElementsByName('type')[0].checked === true) processAddPosition(ticker, ppr, qty, date);
	else if (document.getElementsByName('type')[1].checked === true) ProcessRemovePosition(ticker, ppr, qty, date);
	closeEditModal();
}

function processAddPosition(ticker, price, quantity, date) {
	const sendData = `ticker=${ticker}&price=${price}&quantity=${quantity}&date=${date}`;
	getTableList(ticker).then(isTableExist => {
		if (isTableExist) {
			addNewData(sendData);
		} else {
			createNewTable(ticker, sendData);
		}
	});
}

async function getTableList(ticker) {
	const url = `tableList.php?ticker=${ticker}`;
	const tableExistence = await fetch(url);
	return tableExistence.json();
}

async function addNewData(sendData) {
	const url = 'addData.php';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: sendData
	});
	return response;
}

async function createNewTable(ticker, sendData) {
	const url = `createTable.php?ticker=${ticker}`;
	await fetch(url);
	addNewData(sendData);
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
	const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
	return localISOTime;
}

function showEditModal() {
	const modal = document.getElementById('modal');
	const dateControl = document.querySelector('input[type="date"]');
	dateControl.value = getToday();
	modal.style.display = "grid";
}

function closeEditModal() {
	const modal = document.getElementById('modal');
	document.getElementById('input-ticker').value = "";
	document.getElementById('input-price').value = "";
	document.getElementById('input-quantity').value = "";
	const dateControl = document.querySelector('input[type="date"]');
	dateControl.value = getToday();
	modal.style.display = "none";
	setTimeout(function () {
		location.reload(true);
	}, 100);

}

function ShowMyHoldings() {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML = "";
	var totalQty = 0;
	var totalPrice = 0;
	var arrTickerNames = [];
	var arrAvgPrices = [];
	var arrTotalQtys = [];
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			if (this.responseText === "null") {} else {
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
					holdingsDiv.setAttribute('class', 'stock-item');
					const companyName = getMatchCompanyName(arrTickerNames[i]);
					// holdingsDiv.innerHTML = `
					// 							<ul>
					// 									<li>${companyName}</li>
					//                   <li>${arrTickerNames[i].toUpperCase()}</li>
					//                   <li id='avg-price-${arrTickerNames[i]}'>Avg.Price: ${arrAvgPrices[i]}</li>
					//                   <li id='total-qty-${arrTickerNames[i]}'>Total Quantity: ${arrTotalQtys[i]}</li>
					//                   <li id='real-time-price-${arrTickerNames[i]}'>&#160;<span id='real-time-percent-${arrTickerNames[i]}'></span></li>
					//                   <li id='today-gain-${arrTickerNames[i]}'></li>
					// 									<li id='total-gain-${arrTickerNames[i]}'></li>
					// 									<li><i class="fas fa-trash"></i></li>
					//               </ul>
					// 					`;
					holdingsDiv.innerHTML = `
						<input type="hidden" value="${arrAvgPrices[i]}">
						<div id="company-name-${companyName}">${companyName}</div>
						<div id="ticker-name-${arrTickerNames[i].toUpperCase()}">${arrTickerNames[i].toUpperCase()}</div>
						<div id="real-time-price-${arrTickerNames[i]}"></div>
						<div id="today-gain-${arrTickerNames[i]}"> </div>
						<div id="total-gain-${arrTickerNames[i]}" ></div>
						<div class="show-more"><span class="btn-show-more">SHOW MORE</span></div>
						<div class="delete-icon"><i class="material-icons">delete</i></div>
					`
					mainDiv.appendChild(holdingsDiv);
				}
				for (var i = 0; i < json.length; ++i) {
					var holdingsDiv = document.getElementById('holding-' + (i + 1));
					setTimeout(function run(ticker, div, qty) {
						getRealTimePrice(ticker, div, qty);
						setTimeout(run, 2000, ticker, div, qty);
					}, 1, arrTickerNames[i], holdingsDiv, arrTotalQtys[i]);
				}
			}
		}
	}
	xhr.open("GET", "showHoldings.php", true);
	xhr.send(null);
}

function getMatchCompanyName(ticker) {
	let matchName = '';
	stockList.forEach(stock => {
		if (ticker.toUpperCase() === stock.Ticker) {
			matchName = stock.Name;
		}
	});
	return matchName;
}


async function getRealTimePrice(ticker, holdingsDiv, totalQty) {
	const url = `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`;
	// const url = `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_37e934a52c6a451182f2dbf16615da50`;
	const realTimePriceData = await fetch(url);
	realTimePriceData.json().then(realTimeData => {
		const priceDiv = document.getElementById(`real-time-price-${ticker}`);
		const realTimePrice = realTimeData.price.toFixed(2);
		priceDiv.textContent = realTimePrice;
		showTodayGain(realTimePrice, ticker, holdingsDiv, totalQty);
		ShowTotalGain(realTimePrice, ticker, holdingsDiv, totalQty);
	});
}


function showTodayGain(realTimePrice, ticker, holdingsDiv, totalQty) {
	const previousPriceData = getPreviousPrice(ticker);
	const selectGain = document.getElementById('select-gain').value;
	previousPriceData.then(priceData => {
		const previousPrice = priceData.historical[0].close;
		const todayGainDiv = document.getElementById(`today-gain-${ticker}`);
		// const realTimeLi = document.getElementById(`real-time-percent-${ticker}`);s
		const todayGain = (realTimePrice - previousPrice).toFixed(2);
		const todayGainPercent = (todayGain / realTimePrice * 100).toFixed(3);
		const totalTodayGain = ((realTimePrice - previousPrice) * totalQty).toFixed(2);
		todayGainDiv.textContent = `Today's P&L: ${totalTodayGain}(${todayGainPercent}%)`;
		if (selectGain === "today") {
			ColoringTodayGain(todayGain, holdingsDiv);
		}
	});
}

function ShowTotalGain(realTimePrice, ticker, holdingsDiv, totalQty) {
	const selectGain = document.getElementById('select-gain').value;
	const extractFloat = /[+-]?\d+(\.\d+)?/g;
	const avgPrice = holdingsDiv.children[0].value;
	const totalGain = ((realTimePrice - avgPrice) * totalQty).toFixed(2);
	const totalGainPercent = (totalGain / (avgPrice * totalQty) * 100).toFixed(3);
	const outputDiv = document.getElementById(`total-gain-${ticker}`);
	outputDiv.textContent = `Total P&L: ${totalGain}(${totalGainPercent}%)`
	if (selectGain === "total") {
		ColoringTotalGain(totalGain, holdingsDiv);
	}
}

async function getPreviousPrice(ticker) {
	const date = new Date();
	const nowHour = getEasternTime('hour');
	const nowDay = getEasternTime('day');
	const nowMinute = date.getMinutes();
	let requestDate;
	if (nowDay === 1) { // Monday Case
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30) || nowHour > 16) { // Before Open  at Monday 
			requestDate = getPreviousDay(4); // Get Last Thursday's Close
		} else { // Intraday or After Close at Monday
			requestDate = getPreviousDay(3); // Get Last Friday's Close
		}
	} else if (nowDay === 2) { // Tuesday Case
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30) || nowHour > 16) { // Before Open  at Tuesday 
			requestDate = getPreviousDay(4); // Get Last Friday's Close
		} else { // Intraday or After Close at Tuesday
			requestDate = getPreviousDay(1); // Get Yesterday(Monday)'s Close
		}
	} else if (3 <= nowDay && nowDay <= 5) { // Wednesday ~ Friday Case
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30) || nowHour > 16) { // Before Open  at Wednesday ~ Friday 
			requestDate = getPreviousDay(2); // Get 2 days ago's Close
		} else { // Intraday or After Close at Wednesday ~ Friday
			requestDate = getPreviousDay(1); // Get Yesterday's Close
		}
	} else if (nowDay === 6) { // Saturday Case
		requestDate = getPreviousDay(2); // Get Thursday's Close
	} else if (nowDay === 0) { // Sunday Case
		requestDate = getPreviousDay(3);
	}
	const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?from=${requestDate}&to=${requestDate}`;
	const priceVal = await fetch(url);
	return priceVal.json();
}


function getEasternTime(requestData) {
	const localTime = new Date();
	const easternTimeOffset = localTime.getTimezoneOffset() / 60 - 5;
	const date = new Date().adjustHourToEasternTime(easternTimeOffset);
	let nowTime;
	if (requestData.toLowerCase() === 'day') {
		nowTime = date.getDay();
	} else if (requestData.toLowerCase() === 'hour') {
		nowTime = date.getHours();
	}
	return nowTime;
}


function getPreviousDay(subVal) {
	const localTime = new Date();
	const easternTimeOffset = localTime.getTimezoneOffset() / 60 - 5 - (subVal * 24);
	const easternDate = new Date().adjustHourToEasternTime(easternTimeOffset);
	const year = easternDate.getFullYear();
	// let month = (easternDate.getMonth() + 1).toString();
	let month = (easternDate.getMonth() + 1).toString();
	const day = easternDate.getDate();
	if (!(month == '11' || month == '12')) month = 0 + month;
	return `${year}-${month}-${day}`;
}


async function liquidatePosition(companyName, ticker) {
	if (confirm(`Are you sure you want to liquidate '${companyName}' position?`)) {
		const url = `liquidate.php?ticker=${ticker}`;
		await fetch(url);
		setTimeout(function () {
			location.reload(true);
		}, 100);
	} else return;
}

function ColoringTodayGain(todayGain, holdingsDiv) {
	if (todayGain > 0) {
		holdingsDiv.style.backgroundColor = "#06A683";
		holdingsDiv.style.border = "1px solid #06A683";
	} else if (todayGain < 0) {
		holdingsDiv.style.backgroundColor = "#D3414F";
		holdingsDiv.style.border = "1px solid #D3414F";
	} else {
		holdingsDiv.style.backgroundColor = "lightgray";
		holdingsDiv.style.border = "1px solid gray";
	}
}

function ColoringTotalGain(totalGain, holdingsDiv) {
	if (totalGain > 0) {
		holdingsDiv.style.backgroundColor = "#06A683";
		holdingsDiv.style.border = "1px solid #06A683";
	} else if (totalGain < 0) {
		holdingsDiv.style.backgroundColor = "#D3414F";
		holdingsDiv.style.border = "1px solid #D3414F";
	} else {
		holdingsDiv.style.backgroundColor = "lightgray";
		holdingsDiv.style.border = "1px solid gray";
	}
}