window.addEventListener('DOMContentLoaded', loadEventListeners);
const formInput = document.getElementById('form-add-to-do');
const todoList = document.getElementById('ul-to-do');
const doneList = document.getElementById('ul-done');

function loadEventListeners() {
    loadList();
    formInput.addEventListener('submit', addItem);
    todoList.addEventListener('click', removeItem);
    todoList.addEventListener('click', processCheckBox);
    doneList.addEventListener('click', removeItem);
    doneList.addEventListener('click', processCheckBox);
}

function loadList() {
    let xhr = new XMLHttpRequest();
    let todoList = document.getElementById('ul-to-do');
    let doneList = document.getElementById('ul-done');
    let notifyEmptyDiv = document.getElementById('div-notify-empty');
    let todoContent = '';
    let doneContent = '';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'nothing exists in the list.') {
                notifyEmptyDiv.innerText = 'Nothing exists in the list!';
            } else {
                notifyEmptyDiv.innerText = '';
                let json = JSON.parse(this.responseText);
                for (let i = 0, n = json.length; i < n; ++i) {
                    if (json[i].done === 'false') {
                        todoContent += `
                            <li class="li-to-do-item">
                                <div class="div-chkbox">
                                    <input type="hidden" name="${json[i].id}">
                                    <input type="checkbox" id="checkbox${i + 1}">
                                    <label for="checkbox${i + 1}"></label>
                                </div>
                                <span class="span-to-do-item">${json[i].content}</span>
                                <div class="div-remove-btn"><input type="hidden" name="${json[i].id}"></input><i class="fas fa-times"></i></div>
                            </li>
                        `
                    } else {
                        doneContent += `
                            <li class="li-done-item">
                                <div class="div-chkbox">
                                    <input type="hidden" name="${json[i].id}">
                                    <input type="checkbox" id="checkbox${i + 1}" checked>
                                    <label for="checkbox${i + 1}"></label>
                                </div>
                                <span class="span-done-item">${json[i].content}</span>
                                <div class="div-remove-btn"><input type="hidden" name="${json[i].id}"></input><i class="fas fa-times"></i></div>
                            </li>
                        `
                    }
                }
            }
            todoList.innerHTML = todoContent;
            doneList.innerHTML = doneContent;
        }
    }
    xhr.open('GET', 'loadlist.php', true);
    xhr.send(null);
}

function addItem() {
    const todoInput = document.getElementById('input-add-to-do');
    let xhr = new XMLHttpRequest();
    let sendData = 'content=' + todoInput.value;

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            sortList();
            loadList();
            todoInput.value = '';
        }
    }
    xhr.open('POST', 'addtodo.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(sendData);
}

function removeItem(elem) {
    if(elem.target.classList.contains('fas') && elem.target.classList.contains('fa-times')) {
        if(confirm('Are you sure you want to delete this item?')) {
            let itemId = elem.target.previousSibling.name;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    sortList();
                    loadList();
                    console.log(this.responseText);
                }
            }
            xhr.open('GET', 'remove.php?id=' + itemId, true);
            xhr.send(null);
        }
    }
}

function sortList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "sortitems.php", true);
    xhr.send(null);
}

function processCheckBox(elem) {
    if(elem.target.type === 'checkbox') {
        const extractId = /\d+/;
        let itemId = elem.target.id.match(extractId)[0];
        let isDone = false;
        let xhr = new XMLHttpRequest();
        if(elem.target.checked === true) {
            isDone = true;
        }
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                sortList();
                loadList();
            }
        }
        xhr.open('GET', 'processchkbtn.php?done=' + isDone + '&id=' + itemId, true);
        xhr.send(null);
    }
}