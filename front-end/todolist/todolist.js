function loadList() {
    var xhttp = new XMLHttpRequest();
    var todoList = document.getElementById('todolist');
    var doneList = document.getElementById('donelist');
    var todoContent = "";
    var doneContent = "";

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "empty set") {
                todoContent = "";
                doneContent = "";
                document.getElementById('notifyEmpty').innerHTML = "List does not exist!";
            } else {
                document.getElementById('notifyEmpty').innerHTML = "";
                var json = JSON.parse(this.responseText);
                for (var i = 0; i < json.length; ++i) {
                    if (json[i].done == "false") {
                        todoContent += "<li class='undone'><input type='checkbox' name='" + (i + 1) + "' onclick='processChkBtn(this, this.name)'><span>" + json[i].content + "</span><button id='btnDelete' name='" + (i + 1) + "' onclick='deleteItem(this.name)'>DELETE</button></li>"
                    } else {
                        doneContent += "<li class='done'><input type='checkbox' name='" + (i + 1) + "' onclick='processChkBtn(this, this.name)' checked><span>" + json[i].content + "</span></span><button id='btnDelete' name='" + (i + 1) + "' onclick='deleteItem(this.name)'>DELETE</button></li>"
                    }
                }

            }
            todoList.innerHTML = todoContent;
            doneList.innerHTML = doneContent;
        }
    }
    xhttp.open("GET", "retrieve.php", true);
    xhttp.send(null);
}

function addItem() {
    var newContent = document.getElementById('newItem');
    var sendData = "content=" + newContent.value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            sortList();
            loadList();
            newContent.value = "";
        }
    }
    xhttp.open("POST", "add.php", true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(sendData);
}

function sortList() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "sort.php", true);
    xhttp.send(null);
}

function processChkBtn(isCheck, num) {
    var sendData = "";
    if (isCheck.checked === true) {
        sendData = "checked=t&num=" + num;
    } else {
        sendData = "checked=f&num=" + num;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            sortList();
            loadList();
        }
    }
    xhttp.open("GET", "processcheck.php?" + sendData, true);
    xhttp.send(null);
}

function deleteItem(num) {
    var answer = confirm("Do you want to delete this item?");
    if (answer === false) return;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        sortList();
        loadList();
    }
    xhttp.open("GET", "delete.php?num=" + num, true);
    xhttp.send(null);
}

window.addEventListener('load', loadList, false);