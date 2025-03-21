const createStudent = async (studentData) => {
  try {
    const response = await fetch('https://quiz-backend-9uar.onrender.com/api/student/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create student');
    }

    const data = await response.json();
    console.log('Student created successfully:', data);
  } catch (error) {
    console.error('Error creating student:', error);
  }
};

// Example usage
createStudent({
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Computer Science',
  college: 'XYZ University',
  year: '1st Year',
});