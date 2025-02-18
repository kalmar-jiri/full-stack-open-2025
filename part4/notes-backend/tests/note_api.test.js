const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const Note = require('../models/note');
const helper = require('./test_helper');
const api = supertest(app);

// // One possible way to insert new data to database
// // before each test
// beforeEach(async () => {
//   await Note.deleteMany({});
//   const noteObjects = helper.initialNotes.map(note => new Note(note));
//   const promiseArray = noteObjects.map(note => note.save());
//   // The Promise.all method can be used for transforming an array of promises into a single promise,
//   // that will be fulfilled once every promise in the array passed to it as an argument is resolved.
//   await Promise.all(promiseArray);
// });

// Another way
beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});

describe('first initialization of the database', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two notes', async () => {
    const response = await api.get('/api/notes');
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(e => e.content);
    assert(contents.includes('HTML is easy'));
  });
});

describe('viewing a specific note', () => {
  test('succeeds w/ a valid id', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(resultNote.body, noteToView);
  });

  test('fails w/ 404 if note does not exist', async () => {
    const id = await helper.nonExistingId();
    await api.get(`/api/notes/${id}`).expect(404);
  });
});

describe('addition of a new note', () => {
  test('succeeds w/ valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    assert(contents.includes(newNote.content));
  });

  test('fails w/ 400 with invalid data', async () => {
    const newNote = {
      important: true,
    };

    await api.post('/api/notes').send(newNote).expect(400);
    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
  });
});

describe('deletion of a note', () => {
  test('succeed if the id is valid', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = helper.notesInDb();
    const contents = (await notesAtEnd).map(r => r.content);
    assert(!contents.includes(noteToDelete.content));
    assert.strictEqual((await notesAtEnd).length, notesAtStart.length - 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
