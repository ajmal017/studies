// const fs = require('fs');

// const book = {
//   title: 'Ego is the Enemy',
//   author: 'Ryan Holiday'
// }

// const bookJSON = JSON.stringify(book);
// fs.writeFileSync('json-1.json', bookJSON);

// const dataBuffer = fs.readFileSync('json-1.json');
// const dataJSON = dataBuffer.toString();
// const data = JSON.parse(dataJSON);
// console.log(data.title);

const fs = require('fs'); 

const jsonData = fs.readFileSync('json-1.json');
const parsedData = JSON.parse(jsonData);


parsedData.name = "Jason";
parsedData.age = 22;

const stringifiedData = JSON.stringify(parsedData);
fs.writeFileSync('json-1.json', stringifiedData);