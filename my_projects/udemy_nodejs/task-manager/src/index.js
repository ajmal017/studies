const express = require('express');
require('./db/mongoose.js'); // to ensure whether the 'mongoose.js' file runs
const userRouter = require('./routes/user.js');
const taskRouter = require('./routes/task.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // going to automatically parse incoming JSON to an object
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const pet = {
  name: 'Hal',
}

pet.prototype.toJSON = function () {
  return 'hello';
}

console.log(JSON.stringify(pet));