import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentEntry.css' // Make sure to import your CSS

export default function StudentEntry() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    college: '',
    year: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${apiUrl}/api/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          // ... other student data
        }),
      });
      
      if (response.ok) {
        const data = await response.json()
        // store student ID in localStorage or context to track them
        localStorage.setItem('studentId', data.id)
        localStorage.setItem('studentEntry', JSON.stringify(formData)) // Store details
        navigate('/instructions')
      } else {
        console.log('Error creating student')
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="student-entry-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>Code Debugging</h1>
        {/* Replace the src with your own image or illustration */}
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a40ec2efcca9415fd356de77acd9ce1778e08d45613e8ad1a8a4ab9be110e201?placeholderIfAbsent=true&apiKey=30fa825763e947d5bf1994fb75e7e9e2"
          alt="Code Debugging Illustration" 
          className="illustration"
        />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>Student Details</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />
          <input
            type="text"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleChange}
          />
          <select name="year" value={formData.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  )
}