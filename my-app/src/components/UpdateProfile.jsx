import React, { useState } from 'react';
import './Profile.css'; 

export const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    accountName: '',
    displayName: '',
    email: '',
    phone: '',
    birth: '',
    zipcode: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <section id="profile-container">
      <div className="profile-field">
        <label htmlFor="account-name">Account Name:</label>
        <div className="input-wrapper">
          <input type="text" id="account-name" name="accountName" value={formData.accountName} onChange={handleChange} disabled />
          <button className="edit-button disabled" data-target="account-name" disabled>&#10006;</button>
        </div>
        <small>Account name cannot be edited.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="display-name">Display Name:</label>
        <div className="input-wrapper">
          <input type="text" id="display-name" name="displayName" value={formData.displayName} onChange={handleChange} disabled />
          <button className="edit-button" data-target="display-name">&#10004;</button>
        </div>
        <small>Display name should not be empty.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="email">Email:</label>
        <div className="input-wrapper">
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled />
          <button className="edit-button" data-target="email">&#10004;</button>
        </div>
        <small>Enter a valid email address.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="phone">Phone:</label>
        <div className="input-wrapper">
          <input type="tel" id="phone" name="phone" pattern="^\d{3}-\d{3}-\d{4}$" value={formData.phone} onChange={handleChange} required disabled />
          <button className="edit-button" data-target="phone">&#10004;</button>
        </div>
        <small>Phone number format: XXX-XXX-XXXX.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="birth">Date of Birth:</label>
        <div className="input-wrapper">
          <input type="date" id="birth" name="birth" value={formData.birth} onChange={handleChange} disabled />
          <button className="edit-button disabled" data-target="birth" disabled>&#10006;</button>
        </div>
        <small>Date of Birth cannot be edited.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="zipcode">Zip Code:</label>
        <div className="input-wrapper">
          <input type="text" id="zipcode" name="zipcode" pattern="^\d{5}$" value={formData.zipcode} onChange={handleChange} required disabled />
          <button className="edit-button" data-target="zipcode">&#10004;</button>
        </div>
        <small>Zip code should be 5 digits.</small>
      </div>
      <div className="profile-field">
        <label htmlFor="password">Password:</label>
        <div className="input-wrapper">
          <input type="password" id="password" name="password" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" value={formData.password} onChange={handleChange} required disabled />
          <button className="edit-button" data-target="password">&#10004;</button>
        </div>
        <small>Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, and one number.</small>
      </div>
      <div className="profile-field" id="confirm-password-container" style={{ display: 'none' }}>
        <label htmlFor="confirm-password">Confirm Password:</label>
        <div className="input-wrapper">
          <input type="password" id="confirm-password" name="confirmPassword" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" value={formData.confirmPassword} onChange={handleChange} required disabled />
        </div>
        <small>Confirm password must match the new password.</small>
      </div>
      <button id="update-button">Update All</button>
    </section>
  );
};