class BorrowingPolicy {
  constructor(limit) {
    this.limit = limit;
  }
  isLimitReached(borrowedCount) {
    return borrowedCount >= this.limit;
  }
}

export default BorrowingPolicy;
