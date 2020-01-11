window.addEventListener('DOMContentLoaded', loadEventListeners);

function loadEventListeners() {
    const ui = new UI();
    ui.loadBooks();
    document.getElementById('book-form').addEventListener('submit', processSubmit);
    document.getElementById('ul-list').addEventListener('click', function (e) {
        ui.deleteItem(e.target);
        ui.editUIChange(e.target);
    });
    document.getElementById('input-isbn').addEventListener('input', function (e) {
        ui.checkDuplicate(e.target.value);
    })
}

function Book(title, author, category, isbn) {
    this.title = title;
    this.author = author;
    this.category = category;
    this.isbn = isbn;
}

function UI() {}
UI.prototype.loadBooks = function () {
    const listUl = document.getElementById('ul-list');
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'nothing exists in the list.') {
                listUl.children[0].remove();
                const notifyDiv = document.createElement('div');
                notifyDiv.setAttribute('class', 'notify-empty')
                notifyDiv.textContent = 'The List is Empty Now.'
                listUl.appendChild(notifyDiv);
            } else {
                if (document.getElementsByClassName('notify-empty')[0] !== undefined) {
                    document.getElementsByClassName('notify-empty')[0].remove();
                }
                listUl.innerHTML = '';
                let json = JSON.parse(this.responseText);
                for (let i = 0, n = json.length; i < n; ++i) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="list-item-title">${json[i].title}</span>
                        <span class="list-item-author">${json[i].author}</span>
                        <span class="list-item-category">${json[i].category}</span>
                        <span class="list-item-isbn">${json[i].isbn}</span>
                        <span class="list-item-edit"><i class="far fa-edit"></i></span>
                        <span class="list-item-delete"><i class="fas fa-times"></i></span>
                    `;
                    listUl.appendChild(li);
                }
            }
        }
    }
    xhr.open('GET', 'loadbooks.php', true);
    xhr.send(null);
}

UI.prototype.addBookList = function (book) {
    const sendData = `title=${encodeURIComponent(book.title)}&author=${book.author}&category=${book.category}&isbn=${book.isbn}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const ui = new UI();
            ui.loadBooks();
            ui.showMsg('The Book Successfully Added!', 'success-msg');
        }
    }
    xhr.open('POST', 'addbook.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(sendData);
}

UI.prototype.deleteItem = function (target) {
    if (target.className === 'fas fa-times' && confirm('Do you really want to delete this list?')) {
        const isbn = target.parentElement.parentElement.children[3].firstChild.nodeValue;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText === 'successfully deleted!') {
                    const ui = new UI();
                    ui.showMsg('The Book Successfully Deleted!', 'success-msg');
                    ui.loadBooks();
                } else {
                    console.log(this.responseText);
                }
            }
        }
        xhr.open('GET', 'deletebook.php?isbn=' + isbn, true);
        xhr.send(null);
    } else {
        return false;
    }
}

UI.prototype.editUIChange = function (target) {
    if (target.className === 'far fa-edit') {
        const isbn = target.parentElement.parentElement.children[3].firstChild.nodeValue;
        document.getElementById('btn-submit').firstChild.nodeValue = 'EDIT';
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const json = JSON.parse(this.responseText);
                document.getElementById('input-title').value = json.title;
                document.getElementById('input-author').value = json.author;
                document.getElementById('input-category').value = json.category;
                document.getElementById('input-isbn').value = json.isbn;
                document.getElementById('input-original-isbn').setAttribute('name', json.isbn);
            }
        }
        xhr.open('GET', 'getbookdata.php?isbn=' + isbn, true);
        xhr.send(null);
    }
}

UI.prototype.editBooklList = function (book) {
    const originalISBN = document.getElementById('input-original-isbn').name;
    const sendData = `title=${encodeURIComponent(book.title)}&author=${book.author}&category=${book.category}&isbn=${book.isbn}&original=${originalISBN}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const ui = new UI();
            ui.loadBooks();
            ui.clearInputFields();
            ui.showMsg('Successfully Edited!', 'success-msg');
            document.getElementById('btn-submit').firstChild.nodeValue = 'ADD';
        }
    }
    xhr.open('POST', 'editbook.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(sendData);
}

UI.prototype.showMsg = function (msg, msgType) {
    const msgDiv = document.getElementById('div-show-msg');
    const msgBox = document.createElement('p');
    msgBox.textContent = msg;
    msgBox.setAttribute('class', msgType);
    msgDiv.appendChild(msgBox);

    if (msgType === 'success-msg') {
        setTimeout(function () {
            document.querySelector('.' + msgType).remove();
        }, 2800);
    }
}

UI.prototype.checkDuplicate = function (isbn) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == 'duplicated') {
                const ui = new UI();
                ui.showMsg('The ISBN is duplicated!', 'fail-msg');
            } else {
                if (document.querySelector('.fail-msg') !== null) {
                    document.querySelector('.fail-msg').remove();
                }
            }
        }
    }
    xhr.open('GET', 'checkduplicate.php?isbn=' + isbn, true);
    xhr.send(null);
}

UI.prototype.clearInputFields = function () {
    document.getElementById('input-title').value = '';
    document.getElementById('input-author').value = '';
    document.getElementById('input-category').value = '';
    document.getElementById('input-isbn').value = '';
}

function processSubmit(e) {
    const title = document.getElementById('input-title').value,
        author = document.getElementById('input-author').value,
        category = document.getElementById('input-category').value,
        isbn = document.getElementById('input-isbn').value;
    const book = new Book(title, author, category, isbn);
    const ui = new UI();

    if (e.target.children[5].firstChild.nodeValue === 'ADD') {
        ui.addBookList(book);
        ui.clearInputFields();
    } else if (e.target.children[5].firstChild.nodeValue === 'EDIT') {
        ui.editBooklList(book);
    }


    e.preventDefault();
}