'use strict';
window.addEventListener('DOMContentLoaded', initiateListners, false);
import {
	stockList
} from './modules/stocklist.js';
Date.prototype.adjustHourToEasternTime = function (h) {
	this.setHours(this.getHours() + h);
	return this;
}

function initiateListners() {
	showMyHoldings();
	document.getElementById('btn-open-stock-modal').addEventListener('click', openStockEditModal);
	document.getElementById('btn-close-stock-modal').addEventListener('click', closeStockEditModal);
	document.getElementById('btn-close-cash-modal').addEventListener('click', closeCashEditModal);
	document.getElementById('btn-edit-stock-position').addEventListener('click', getStockInputData);
	document.getElementById('btn-edit-cash-position').addEventListener('click', getCashInputData);
	document.getElementById('btn-open-cash-modal').addEventListener('click', openCashEditModal);
	document.getElementById('main').addEventListener('click', e => {
		if (e.target.classList.contains('material-icons')) {
			const companyName = e.target.parentNode.parentNode.children[7].value;
			const ticker = e.target.parentNode.parentNode.children[8].value;
			liquidatePosition(companyName, ticker);
		}
	});
	document.getElementById('main').addEventListener('click', e => {
		if(e.target.classList.contains('btn-show-more')) {
			const selectedDiv = e.target.parentNode.parentNode;
			const theAvgPrice = selectedDiv.children[6].value;
			console.log(selectedDiv)
		}
	})
}

function getStockInputData() {
	const ticker = document.getElementById('input-ticker').value.toLowerCase();
	const ppr = document.getElementById('input-price').value;
	const qty = document.getElementById('input-stock-quantity').value;
	const date = document.getElementById('stock-input-date').value;
	if (document.getElementsByName('type-stock')[0].checked === true) addStockPosition(ticker, ppr, qty, date);
	else if (document.getElementsByName('type-stock')[1].checked === true) removeStockPosition(ticker, ppr, qty, date);
	closeStockEditModal();
}

function getCashInputData() {
	const qty = document.getElementById('input-cash-quantity').value;
	const date = document.getElementById('cash-input-date').value;
	if (document.getElementsByName('type-cash')[0].checked === true) addCashPosition(qty, date);
	else if (document.getElementsByName('type-cash')[1].checked === true) removeCashPosition(qty, date);
	closeCashEditModal();
}

function addStockPosition(ticker, price, quantity, date) {
	const sendData = `ticker=${ticker}&price=${price}&quantity=${quantity}&date=${date}`;
	getTableList(ticker).then(isTableExist => {
		if (isTableExist) {
			addNewStock(sendData);
		} else {
			createNewPositionTable(ticker, sendData);
		}
	});
}

async function getTableList(ticker) {
	const url = `tableList.php?ticker=${ticker}`;
	const tableExistence = await fetch(url);
	return tableExistence.json();
}

async function addNewStock(sendData) {
	const url = 'addNewStock.php';
	await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: sendData
	});
}

async function createNewPositionTable(ticker, sendData) {
	const url = `createStockTable.php?ticker=${ticker}`;
	await fetch(url);
	addNewStock(sendData);
}

function addCashPosition(quantity, date) {
	const sendData = `quantity=${quantity}&date=${date}`;
	getTableList('myCash').then(isCashTableExist => {
		if (isCashTableExist) {
			addNewCash(sendData);
		} else {
			createNewCashTable(sendData);
		}
	})
}

async function addNewCash(sendData) {
	const url = 'addNewCash.php';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: sendData
	});
	return response;
}

async function createNewCashTable(sendData) {
	const url = `createCashTable.php`;
	await fetch(url);
	addNewCash(sendData);
}

function removeStockPosition(ticker, price, quantity, date) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

		}
	}
	xhttp.open();
	xhttp.send(null);
}

function removeCashPosition(qty, date) {

}

function getToday() {
	const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
	const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
	return localISOTime;
}

function openStockEditModal() {
	const stockModal = document.getElementById('stock-modal');
	const dateControl = document.getElementById('stock-input-date');
	dateControl.value = getToday();
	stockModal.style.display = "grid";
}

function closeStockEditModal() {
	const modal = document.getElementById('stock-modal');
	document.getElementById('input-ticker').value = "";
	document.getElementById('input-price').value = "";
	document.getElementById('input-stock-quantity').value = "";
	const dateControl = document.getElementById('stock-input-date');
	dateControl.value = getToday();
	modal.style.display = "none";
	setTimeout(() => {
		location.reload(true);
	}, 50);
}

async function getMyCash() {
	const url = 'getMyCash.php';
	const response = await fetch(url);
	return response.json();
}

function openCashEditModal() {
	const cashModal = document.getElementById('cash-modal');
	const dateControl = document.getElementById('cash-input-date');
	dateControl.value = getToday();
	cashModal.style.display = "grid";
}

function closeCashEditModal() {
	const cashModal = document.getElementById('cash-modal');
	document.getElementById('input-cash-quantity').value = '';
	cashModal.style.display = "none";
	const dateControl = document.getElementById('cash-input-date');
	dateControl.value = getToday();
	setTimeout(() => {
		location.reload(true);
	}, 50);
}

async function showTotalValue() {
	const costUrl = 'getCosts.php';
	const costDiv = document.getElementById('total-value');
	const costResponse = await fetch(costUrl);
	const holdingsLen = document.getElementsByClassName('stock-item').length;
	let sumTotalCash = 0;
	let sumTotalGains = 0;
	for (let i = 0; i < holdingsLen; i++) {
		const sharesDiv = document.getElementById(`holding-${i + 1}`);
		sumTotalGains += parseFloat(sharesDiv.children[10].value);
	}
	costResponse.json().then(totalCost => {
		getMyCash().then(cashJSON => {
			const cashJSONLen = cashJSON.length;
			for (let i = 0; i < cashJSONLen; i++) {
				sumTotalCash += parseFloat(cashJSON[i].qty);
			}
			const totalValue = (parseFloat(totalCost.costs) + sumTotalGains + sumTotalCash).toFixed(2)
			const totalGainsPercent = ((sumTotalGains / parseFloat(totalCost.costs)) * 100).toFixed(2);
			// const totalGainsPercent = ((sumTotalGains / (parseFloat(totalCost.costs) + parseFloat(sumTotalCash))) * 100).toFixed(2);
			if (sumTotalGains > 0) {
				costDiv.style.color = '#06A683';
			} else if (sumTotalGains < 0) {
				costDiv.style.color = '#D3414F';
			}
			costDiv.textContent = `Total Value: $${totalValue}($${sumTotalGains.toFixed(2)})(${totalGainsPercent}%)`
		});

	});
}

async function showMyHoldings() {
	const mainDiv = document.getElementById('main');
	mainDiv.innerHTML = '';
	let totalQuantity = 0;
	let totalPrice = 0;
	const tickers = [];
	const avgPrices = [];
	const totalQuantities = [];
	const url = 'showHoldings.php';
	const response = await fetch(url);
	response.json().then(tables => {
		if (tables === null) return;
		const tableLen = tables.length;
		for (let i = 0; i < tableLen; i++) {
			for (let j = 0, n = tables[i].transaction.length; j < n; j++) {
				if (j === 0) tickers.push(tables[i].name);
				totalPrice += tables[i].transaction[j].price * tables[i].transaction[j].quantity;
				totalQuantity += parseInt(tables[i].transaction[j].quantity);
			}
			avgPrices.push((totalPrice / totalQuantity).toFixed(3));
			totalQuantities.push(totalQuantity);
			totalPrice = 0;
			totalQuantity = 0;
		}
		for (let i = 0; i < tableLen; i++) {
			const holdingsDiv = document.createElement('DIV');
			holdingsDiv.setAttribute('id', `holding-${i + 1}`);
			holdingsDiv.setAttribute('class', 'stock-item');
			const companyName = getMatchCompanyName(tickers[i]);
			const companyExchange = getMatchExchangeName(tickers[i]);
			holdingsDiv.innerHTML = `
				<div id="company-name-and-ticker-${tickers[i]}">
					<span class="item-company-name">${companyName}</span>
					<span class="item-company-ticker-and-exchange">${companyExchange}&#160;&#160;&#160;${tickers[i].toUpperCase()}</span>
				</div>
				<div id="real-time-price-${tickers[i]}"></div>
				<div class="show-gains">
					<div id="today-gain-${tickers[i]}"></div>
					<div id="total-gain-${tickers[i]}"></div>
				</div>
				<div class="shares-and-avg-price">${totalQuantities[i]}@${avgPrices[i]}</div>
				<div class="show-more"><span class="btn-show-more">SHOW MORE</span></div>
				<div class="delete-icon"><i class="material-icons">delete</i></div>
				<input type="hidden" name="avg-price" value="${avgPrices[i]}">
				<input type="hidden" name="company-name" value="${companyName}">
				<input type="hidden" name="ticker" value="${tickers[i]}">
				<input type="hidden" name="today-gain">
				<input type="hidden" name="total-gain">
			`
			mainDiv.appendChild(holdingsDiv);
		}
		for (let i = 0; i < tableLen; i++) {
			const stockDiv = document.getElementById(`holding-${i + 1}`);
			setTimeout(function run(ticker, div, qty) {
				getRealTimePrice(ticker, div, qty);
				setTimeout(run, 2000, ticker, div, qty);
			}, 1, tickers[i], stockDiv, totalQuantities[i]);
		}
	});
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

function getMatchExchangeName(ticker) {
	let matchExchange = '';
	stockList.forEach(stock => {
		if (ticker.toUpperCase() === stock.Ticker) {
			matchExchange = stock.Exchange;
		}
	});
	return matchExchange;
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
		showTotalGain(realTimePrice, ticker, holdingsDiv, totalQty);
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
		holdingsDiv.children[9].setAttribute('value', todayGain);
		if (selectGain === "today") {
			ColoringTodayGain(todayGain, holdingsDiv);
		}
	});
}

function showTotalGain(realTimePrice, ticker, holdingsDiv, totalQty) {
	const selectGain = document.getElementById('select-gain').value;
	// const extractFloat = /[+-]?\d+(\.\d+)?/g;
	const avgPrice = holdingsDiv.children[6].value;
	const totalGain = ((realTimePrice - avgPrice) * totalQty).toFixed(2);
	const totalGainPercent = (totalGain / (avgPrice * totalQty) * 100).toFixed(3);
	const outputDiv = document.getElementById(`total-gain-${ticker}`);
	outputDiv.textContent = `Total P&L: ${totalGain}(${totalGainPercent}%)`
	holdingsDiv.children[10].setAttribute('value', totalGain);
	if (selectGain === "total") {
		ColoringTotalGain(totalGain, holdingsDiv);
	}
	showTotalValue();
}

async function getPreviousPrice(ticker) {
	const date = new Date();
	const nowHour = getEasternTime('hour');
	const nowDay = getEasternTime('day');
	const nowMinute = date.getMinutes();
	let requestDate;
	if (nowDay === 1) { // Monday Case
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30)) { // Before Open  at Monday 
			// console.log(1);
			requestDate = getPreviousDay(4); // Get Last Thursday's Close
		} else { // Intraday or After Close at Monday
			// console.log(2);
			requestDate = getPreviousDay(3); // Get Last Friday's Close
		}
	} else if (nowDay === 2) { // Tuesday Case
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30)) { // Before Open  at Tuesday 
			// console.log(3);
			requestDate = getPreviousDay(4); // Get Last Friday's Close
		} else { // Intraday or After Close at Tuesday
			// console.log(4);
			requestDate = getPreviousDay(1); // Get Yesterday(Monday)'s Close
		}
	} else if (3 <= nowDay && nowDay <= 5) { // Wednesday ~ Friday Case
		// console.log(5);
		if (nowHour < 9 || (nowHour === 9 && nowMinute < 30)) { // Before Open  at Wednesday ~ Friday 
			requestDate = getPreviousDay(2); // Get 2 days ago's Close
		} else { // Intraday or After Close at Wednesday ~ Friday
			// console.log(6);
			requestDate = getPreviousDay(1); // Get Yesterday's Close
		}
	} else if (nowDay === 6) { // Saturday Case
		// console.log(7);
		requestDate = getPreviousDay(2); // Get Thursday's Close
	} else if (nowDay === 0) { // Sunday Case
		// console.log(8);
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