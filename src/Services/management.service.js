import BorrowingRecords from "../Models/BorrowingRecord.js";

function lendBook(library, isbn, userId, dueDays = 7) {
  const book = library.getBook(isbn);
  if (!book) throw new Error(`Book with ISBN ${isbn} not found in library.`);

  const user = library.getUser(userId);
  if (!user)
    throw new Error(`User with ID ${userId} not registered in library.`);

  if (library.isBookBorrowed(isbn)) {
    throw new Error(
      `Book with title: ${book.title} is currently marked as borrowed.`
    );
  }

  if (library.isBorrowingLimitReached(userId)) {
    throw new Error(
      `User with ID ${userId} has reached the borrowing limit: ${
        library.getUserBorrowings(userId).size
      }.`
    );
  }

  if (library.getOverdueFines(userId) > 0) {
    throw new Error(
      `User with ID ${userId} has ${library.getOverdueFines(
        userId
      )} overdue fines, please pay them first.`
    );
  }

  let dueDate = Date.now() + dueDays * 24 * 60 * 60 * 1000;
  const borrowingRecord = new BorrowingRecords(user._id, book.isbn, dueDate);

  library.addToBorrowingRecord(borrowingRecord);

  return `${book.title} has been borrowed by ${user.name}.`;
}

async function returnBook(library, isbn, userId) {
  const book = library.getBook(isbn);
  if (!book) throw new Error(`Book with ISBN ${isbn} not found in library.`);

  const user = library.getUser(userId);
  if (!user)
    throw new Error(`User with ID ${userId} not registered in library.`);

  if (!library.isBookBorrowed(isbn)) {
    throw new Error(
      `Book with title: ${book.title} is not currently marked as borrowed.`
    );
  }

  const fine = library.calculateOverdueFines(isbn);
  if (fine > 0) library.addToOverdueFines(user._id, fine);

  await library.removeFromBorrowingRecord(isbn);

  return `${book.title} has been returned by ${user.name} ${
    fine ? `with a fine of ${fine}` : ""
  }.`;
}

export { lendBook, returnBook };
