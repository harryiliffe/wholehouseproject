const path = require('path')
const fs = require('fs')

//DATABASE STUFF
const yaml = require('js-yaml');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('changelog.yml', {
  defaultValue: [],
  serialize: (array) => yaml.dump(array),
  deserialize: (string) => yaml.safeLoad(string)
})

const changelog = low(adapter);

module.exports = changelog;
