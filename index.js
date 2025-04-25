import { lendBook, returnBook } from "./src/Services/management.service.js";

import Library from "./src/Models/library.model.js";
import Book from "./src/Models/book.model.js";
import User from "./src/Models/user.model.js";
import { displayBookData, displayUserData } from "./src/Views/displayData.js";

const library = new Library();
const book = new Book(
  "To Kill a Mockingbird",
  "Harper Lee",
  1960,
  "9780061120084"
);
const book2 = new Book("1984", "George Orwell", 1949, "9780451524935");
const user = new User("Mohamed", "Mohamed@example.com");
const user2 = new User("Baraka", "Baraka@example.com");

// Resgister new user
console.log(library.registerUser(user));
console.log(library.registerUser(user2));

// Get Registered users
console.log(library.getAllUsers().map(displayUserData));

// Add new book
console.log(library.addBook(book));
console.log(library.addBook(book2));

// lend book to user
console.log(lendBook(library, book.isbn, user._id, 3));
console.log(lendBook(library, book2.isbn, user._id, 3));

// return book from user
console.log(await returnBook(library, book.isbn, user._id));
console.log(await returnBook(library, book2.isbn, user._id));

// Get all books
console.log(library.getAllBooks().map(displayBookData));

// Search book
console.log(library.searchBook("mockingbird"));

// Get one book
console.log(displayBookData(library.getBook("9780061120084")));

// // Remove user
console.log(library.removeUser(user2._id));

// // Remove book
console.log(library.removeBook(book2.isbn));

// Get status summary of library
console.log(library.statusSummary);
