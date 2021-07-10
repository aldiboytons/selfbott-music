const Discord = require("discord.js-selfbot");
const client = new Discord.Client();
const fs = require('fs');
const Enmap = require('enmap');
const config = require(`./config`)
const utils = require('./utils')
client.login(config.token)

utils.log("Logging in...");

/* ----------------------------------------------- */

global.queue = new Map();
client.commands = new Enmap();

/* ----------------------------------------------- */

var loaded = {events: [], commands: []};

var promise = new Promise((resolve) => {
  fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      const evt = require(`./events/${file}`);
      let evtName = file.split('.')[0];
      loaded.events.push(evtName)
      client.on(evtName, evt.bind(null, client));
    });
    resolve();
  });
});


fs.readdir('./commands/', async (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    props.names.list.forEach(name => {
      client.commands.set(name, props);
    })
    let cmdName = file.split('.')[0];
    loaded.commands.push(cmdName)
  });
  promise.then(() => {utils.log(`Table of commands and events :\n${utils.showTable(loaded)}`)});
});


/* ----------------------------------------------- */