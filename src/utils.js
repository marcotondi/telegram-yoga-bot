"use strict";
const dataService = require("./dataService");

function listName(name) {
  const names = dataService.getNameAsana();

  if (names.includes(name)) return shuffle(names);

  // Crea una copia dell'array originale
  const ret = [...names];
  ret[0] = name;

  return shuffle(ret);
}

// Funzione
function nameKeyboard(asanaId, name) {
  return `${asanaId}_${name}`;
}

// Funzione
function nameAsana(name) {
  return name.split("_")[1];
}

function uidAsana(name) {
  return name.split("_")[0];
}

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

module.exports = {
  listName,
  nameAsana,
  uidAsana,
  nameKeyboard,
};
