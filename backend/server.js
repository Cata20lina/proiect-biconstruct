const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// --- UPLOAD FIȘIERE ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unic = `${Date.now()}_${Math.random().toString(36).slice(2)}_${Buffer.from(file.originalname, 'latin1').toString('utf8')}`;
    cb(null, unic);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per fișier
});

// Servire statică fișiere uploadate
app.use('/uploads', express.static(uploadsDir));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- CONECTARE DB ȘI MODELE ---
mongoose.connect('mongodb://localhost:27017/b2b_constructii')
  .then(async () => {
    console.log('✅ Conectat la MongoDB!');
    await populeazaDateGeografice();
  })
  .catch(err => console.error('❌ Eroare DB:', err));

const ProiectSchema = new mongoose.Schema({
  id: { type: Number, default: Date.now },
  titlu: String, dezvoltator: String, categorie: String,
  bugetMax: String, judet: String, oras: String,
  termenLimita: String, descriere: String,
  oferte: [{
    id: Number, firma: String, pret: String, zile: String, mesaj: String,
    status: { type: String, default: 'in_analiza' },
    fisiere: [{ nume: String, numeFisier: String, tip: String }]
  }]
});

const LocalitateSchema = new mongoose.Schema({ judet: { type: String, unique: true }, localitati: [String] });
const MesajSchema = new mongoose.Schema({ proiectId: Number, expeditor: String, text: String, timestamp: { type: Date, default: Date.now } });

const Proiect = mongoose.model('Proiect', ProiectSchema);
const Localitate = mongoose.model('Localitate', LocalitateSchema);
const Mesaj = mongoose.model('Mesaj', MesajSchema);

// --- FUNCȚIE POPULARE ---
async function populeazaDateGeografice() {
  const filePath = path.join(__dirname, 'localitati.json');
  if (!fs.existsSync(filePath)) {
    console.error('❌ EROARE: Nu găsesc fișierul localitati.json');
    return;
  }
  const date = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const item of date) {
    await Localitate.updateOne({ judet: item.judet }, { $set: { localitati: item.localitati } }, { upsert: true });
  }
  console.log('✅ Datele geografice sunt actualizate în DB.');
}

// --- RUTE API ---
app.get('/api/proiecte', async (req, res) => {
  const p = await Proiect.find().sort({ id: -1 });
  res.json(p);
});

app.get('/api/geografie', async (req, res) => {
  try {
    const data = await Localitate.find().sort({ judet: 1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/proiecte', async (req, res) => {
  try {
    const nou = new Proiect({ ...req.body, id: Date.now() });
    await nou.save();
    res.status(201).json(nou);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/proiecte/:id/oferte', upload.array('fisiere', 10), async (req, res) => {
  try {
    const p = await Proiect.findOne({ id: Number(req.params.id) });
    if (!p) return res.status(404).json({ error: 'Proiect negăsit' });

    const { pret, zile, mesaj, firma } = req.body;
    const fisiere = (req.files || []).map(f => ({
      nume: Buffer.from(f.originalname, 'latin1').toString('utf8'),
      numeFisier: f.filename,
      tip: f.mimetype,
    }));

    p.oferte.push({ id: Date.now(), firma, pret, zile, mesaj, fisiere });
    await p.save();
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Acceptă o ofertă și respinge automat restul
app.patch('/api/proiecte/:id/oferte/:indexOferta/accepta', async (req, res) => {
  try {
    const p = await Proiect.findOne({ id: Number(req.params.id) });
    if (!p) return res.status(404).json({ error: 'Proiect negăsit' });
    const idx = Number(req.params.indexOferta);
    p.oferte.forEach((o, i) => {
      o.status = i === idx ? 'acceptata' : 'respinsa';
    });
    p.markModified('oferte');
    await p.save();
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Respinge o ofertă
app.patch('/api/proiecte/:id/oferte/:indexOferta/refuza', async (req, res) => {
  try {
    const p = await Proiect.findOne({ id: Number(req.params.id) });
    if (!p) return res.status(404).json({ error: 'Proiect negăsit' });
    const idx = Number(req.params.indexOferta);
    if (!p.oferte[idx]) return res.status(404).json({ error: 'Ofertă negăsită' });
    p.oferte[idx].status = 'respinsa';
    p.markModified('oferte');
    await p.save();
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/chat', async (req, res) => {
  const m = await Mesaj.find().sort({ timestamp: 1 });
  res.json(m);
});

app.post('/api/chat', async (req, res) => {
  try {
    const m = new Mesaj(req.body);
    await m.save();
    res.status(201).json(m);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- SOCKET.IO ---
io.on('connection', (socket) => {
  socket.on('join_project', (id) => socket.join(id));
  socket.on('send_message', (data) => io.to(data.proiectId).emit('receive_message', data));
});



server.listen(5000, () => console.log('🚀 Serverul rulează pe http://localhost:5000'));