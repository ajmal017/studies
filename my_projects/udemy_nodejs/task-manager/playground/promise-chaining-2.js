require('../src/db/mongoose.js');
const Task = require('../src/models/task.js');


Task.findByIdAndRemove('5e4f13bf56415b0610c1d93c')
  .then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

async function deleteTaskAndCount(id) {
  const task = await Task.findByIdAndRemove(id);
  const incompleteTasks = await Task.countDocuments({ completed: false });
  return incompleteTasks;
}

deleteTaskAndCount('5e4e15d6638b6520b869143a')
  .then((incompleteTasks) => {
    console.log(`number of incompleted tasks are : ${incompleteTasks}`);
  })
  .catch((err) => {
    console.log(err);
  });