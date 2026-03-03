// server.js - REST API for music library
const express = require('express');
const { sequelize, Track } = require('./database/setup');

const app = express();
app.use(express.json());

// GET /api/tracks - return all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// GET /api/tracks/:id - return single track or 404
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

// POST /api/tracks - create new track
app.post('/api/tracks', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
  if (!songTitle || !artistName || !albumName || !genre) {
    return res.status(400).json({ error: 'Missing required field(s)' });
  }
  try {
    const newTrack = await Track.create({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.status(201).json(newTrack);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

// PUT /api/tracks/:id - update existing track
app.put('/api/tracks/:id', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });

    await track.update({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update track' });
  }
});

// DELETE /api/tracks/:id - remove track
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });

    await track.destroy();
    res.json({ message: 'Track deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete track' });
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  // ensure database is ready before accepting requests
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }

  console.log(`Server running on port ${port}`);
});