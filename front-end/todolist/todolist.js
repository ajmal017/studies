var btnNew = document.getElementById('btnAdd').onclick = function () {
    addNewItem(document.getElementById('todolist'));
};

function addNewItem(list) {
    var listItem = document.createElement('li');
    listItem.innerText = "Hello";
    list.appendChild(listItem);
}

function loadLists() {
    var xhttp = new XMLHttpRequest();
    var todoList = document.getElementById('todolist');
    var doneList = document.getElementById('donelist');
    var todoContent = "";
    var doneContent = "";

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            for (var i = 0; i < json.length; ++i) {
                if (json[i].done == "false") {
                    todoContent += "<li class='undone'><input type='checkbox' name='" + (i + 1) + "' onclick='processChk(this, this.name)'><span>" + json[i].content + "</span><button id='btnDelete' name='" + (i + 1) + "' onclick='deleteItem(this.name)'>DELETE</button></li>"
                } else {
                    doneContent += "<li class='done'><input type='checkbox' name='" + (i + 1) + "' onclick='processChk(this, this.name)' checked><span>" + json[i].content + "</span></span><button id='btnDelete' name='" + (i + 1) + "' onclick='deleteItem(this.name)'>DELETE</button></li>"
                }
            }
            todoList.innerHTML = todoContent;
            doneList.innerHTML = doneContent;
        }
    }
    xhttp.open("GET", "retrieve.php", true);
    xhttp.send(null);
}


function sortList() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadLists();
        }
    }
    xhttp.open("GET", "sort.php", true);
    xhttp.send(null);
}

function processChk(isCheck, num) {
    var sendData = "";
    if (isCheck.checked === true) {
        sendData = "processcheck.php?checked=t&num=" + num;
    } else {
        sendData = "processcheck.php?checked=f&num=" + num;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadLists();
        }
    }
    xhttp.open("GET", sendData, true);
    xhttp.send(null);
}

function deleteItem(num) {
    var answer = confirm("Do you want to delete this item?");
    if (answer === false) return;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        loadLists();
    }
    xhttp.open("GET", "delete.php?num=" + num, true);
    xhttp.send(null);
}

window.addEventListener('load', loadLists, false);