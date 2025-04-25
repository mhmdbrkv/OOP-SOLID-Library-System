import { v4 as uuidv4 } from "uuid";

class User {
  #_id;

  constructor(name, email) {
    this.#_id = uuidv4();
    this.name = name;
    this.email = email;
  }

  get _id() {
    return this.#_id;
  }

  toString() {
    return `User: ${this.name}, Email: ${this.email}, ID: ${this.#_id}`;
  }

  toJSON() {
    return {
      _id: this.#_id,
      name: this.name,
      email: this.email,
    };
  }
}

export default User;
