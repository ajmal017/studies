const fs = require('fs');
const chalk = require('chalk');

function addNote(title, body) {
  const notes = loadNotes();
  const duplicateNote = notes.some(note => note.title === title);

  debugger;

  if (!duplicateNote) {
    notes.push({
      title, // title: title
      body // body: body
    });
    console.log(chalk.black.bgGreenBright('New note added!'));
  } else {
    console.log(chalk.black.bgRedBright('Note title already taken!'));
  }
  saveNotes(notes);
}

function removeNote(title) {
  const notes = loadNotes();
  const notesToKeep = notes.filter(note => note.title !== title)
  if (notes.length === notesToKeep.length) {
    console.log(chalk.black.bgRedBright('No note found!'))
  } else {
    console.log(chalk.black.bgGreenBright('Note removed!'))
    saveNotes(notesToKeep);
  }
}

function saveNotes(notes) {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
}

function loadNotes() {
  try {
    const dataString = fs.readFileSync('notes.json', 'utf-8');
    return JSON.parse(dataString);
  } catch (e) {
    return [];
  }
}

function listNotes() {
  const notes = loadNotes();
  if (notes.length === 0) {
    console.log(chalk.redBright('No notes found!'));
  } else {
    console.log(chalk.bgGrey('Your notes...'));
    notes.forEach((note) => console.log(`${chalk.blueBright(note.title)}`))
  }
}

function readNote(title) {
  const notes = loadNotes();
  const matchNote = notes.find(note => note.title === title);
  if(matchNote !== undefined) {
    console.log(`${chalk.blueBright(matchNote.title)}: ${matchNote.body}`);
  } else {
    console.log(chalk.red('No note found!'));
  }
}

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote
}