class BorrowingRecord {
  constructor(userId, isbn, dueDate = Date.now() + 7 * 24 * 60 * 60 * 1000) {
    this.userId = userId;
    this.isbn = isbn;
    this.dueDate = dueDate;
    this.borrowedAt = Date.now();
  }

  isOverdue(currentTime = Date.now()) {
    return this.dueDate && currentTime > this.dueDate;
  }

  toJSON() {
    return {
      userId: this.userId,
      isbn: this.isbn,
      dueDate: this.dueDate,
      borrowedAt: this.borrowedAt,
    };
  }
}

export default BorrowingRecord;
