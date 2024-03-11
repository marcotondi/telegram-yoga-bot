"use strict";

const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(process.env.STORAGE_DIR || __dirname, "data.json");

// Funzione per registrare un nuovo utente
function registerUser(msg) {
  // Leggi il file JSON
  let data = readData();

  // Crea un nuovo oggetto utente
  const user = {
    uid: msg.chat.id,
    chat_id: msg.chat.id,
    username: msg.from.username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
  };

  // Aggiungi l'utente all'array di utenti
  data.users.push(user);

  // Scrivi il file JSON aggiornato
  writeData(data);
}

// Funzione per ottenere un utente in base al suo ID
function getUser(uid) {
  // Leggi il file JSON
  const data = readData();

  // Trova l'utente con l'ID specificato
  const user = data.users.find((u) => u.uid === uid);

  return user;
}

// Funzione per ottenere l'elenco di tutti gli utenti
function getUserList() {
  // Leggi il file JSON
  const data = readData();

  // Restituisci l'array di utenti
  return data.users;
}

function registerAsana(msg) {
  // Leggi il file JSON
  let data = readData();

  // Crea un nuovo oggetto utente
  const asana = {
    asanaId: msg.shortUid,
    fileId: msg.fileId,
    name: msg.name,
    count: 0,
  };

  // Aggiungi l'utente all'array delle asana
  data.asanas.push(asana);

  // Scrivi il file JSON aggiornato
  writeData(data);
}

// Funzione per ottenere un utente in base al suo ID
function getAsana(fid) {
  // Leggi il file JSON
  const data = readData();

  // Trova l'utente con l'ID specificato
  const asana = data.asanas.find((a) => a.asanaId === fid);

  return asana;
}

// Funzione per ottenere un asana sort for frequency
function getFrequencyAsana() {
  // Leggi il file JSON
  const data = readData();

  // Ordina l'array in base alla frequenza
  data.asanas.sort((a, b) => a.frequency - b.frequency);

  // Genera un indice casuale tra 0 e la lunghezza dell'array meno 1
  const randomIndex = Math.floor(Math.random() * 25);

  putFrequencyAsana(data, randomIndex);

  // Restituisce l'elemento all'indice casuale
  return data.asanas[randomIndex];
}

// Funzione per ottenere un asana random
function getRandomAsana() {
  // Leggi il file JSON
  const data = readData();

  // Genera un indice casuale tra 0 e la lunghezza dell'array meno 1
  const randomIndex = Math.floor(Math.random() * data.asanas.length);

  putFrequencyAsana(data, randomIndex);

  // Restituisce l'elemento all'indice casuale
  return data.asanas[randomIndex];
}

// Funzione interna per ottenere un asana random. Non aggiorna la frequenza
// TODO: come astrarre al meglio il codice?
function randomAsana() {
  // Leggi il file JSON
  const data = readData();

  // Genera un indice casuale tra 0 e la lunghezza dell'array meno 1
  const randomIndex = Math.floor(Math.random() * data.asanas.length);

  // Restituisce l'elemento all'indice casuale
  return data.asanas[randomIndex];
}

// Funzione per ottenere un asana sort for frequency
function putFrequencyAsana(data, index) {

  data.asanas[index].frequency = "frequency" in data.asanas[index] ? data.asanas[index].frequency + 1 : 1;

  writeData(data);

  return
}

function getNameAsana() {
  const names = [];

  for (let i = 0; i < 4; i++) {
    let asana = randomAsana();
    names.push(asana["name"]);
  }

  // Restituisce l'array di oggetti filtrati
  return names;
}

// Funzione per leggere il file JSON
function readData() {
  let data;

  try {
    // Prova a leggere il file
    data = JSON.parse(fs.readFileSync(dataFilePath));
  } catch (err) {
    // Se il file non esiste, crea un nuovo oggetto vuoto
    data = {
      users: [],
      asanas: [],
      quiz: [],
    };
  }

  return data;
}

// Funzione per scrivere il file JSON
function writeData(data) {
  // Scrivi il file JSON
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
  registerUser,
  getUser,
  getUserList,
  registerAsana,
  getAsana,
  getRandomAsana,
  getFrequencyAsana,
  getNameAsana,
};
