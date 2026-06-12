const mongoose = require('mongoose');

// Definim schema cu 'userSchema' (u mic)
const userSchema = new mongoose.Schema({
  nume: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  parola: { type: String, required: true },
  rol: { type: String, required: true },
  telefon: { type: String, required: true },
  cui: { type: String, required: true },
  judet: { type: String, required: true }, // Câmpul adăugat pentru filtrarea pe orașe
  isActivated: { type: Boolean, default: true } 
});

// REPARAT: Exportăm folosind exact același nume 'userSchema'
module.exports = mongoose.model('User', userSchema);