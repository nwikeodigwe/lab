const mongoose = require("mongoose");

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  save() {
    // Logic to save user to the database
  }

  static findById(id) {
    // Logic to find user by ID
  }
}

module.exports = User;
