class Book {
  #isbn;

  constructor(title, author, year, isbn) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.#isbn = isbn;
  }

  get isbn() {
    return this.#isbn;
  }

  toString() {
    return `Title: ${this.title}, Author: ${this.author}, Year: ${
      this.year
    }, ISBN: ${this.#isbn}`;
  }

  toJSON() {
    return {
      title: this.title,
      author: this.author,
      year: this.year,
      isbn: this.#isbn,
    };
  }
}

export default Book;
