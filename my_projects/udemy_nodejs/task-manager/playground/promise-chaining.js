require('../src/db/mongoose.js');
const User = require('../src/models/user.js');

// User.findByIdAndUpdate('5e4faeadd3a2cc4a349ae20f', { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

async function updateAgeAndCount(id, age) {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
}

updateAgeAndCount('5e4faeadd3a2cc4a349ae20f', 2)
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });