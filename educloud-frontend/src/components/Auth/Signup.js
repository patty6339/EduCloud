import React, { useState } from 'react';
import { signup } from '../../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      if (response.success) {
        alert('Signup successful! Please login.');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
