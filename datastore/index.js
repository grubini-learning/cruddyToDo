const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const dataDir = path.join(__dirname, 'data');
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

const writeFile = (id, text) => {
  console.log('writeFile ', id);
  fs.writeFile(`${dataDir}/${id}.txt`, text, (err) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      return true;
    }
  });
};
const readFile = (id, callback) => {
  fs.readFile(`${dataDir}/${id}.txt`, (err, data) => {
    callback(data.toString());
  });
};

const getFiles = (callback) => {
  const files = fs.readdirSync(`${dataDir}`, (err, files) => {
    return files;
  });
  const todos = [];
  files.forEach(file => {
    const todo = fs.readFileSync(`${dataDir}/${file}`, (err, data) => {
      if (err) { throw err; }
      todo.name = fileName;
      todo.text = data.toString();
    });
    todos.push({id: file.substring(0, file.length - 4), text: todo.toString()});
  });
  callback(todos);
};

exports.create = (text, callback) => {
  counter.getNextUniqueId((id) => {
    items[id] = text;
    //SAVE
    writeFile(id, text);
    callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  getFiles((todos) => {
    var data = _.map(todos, ({id, text}, index) => {
      return { id, text };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  readFile(id, (text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, msg, callback) => {
  readFile(id, (text) => {
    console.log(id, text);
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // text[id] = msg;
      writeFile(id, msg);
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log(`${dataDir}/${id} was deleted`);
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////


module.exports.dataDir = dataDir;
exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
