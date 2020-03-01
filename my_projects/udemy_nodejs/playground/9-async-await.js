function add(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });
}

async function doWork() {
  const sum = add(1, 99);
  console.log(sum);
}

// doWork()
//   .then((result) => {
//     console.log(`Result ${result}`);
//   })
//   .catch((err) => {
//     console.log(`Err ${err}`);
//   });

doWork();