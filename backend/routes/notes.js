const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// Get all notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new note
router.post('/', auth, async (req, res) => {
  try {
    const { note } = req.body;
    const newNote = new Note({ note });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const { note } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { note },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

