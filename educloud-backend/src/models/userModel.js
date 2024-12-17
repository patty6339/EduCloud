const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create({ email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    return result.rows[0];
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
