const moongose = require('mongoose');

const connectDB = async () => {
  return moongose.connect(
    'mongodb+srv://yagyamNode:954CoaSg1OylnzMV@namastenode.ei03qtr.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
