import User from "./user.model.js";
import Book from "./book.model.js";
import BorrowingPolicy from "./BorrowingPolicy.js";
import HistoryRepository from "./HistoryRepository.js";

class Library {
  #books;
  #users;
  #borrowingRecord;
  #overdueFines;
  #userBorrowings;
  #borrowingPolicy;
  #historyRepository;

  constructor(
    borrowingPolicy = new BorrowingPolicy(3),
    historyRepository = new HistoryRepository()
  ) {
    this.#books = new Map();
    this.#users = new Map();
    this.#borrowingRecord = new Map();
    this.#overdueFines = new Map();
    this.#userBorrowings = new Map();
    this.#borrowingPolicy = borrowingPolicy;
    this.#historyRepository = historyRepository;
  }

  getAllUsers() {
    return Array.from(this.#users.values());
  }

  getAllBooks() {
    return Array.from(this.#books.values());
  }

  addBook(book) {
    if (!(book instanceof Book))
      throw new Error("Book is not an instance of Book class.");

    if (this.#books.has(book.isbn))
      throw new Error(`Book with ISBN ${book.isbn} already exists in library`);

    this.#books.set(book.isbn, book);
    return `Book with ISBN ${book.isbn} has been added to the library.`;
  }

  removeBook(isbn) {
    if (!this.#books.has(isbn))
      throw new Error(`Book with ISBN ${isbn} does not exist in library`);

    this.#books.delete(isbn);
    return `Book with ISBN ${isbn} has been removed from the library.`;
  }

  getBook(isbn) {
    return this.#books.get(isbn) || null;
  }

  registerUser(user) {
    if (!(user instanceof User))
      throw new Error("User is not an instance of User class.");

    if (this.#users.has(user._id))
      throw new Error("User already registered in library.");

    this.#users.set(user._id, user);
    return `${user.name} has been registered in library.`;
  }

  getUser(userId) {
    return this.#users.get(userId) || null;
  }

  removeUser(userId) {
    if (!this.#users.has(userId))
      throw new Error("User is not registered in library.");

    this.#users.delete(userId);
    return `User with ID ${userId} has been removed from the library.`;
  }

  searchBook(keyword) {
    if (typeof keyword !== "string")
      throw new Error("Keyword must be a string");

    return Array.from(this.#books.values()).filter(
      (book) =>
        book.title.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author.toLowerCase().includes(keyword.toLowerCase()) ||
        book.year.toString().includes(keyword)
    );
  }

  addToBorrowingRecord(record) {
    this.#borrowingRecord.set(record.isbn, record);

    // add to user borrowings list
    const userBorrowings = this.#userBorrowings.get(record.userId) || new Set();
    userBorrowings.add(record.isbn);
    this.#userBorrowings.set(record.userId, userBorrowings);
  }

  getUserBorrowings(userId) {
    return this.#userBorrowings.get(userId) || new Set();
  }

  isBorrowingLimitReached(userId) {
    const userBorrowings = this.#userBorrowings.get(userId) || new Set();
    return this.#borrowingPolicy.isLimitReached(userBorrowings.size);
  }

  async removeFromBorrowingRecord(isbn) {
    // save history entry to history.json file after book is returned
    const record = this.#borrowingRecord.get(isbn);
    if (!record) throw new Error(`No borrowing record found for ISBN ${isbn}`);
    const historyEntry = { ...record.toJSON(), returnedAt: Date.now() };
    await this.#historyRepository.saveRecord(JSON.stringify(historyEntry));

    // remove book from borrowing record
    this.#borrowingRecord.delete(isbn);

    // remove book from user borrowings list
    const userBorrowings = this.#userBorrowings.get(record.userId);
    if (userBorrowings) {
      userBorrowings.delete(isbn);

      //  remove user borrowings list if empty
      if (userBorrowings.size === 0) this.#userBorrowings.delete(record.userId);
    }
  }

  isBookBorrowed(isbn) {
    return this.#borrowingRecord.has(isbn);
  }

  isOverdue(isbn) {
    return this.#borrowingRecord.get(isbn).isOverdue();
  }

  listBorrowingRecord() {
    return Array.from(this.#borrowingRecord.values()).map((record) =>
      record.toJSON()
    );
  }

  listOverdueBooks() {
    return Array.from(this.#borrowingRecord.values())
      .filter((record) => record.isOverdue())
      .map((record) => record.toJSON());
  }

  calculateOverdueFines(isbn) {
    const record = this.#borrowingRecord.get(isbn);
    const overdue = record.isOverdue(Date.now());
    return overdue ? 100 : 0;
  }

  addToOverdueFines(userId, fine) {
    if (this.#overdueFines.has(userId)) fine += this.#overdueFines.get(userId);
    this.#overdueFines.set(userId, fine);
  }

  removeFromOverdueFines(userId) {
    if (!this.#overdueFines.has(userId)) return;
    this.#overdueFines.delete(userId);
  }

  getOverdueFines(userId) {
    return this.#overdueFines.get(userId) || 0;
  }

  listOverdueFines() {
    return Array.from(this.#overdueFines.entries()).map(([userId, fine]) => ({
      userId,
      fine,
    }));
  }

  get statusSummary() {
    return {
      books: this.#books.size,
      users: this.#users.size,
      borrowedBoks: this.#borrowingRecord.size,
    };
  }
}

export default Library;
