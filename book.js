//BookClass represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI class: handles UI task

class UI {
  static displayBooks() {
    /*const StoredBooks = [
      {
        title: "Book One",
        author: "John Doe",
        isbn: "70555437",
      },
      {
        title: "Book Two",
        author: "Jane Doe",
        isbn: "70555437",
      },
    ];*/

    const books = store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
     <td>${book.author}</td>
     <td>${book.isbn}</td>
     <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
    list.appendChild(row);
  }

  static delBooks(el) {
    if (el.classList.contains("delete"))
      el.parentElement.parentElement.remove();
  }

  static showAlerts(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container ");
    const orm = document.querySelector("#book-form");
    container.insertBefore(div, orm);
    //vanish in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//store class: handles storage
class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn===isbn){
        books.splice(index,1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
//event: display book
document.addEventListener("DOMContentLoaded", UI.displayBooks);
//event: add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  //validate
  if (title === "" || author === "" || isbn === "")
    UI.showAlerts("Please fill in all details", "danger");
  else {
    const book = new Book(title, author, isbn);
    // console.log(book)
    //ADD book to UI
    UI.addBookToList(book);
    //Add book to store
    store.addBook(book);
    //show success message
    UI.showAlerts("book added", "success");
    UI.clearFields();
  }
});
//event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //delete book from UI
  UI.delBooks(e.target);
  
  //delete booK from store
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlerts("book removed", "success");
});
