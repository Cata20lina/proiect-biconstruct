const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'cheia_ta_secreta_si_foarte_lunga_12345';

// Configurare Nodemailer (Pentru testare rapidă folosim un cont fictiv generat automat)
// În producție, aici vei pune datele de la Gmail-ul tău sau SMTP-ul firmei
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 5858,
  auth: {
    user: 'margarita.cruickshank71@ethereal.email', // Înlocuiește cu date reale la final
    pass: 'fXb8WCSDscXbT7777y'
  }
});

// 1. RUTA DE ÎNREGISTRARE COMPLEXĂ
router.post('/register', async (req, res) => {
  try {
    const { nume, email, parola, rol, telefon, cui, judet } = req.body;

    let userExistent = await User.findOne({ email });
    if (userExistent) return res.status(400).json({ msg: 'Acest email este deja utilizat.' });

    // Generăm un token unic pentru link-ul din email
    const tokenVerificare = crypto.randomBytes(20).toString('hex');

    const noulUser = new User({
      nume, email, parola, rol, telefon, cui, judet,
      verificationToken: tokenVerificare,
      isVerified: false // Rămâne blocat până dă click pe link
    });

    const salt = await bcrypt.genSalt(10);
    noulUser.parola = await bcrypt.hash(parola, salt);
    await noulUser.save();

    // Trimitem email-ul de confirmare
    const urlVerificare = `http://localhost:5000/api/auth/verify/${tokenVerificare}`;
    
    const mailOptions = {
      from: '"ConstructBid" <noreply@constructbid.ro>',
      to: email,
      subject: 'Confirmare Cont ConstructBid',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Bun venit pe ConstructBid, ${nume}!</h2>
          <p>Te-ai înregistrat cu succes ca <strong>${rol}</strong>.</p>
          <p>Pentru a-ți activa contul și a avea acces la platformă, dă click pe butonul de mai jos:</p>
          <a href="${urlVerificare}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Activează Contul</a>
          <br/><br/>
          <p>Dacă butonul nu funcționează, copiază acest link în browser: ${urlVerificare}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ msg: 'Cont creat! Verifică e-mailul pentru activare.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. RUTA DE VERIFICARE EMAIL (Apasă utilizatorul pe link)
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('<h3>Link de verificare invalid sau expirat.</h3>');

    user.isVerified = true;
    user.verificationToken = undefined; // Ștergem token-ul pentru că a fost folosit
    await user.save();

    // Redirecționăm utilizatorul către pagina de login din frontend cu un mesaj frumos
    res.send('<h3>Cont activat cu succes! Te poți întoarce în aplicație să te conectezi.</h3>');
  } catch (err) {
    res.status(500).send('Eroare la activare.');
  }
});

// 3. RUTA DE LOGIN (Modificată ca să verifice dacă e-mailul este confirmat)
router.post('/login', async (req, res) => {
  try {
    const { email, parola } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Date incorecte.' });

    // Verificăm dacă a confirmat e-mailul
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Contul nu este activat. Verifică-ți adresa de email!' });
    }

    const esteCorecta = await bcrypt.compare(parola, user.parola);
    if (!esteCorecta) return res.status(400).json({ msg: 'Date incorecte.' });

    const payload = { userId: user._id, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
    const token = jwt.encode(payload, JWT_SECRET);

    res.json({
      token,
      user: { id: user._id, nume: user.nume, email: user.email, rol: user.rol }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;