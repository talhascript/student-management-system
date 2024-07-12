const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./firebaseAdmin');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Create a new student
app.post('/app/api/students', async (req, res) => {
  try {
    const student = req.body;
    const docRef = await db.collection('students').add(student);
    res.status(201).json({ id: docRef.id, ...student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a student by NIC
app.get('/app/api/students/:nic', async (req, res) => {
  try {
    const nic = req.params.nic;
    const snapshot = await db.collection('students').where('nic', '==', nic).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const student = snapshot.docs[0].data();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a student by NIC
app.patch('/app/api/students/:nic', async (req, res) => {
  try {
    const nic = req.params.nic;
    const studentData = req.body;
    const snapshot = await db.collection('students').where('nic', '==', nic).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const docRef = snapshot.docs[0].ref;
    await docRef.update(studentData);
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a student by NIC
app.delete('/app/api/students/:nic', async (req, res) => {
  try {
    const nic = req.params.nic;
    const snapshot = await db.collection('students').where('nic', '==', nic).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const docRef = snapshot.docs[0].ref;
    await docRef.delete();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
