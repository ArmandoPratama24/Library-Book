const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        addBook();

    });
});

function addBook() {
  const textTitle = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const timestamp = document.getElementById('inputBookIsComplete').checked;
  const generateID = generateId();

  const bookObject = generateBookObject(generateID, textTitle, textAuthor, year, timestamp);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

function generateId() {
  return +new Date();
}


function generateBookObject(id, title, author, year, isComplete) {
  return {
      id,
      title,
      author,
      year: parseInt(year),
      isComplete
  }
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  uncompletedBOOKList.innerHTML = '';

  const completeBOOKList = document.getElementById('completeBookshelfList');
  completeBOOKList.innerHTML = '';

  
  
  for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
          uncompletedBOOKList.append(bookElement);
      } else {
          completeBOOKList.append(bookElement);
          
      }
}
})


function makeBook(BookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = BookObject.title;

  const textAuthor = document.createElement('p')
  textAuthor.innerText = BookObject.author

  const year = document.createElement('p')
  year.innerText = BookObject.year

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, year)
  container.setAttribute('id', `book-${BookObject.id}`);


  if (BookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.innerText = "Belum Selesai Dibaca"
    undoButton.classList.add('green');

    undoButton.addEventListener('click', function () {
        undoBookFromComplete(BookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus Buku'
    trashButton.classList.add('red');

    trashButton.addEventListener('click', function () {
        removeBookFromComplete(BookObject.id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
 
    buttonContainer.append(undoButton, trashButton);
    container.append(buttonContainer);
    
  } else if (!BookObject.isComplete) {
    const finishButton = document.createElement("button");
    finishButton.innerText = "buku selesai dibaca";
    finishButton.classList.add("green");
 
    finishButton.addEventListener("click", function () {
      addBookToComplete(BookObject.id);
    });
 
    const trashButton = document.createElement("button");
    trashButton.innerText = "hapus buku";
    trashButton.classList.add("red");
 
    trashButton.addEventListener("click", function () {
      removeBookFromComplete(BookObject.id);
    });
 
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
 
    buttonContainer.append(finishButton, trashButton);
 
    container.append(buttonContainer);
  }
 
  return container;
}

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget === null) return;
 
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
 
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
 
  return null;
}

function removeBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
 
function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget === null) return;
 
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function saveBook() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}
 
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
 
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
 


const submitSearchButton = document.getElementById("searchSubmit");
 
submitSearchButton.addEventListener("click", function (event) {
  event.preventDefault();
 
  const inputSearch = document.getElementById("searchBookTitle").value.toLowerCase();
 
  const searchBooks = document.querySelectorAll(".book_item > h2");
 
  for (const searchBook of searchBooks) {
    if (inputSearch === searchBook.innerText.toLowerCase()) {
        searchBook.parentElement.style.display = 'block';
    } else {
        searchBook.parentElement.style.display = "none";
    }
  }

});