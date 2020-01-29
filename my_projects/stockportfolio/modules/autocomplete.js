import {
  stockList
} from './stocklist.js'

const inputElement = document.getElementById('input-ticker');
const candidateDiv = document.getElementById('match-candidates');


inputElement.addEventListener('input', e => {
  searchByTicker(e.target);
  searchByName(e.target);
  hideMatchDivs();
})

function searchByTicker(inputElem) {
  const tickerInput = inputElem.value;
  const stockListLength = stockList.length;
  if (tickerInput === '') {
    candidateDiv.style.overflowY = ''
    removeExistingList();
    return false;
  }

  removeExistingList();

  for (let i = 0, content; i < stockListLength; i++) {
    if (stockList[i].Ticker.substring(0, tickerInput.length) === tickerInput.toUpperCase()) {
      const matchItemsDivs = document.createElement('DIV');
      matchItemsDivs.setAttribute('class', 'match-items');
      if (stockList[i].Name.substring(0, tickerInput.length).toUpperCase() === tickerInput.toUpperCase()) {
        content = `<pre class="company-name"><strong>${stockList[i].Name.substring(0, tickerInput.length)}</strong>${stockList[i].Name.substring(tickerInput.length)}</pre>`
      } else {
        content = `<pre class="company-name">${stockList[i].Name}</pre>`;
      }
      content += `
        <span class="ticker-name"><strong>${stockList[i].Ticker.substring(0, tickerInput.length)}</strong>${stockList[i].Ticker.substring(tickerInput.length)}</span>
        <span class="exchange-name">${stockList[i].Exchange}</span>
      `;

      matchItemsDivs.innerHTML = content;
      candidateDiv.appendChild(matchItemsDivs);
    }
  }
  if (isOverFlown(candidateDiv)) candidateDiv.style.overflowY = 'scroll';
  else candidateDiv.style.overflowY = '';

}

function searchByName(inputElem) {
  const tickerInput = inputElem.value;
  const stockListLength = stockList.length;
  const matchItemsDivs = document.createElement('DIV');
  matchItemsDivs.setAttribute('class', 'match-items');

  if (tickerInput === '') {
    candidateDiv.style.overflowY = ''
    removeExistingList();
    return false;
  }

  // removeExistingList();
  if (isCandidatesExist(inputElem.nextElementSibling.childNodes[0])) {
    for (let i = 0, content; i < stockListLength; i++) {
      if (stockList[i].Name.substring(0, tickerInput.length).toUpperCase() === tickerInput.toUpperCase()) {
        const matchItemsDivs = document.createElement('DIV');
        matchItemsDivs.setAttribute('class', 'match-items');
        content = `<pre class="company-name"><strong>${stockList[i].Name.substring(0, tickerInput.length)}</strong>${stockList[i].Name.substring(tickerInput.length)}</pre>`
        if (stockList[i].Ticker.substring(0, tickerInput.length) === tickerInput.toUpperCase()) {
          content += `<span class="ticker-name"><strong>${stockList[i].Ticker.substring(0, tickerInput.length)}</strong>${stockList[i].Ticker.substring(tickerInput.length)}</span>`
        } else {
          content += `<span class="ticker-name">${stockList[i].Ticker}</span>`;
        }
        content += `<span class="exchange-name">${stockList[i].Exchange}</span>`;
        matchItemsDivs.innerHTML = content;
        candidateDiv.appendChild(matchItemsDivs);
      }
    }
  } else {
    candidateDiv.innerHTML = '';
    for (let i = 0, content; i < stockListLength; i++) {
      if (stockList[i].Name.substring(0, tickerInput.length).toUpperCase() === tickerInput.toUpperCase()) {
        // stockList[i].Name.replace(' ', '&nbsp;');
        const matchItemsDivs = document.createElement('DIV');
        matchItemsDivs.setAttribute('class', 'match-items');
        content = `<pre class="company-name"><strong>${stockList[i].Name.substring(0, tickerInput.length)}</strong>${stockList[i].Name.substring(tickerInput.length)}</pre>`
        if (stockList[i].Ticker.substring(0, tickerInput.length) === tickerInput.toUpperCase()) {
          content += `<span class="ticker-name"><strong>${stockList[i].Ticker.substring(0, tickerInput.length)}</strong>${stockList[i].Ticker.substring(tickerInput.length)}</span>`
        } else {
          content += `<span class="ticker-name">${stockList[i].Ticker}</span>`;
        }
        content += `<span class="exchange-name">${stockList[i].Exchange}</span>`;
        matchItemsDivs.innerHTML = content;
        candidateDiv.appendChild(matchItemsDivs);
      }
    }
  }
}

function isCandidatesExist(elementNode) {
  return elementNode !== undefined;
}

function removeExistingList() {
  candidateDiv.innerHTML = '';
}

function isOverFlown(element) {
  return element.scrollHeight > element.clientHeight;
}

function hideMatchDivs() {
  const matchDivs = document.getElementById('match-candidates');
  matchDivs.addEventListener('click', e => {
    e.target.parentNode.innerHTML = '';
  })
}