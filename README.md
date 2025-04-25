# OOP Solid Library System

A JavaScript-based library management system built to practice Object-Oriented Programming (OOP) and SOLID principles. The system supports managing books, users, borrowing/returning books, due date tracking, overdue fines, and persistent history storage. It features a single copy per book, tracked by ISBN, and a modular design using ES modules.

## Table of Contents

- [Features](#features)
- [OOP and SOLID Principles](#oop-and-solid-principles)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Book Management**:
  - Add/remove books, with one copy per ISBN (`Map<isbn, Book>`).
  - Search books by title or author.
  - Track availability (borrowed or not).
- **User Management**:
  - Register/remove users.
  - Track user borrowings.
- **Borrowing System**:
  - Borrow books with a borrowing limit (default: 3 per user).
  - Return books, calculating overdue fines (100 units if overdue).
  - Persistent history of returned books in `history.json`.
- **Due Date and Fines**:
  - Set due dates (default: 7 days from borrowing).
  - Detect overdue books and apply fines.
  - Track fines per user.
- **History Storage**:
  - Save completed borrowing records to `history.json` on return.
  - Retrieve user-specific or full borrowing history.
- **ES Modules**:
  - Modern JavaScript with ES modules (`"type": "module"`).
  - File path resolution using `import.meta.url`.

## OOP and SOLID Principles

The project adheres to OOP and SOLID principles:

- **Single Responsibility Principle (SRP)**:
  - `Library`: Manages books, users, and borrowings.
  - `HistoryRepository`: Handles file I/O for `history.json`.
  - `BorrowingPolicy`: Defines borrowing limits.
  - `Book`, `User`, `BorrowingRecord`: Encapsulate their respective data and behavior.
- **Open/Closed Principle (OCP)**:
  - `getHistory` supports extensible filters (e.g., `userId`, future `isbn`).
  - `BorrowingPolicy` can be extended for custom rules (e.g., `OverdueAwarePolicy`).
- **Liskov Substitution Principle (LSP)**:
  - Classes like `BorrowingPolicy` can be swapped without breaking functionality.
- **Interface Segregation Principle (ISP)**:
  - Classes expose only necessary methods (e.g., `Library`’s public API).
- **Dependency Inversion Principle (DIP)**:
  - `Library` depends on abstractions (e.g., `historyRepository` constructor parameter).
- **OOP Features**:
  - **Encapsulation**: Private fields (`#books`, `#borrowingRecord`) and methods.
  - **Abstraction**: Clear class responsibilities (e.g., `BorrowingRecord` for due dates).
  - **Polymorphism**: Extensible policy classes.
  - **Inheritance**: Not heavily used, favoring composition for flexibility.

## Project Structure

```
oop-solid-library-system/
├── src/
│   ├── Models/
│   │   ├── book.model.js        # Book class
│   │   ├── borrowingRecord.js   # BorrowingRecord class
│   │   ├── user.model.js        # User class
│   │   └── library.model.js     # Library class
│   ├── Controllers/
│   │   └── library.controller.js # Borrowing/returning logic
│   └── historyRepository.js     # History file I/O
├── data/
│   └── history.json             # Persistent borrowing history
├── package.json                 # Project metadata and dependencies
└── README.md                    # This file
```

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/oop-solid-library-system.git
   cd oop-solid-library-system
   ```
2. **Install Dependencies**:
   - Requires Node.js (v16 or higher).
   - No external dependencies, as it uses Node.js built-in modules (`fs`, `path`, `url`).
   ```bash
   npm install
   ```
3. **Ensure Data Directory**:
   - The `data/` directory is created automatically by `HistoryRepository` if missing.
   - Optionally, create it manually:
     ```bash
     mkdir data
     ```

## Usage

1. **Run the Application**:

   - Create a main script (e.g., `index.js`) to use the library system:

     ```javascript
     import Library from "./src/Models/library.model.js";
     import Book from "./src/Models/book.model.js";
     import User from "./src/Models/user.model.js";
     import {
       lendBook,
       returnBook,
     } from "./src/Controllers/library.controller.js";

     async function main() {
       const library = new Library();
       const book = new Book("123", "The Great Gatsby", "F. Scott Fitzgerald");
       const user = new User("user1", "Mohamed");

       // Add book and user
       library.addBook(book);
       library.registerUser(user);

       // Borrow book
       console.log(await lendBook(library, "123", "user1"));
       // Output: "The Great Gatsby has been borrowed by Mohamed."

       // Return book
       console.log(await returnBook(library, "123", "user1"));
       // Output: "The Great Gatsby has been returned by Mohamed."
     }

     main().catch(console.error);
     ```

   - Run the script:
     ```bash
     node index.js
     ```

2. **Check history.json**:
   - After returning a book, `data/history.json` will contain:
     ```json
     [
       {
         "userId": "user1",
         "isbn": "123",
         "dueDate": 1743110400000,
         "borrowedAt": 1743024000000,
         "returned": true,
         "returnedAt": 1743025000000
       }
     ]
     ```

## Testing

- **Manual Testing**:
  - Use the `index.js` example above to test borrowing, returning, and history storage.
  - Verify `history.json` for returned books.
  - Test edge cases (e.g., borrowing an already borrowed book, overdue returns).
- **Automated Testing**:
  - Add a test suite using a framework like Jest (not included).
  - Example test cases:
    - Borrowing a book marks it as unavailable.
    - Returning a book saves to `history.json` and makes it available.
    - Overdue books incur fines (100 units).
    - `getHistory({ userId })` returns user-specific records.
- **Sample Test**:
  ```javascript
  const library = new Library();
  const book = new Book("123", "To Kill a Mockingbird", "Harper Lee");
  library.addBook(book);
  const user = new User("user2", "Alice");
  library.registerUser(user);
  await lendBook(library, "123", "user2");
  await returnBook(library, "123", "user2");
  const history = await library._historyRepository.getHistory({
    userId: "user2",
  });
  console.log(history); // Should show one record
  ```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request with a clear description of changes.

**Guidelines**:

- Follow OOP and SOLID principles.
- Write clear, testable code with comments where necessary.
- Update `README.md` for new features.
- Include tests for new functionality.

**Potential Enhancements**:

- Add `OverdueAwarePolicy` to restrict borrowing based on past overdues.
- Support saving active borrowings to `history.json` (save-on-lend).
- Implement book reservations or ISBN validation.
- Replace `history.json` with a database (e.g., SQLite).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
