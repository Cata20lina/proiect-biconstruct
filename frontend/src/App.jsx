import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import SantiereView from './pages/SantiereView.jsx';
import ProiectDetailView from './pages/ProiectDetailView.jsx';
import ChatView from './pages/ChatView.jsx';
import IndexView from './pages/IndexView.jsx';
import AdaugaAnuntView from './pages/AdaugaAnuntView.jsx';
import NotificariView from './pages/NotificariView.jsx';
import OfertaDetailView from './pages/OfertaDetailView.jsx';
import ServiciiSubcontractorView from './pages/ServiciiSubcontractorView.jsx';
import {
  TrendingUp, AlertTriangle, Briefcase, Send,
  CheckCircle2, FolderKanban, MessageSquare
} from 'lucide-react';

const teme = {
  dark: {
    bgCrap: '#090e1a',
    bgCard: '#111827',
    bgInput: '#1f2937',
    textPrincipal: '#f9fafb',
    textSecundar: '#9ca3af',
    border: 'rgba(255,255,255,0.05)',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
  },
  light: {
    bgCrap: '#f3f4f6',
    bgCard: '#ffffff',
    bgInput: '#f9fafb',
    textPrincipal: '#111827',
    textSecundar: '#6b7280',
    border: 'rgba(0,0,0,0.08)',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};

const API_URL = 'https://proiect-biconstruct.onrender.com';

export default function App() {
  const [user, setUser] = useState({
    nume: "Construct SRL",
    rol: "DEZVOLTATOR",
    email: "contact@construct.ro",
    cui: "RO1234567",
    judet: "București"
  });
  const [activeTab, setActiveTab] = useState('index');
  const [proiectSelectat, setProiectSelectat] = useState(null);
  const [modTema, setModTema] = useState('dark');
  const [proiecte, setProiecte] = useState([]);
  const [chatMesaje, setChatMesaje] = useState([]);
  const [nouMesaj, setNouMesaj] = useState('');
  const [proiectChatActivId, setProiectChatActivId] = useState(null);
  const [dateGeograficeServer, setDateGeograficeServer] = useState([]);
  const [notificari, setNotificari] = useState([]);
  const [ofertaSelectata, setOfertaSelectata] = useState(null);
  // Ref pentru a ține evidența ofertelor/mesajelor deja notificate
  const notificariVazuteRef = useRef({ oferte: new Set(), mesaje: new Set() });

  // Stări pentru feedback UI
  const [loadingAnunt, setLoadingAnunt] = useState(false);
  const [errorAnunt, setErrorAnunt] = useState('');
  const [successAnunt, setSuccessAnunt] = useState(false);

  const [loadingOferta, setLoadingOferta] = useState(false);
  const [errorOferta, setErrorOferta] = useState('');

  const [loadingMesaj, setLoadingMesaj] = useState(false);
  const [errorMesaj, setErrorMesaj] = useState('');

  const chatPollingRef = useRef(null);

  const [formAnunt, setFormAnunt] = useState({
    titlu: '',
    categorie: 'Structuri',
    bugetMax: '',
    judet: '',
    oras: '',
    termenLimita: '',
    descriere: ''
  });

  const t = teme[modTema];

  // ── Încărcare inițială ──
  useEffect(() => {
    fetch(`${API_URL}/proiecte`)
      .then(res => res.json())
      .then(data => setProiecte(data))
      .catch(err => console.error("Eroare proiecte:", err));

    fetch(`${API_URL}/chat`)
      .then(res => res.json())
      .then(data => setChatMesaje(data))
      .catch(err => console.error("Eroare chat:", err));

    fetch(`${API_URL}/geografie`)
      .then(res => res.json())
      .then(data => setDateGeograficeServer(data))
      .catch(err => console.error("Eroare geografie:", err));
  }, []);

  // ── Generează notificări din oferte noi primite (doar pentru DEZVOLTATOR) ──
  useEffect(() => {
    if (!proiecte.length || !user) return;
    const vazute = notificariVazuteRef.current.oferte;
    const nouaLista = [];

    proiecte
      .filter(p => p.dezvoltator === user.nume)
      .forEach(p => {
        (p.oferte || []).forEach(o => {
          const key = `${p.id}_${o.firma}_${o.pret}`;
          if (!vazute.has(key)) {
            vazute.add(key);
            nouaLista.push({
              id: `oferta_${key}_${Date.now()}`,
              tip: 'oferta',
              text: `Ai primit o ofertă de ${Number(o.pret).toLocaleString()} RON de la "${o.firma}"`,
              subtitlu: `Proiect: ${p.titlu} • Durată: ${o.zile} zile`,
              citit: false,
              data: new Date().toISOString(),
              proiectId: p.id,
            });
          }
        });
      });

    if (nouaLista.length > 0) {
      setNotificari(prev => [...nouaLista, ...prev]);
    }
  }, [proiecte, user]);

  // ── Generează notificări din mesaje noi în chat ──
  useEffect(() => {
    if (!chatMesaje.length || !user) return;
    const vazute = notificariVazuteRef.current.mesaje;
    const nouaLista = [];

    chatMesaje.forEach(m => {
      // Doar mesajele de la alții
      if (m.expeditor === user.nume) return;
      const key = m._id || `${m.proiectId}_${m.expeditor}_${m.text}`;
      if (!vazute.has(key)) {
        vazute.add(key);
        const proiect = proiecte.find(p => p.id === m.proiectId || p.id === Number(m.proiectId));
        nouaLista.push({
          id: `chat_${key}_${Date.now()}`,
          tip: 'chat',
          text: `Mesaj nou de la "${m.expeditor}"`,
          subtitlu: proiect ? `Proiect: ${proiect.titlu}` : `Proiect #${m.proiectId}`,
          citit: false,
          data: m.createdAt || new Date().toISOString(),
          proiectId: m.proiectId,
        });
      }
    });

    if (nouaLista.length > 0) {
      setNotificari(prev => [...nouaLista, ...prev]);
    }
  }, [chatMesaje, user, proiecte]);

  // ── Polling chat la fiecare 3s când tab-ul chat e activ ──
  useEffect(() => {
    if (activeTab === 'chat') {
      const poll = () => {
        fetch(`${API_URL}/chat`)
          .then(res => res.json())
          .then(data => setChatMesaje(data))
          .catch(() => {});
      };
      chatPollingRef.current = setInterval(poll, 3000);
    }
    return () => {
      if (chatPollingRef.current) clearInterval(chatPollingRef.current);
    };
  }, [activeTab]);

// Ne asigurăm că datele sunt disponibile înainte de a face find
const obiectJudetCurent = Array.isArray(dateGeograficeServer) 
  ? dateGeograficeServer.find(g => g.judet === formAnunt.judet) 
  : null;

const localitatiDeAfisat = obiectJudetCurent?.localitati || [];

  const toggleTema = () => {
    const nouMod = modTema === 'dark' ? 'light' : 'dark';
    setModTema(nouMod);
    localStorage.setItem('themeMode', nouMod);
  };

  const schimbaRolUtilizator = (noulRol) => {
    const utilizatorActualizat = { ...user, rol: noulRol };
    setUser(utilizatorActualizat);
    localStorage.setItem('user', JSON.stringify(utilizatorActualizat));
  };

  // ── Adaugă anunț nou ──
  const adaugaAnuntNou = async (e) => {
    e.preventDefault();
    setLoadingAnunt(true);
    setErrorAnunt('');
    setSuccessAnunt(false);

    const nouProiect = {
      titlu: formAnunt.titlu,
      categorie: formAnunt.categorie,
      bugetMax: formAnunt.bugetMax,
      judet: formAnunt.judet,
      oras: formAnunt.oras,
      termenLimita: formAnunt.termenLimita,
      descriere: formAnunt.descriere,
      dezvoltator: user?.nume || "Compania Ta",
      oferte: []
    };

    try {
      const response = await fetch(`${API_URL}/proiecte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouProiect)
      });

      if (!response.ok) throw new Error(`Eroare server: ${response.status}`);
      const proiectSalvat = await response.json();

      setProiecte(prev => [proiectSalvat, ...prev]);
      setFormAnunt({ titlu: '', categorie: 'Structuri', bugetMax: '', judet: '', oras: '', termenLimita: '', descriere: '' });
      setSuccessAnunt(true);

      // Redirecționează după 1.2s
      setTimeout(() => {
        setSuccessAnunt(false);
        setActiveTab('santiere');
        setProiectSelectat(null);
      }, 1200);
    } catch (error) {
      setErrorAnunt('Nu s-a putut salva anunțul. Verifică conexiunea cu serverul.');
      console.error(error);
    } finally {
      setLoadingAnunt(false);
    }
  };

  // ── Adaugă ofertă la proiect ──
  const adaugaOfertaLaProiect = async (proiectId, ofertaData) => {
    setLoadingOferta(true);
    setErrorOferta('');

    // ofertaData poate fi FormData (cu fișiere) sau obiect simplu
    let body, headers;
    if (ofertaData instanceof FormData) {
      ofertaData.append('firma', user?.nume || 'Subcontractor Anonim');
      body = ofertaData;
      headers = {}; // browser setează automat Content-Type cu boundary
    } else {
      body = JSON.stringify({ ...ofertaData, firma: user?.nume || 'Subcontractor Anonim' });
      headers = { 'Content-Type': 'application/json' };
    }

    try {
      const response = await fetch(`${API_URL}/proiecte/${proiectId}/oferte`, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) throw new Error('Eroare la trimiterea ofertei');
      const proiectActualizat = await response.json();

      setProiecte(prev => prev.map(p => String(p.id) === String(proiectId) ? proiectActualizat : p));

      if (proiectSelectat && String(proiectSelectat.id) === String(proiectId)) {
        setProiectSelectat(proiectActualizat);
      }
    } catch (error) {
      setErrorOferta('Nu s-a putut trimite oferta.');
      console.error(error);
    } finally {
      setLoadingOferta(false);
    }
  };

  const acceptaOferta = async (proiectId, indexOferta) => {
  try {
    const response = await fetch(`${API_URL}/proiecte/${proiectId}/oferte/${indexOferta}/accepta`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Eroare server');
    const proiectActualizat = await response.json();
    setProiecte(prev => prev.map(p => String(p.id) === String(proiectId) ? proiectActualizat : p));
    if (proiectSelectat && String(proiectSelectat.id) === String(proiectId)) {
      setProiectSelectat(proiectActualizat);
      // Actualizează și oferta selectată cu noul status
      const ofertaActualizata = proiectActualizat.oferte?.[indexOferta];
      if (ofertaActualizata) {
        setOfertaSelectata({ oferta: ofertaActualizata, indexOferta, proiect: proiectActualizat });
      }
    }
  } catch (err) {
    console.error('Eroare acceptare ofertă:', err);
  }
};

// Respinge o ofertă
const refuzaOferta = async (proiectId, indexOferta) => {
  try {
    const response = await fetch(`${API_URL}/proiecte/${proiectId}/oferte/${indexOferta}/refuza`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Eroare server');
    const proiectActualizat = await response.json();
    setProiecte(prev => prev.map(p => String(p.id) === String(proiectId) ? proiectActualizat : p));
    if (proiectSelectat && String(proiectSelectat.id) === String(proiectId)) {
      setProiectSelectat(proiectActualizat);
      const ofertaActualizata = proiectActualizat.oferte?.[indexOferta];
      if (ofertaActualizata) {
        setOfertaSelectata({ oferta: ofertaActualizata, indexOferta, proiect: proiectActualizat });
      }
    }
  } catch (err) {
    console.error('Eroare refuzare ofertă:', err);
  }
};


  // ── Trimite mesaj chat ──
  const trimiteMesajChat = async (e) => {
    e.preventDefault();
    if (!nouMesaj.trim()) return;

    const idProiectActiv = proiectChatActivId ?? proiecte[0]?.id;
    if (!idProiectActiv) {
      setErrorMesaj('Selectează un proiect din lista din stânga.');
      return;
    }

    setLoadingMesaj(true);
    setErrorMesaj('');

    const mesajPayload = {
      proiectId: Number(idProiectActiv),
      expeditor: user?.nume || 'Utilizator',
      text: nouMesaj.trim()
    };

    // Optimistic update — mesajul apare imediat
    const mesajOptimist = { ...mesajPayload, _id: `optimist_${Date.now()}`, createdAt: new Date().toISOString() };
    setChatMesaje(prev => [...prev, mesajOptimist]);
    setNouMesaj('');

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mesajPayload)
      });

      if (!response.ok) throw new Error('Eroare server');
      const mesajSalvat = await response.json();

      // Înlocuiește mesajul optimist cu cel real
      setChatMesaje(prev => prev.map(m => m._id === mesajOptimist._id ? mesajSalvat : m));
    } catch (error) {
      // Elimină mesajul optimist dacă a eșuat
      setChatMesaje(prev => prev.filter(m => m._id !== mesajOptimist._id));
      setErrorMesaj('Mesajul nu a putut fi trimis. Încearcă din nou.');
      setNouMesaj(mesajPayload.text);
      console.error(error);
    } finally {
      setLoadingMesaj(false);
    }
  };

  const esteSubcontractor = user?.rol === 'SUBCONTRACTOR';
  const toateOferteleMele = proiecte.flatMap(p => (p.oferte || []).filter(o => o.firma === user?.nume));
  const totalLicitatValoare = toateOferteleMele.reduce((acc, o) => acc + Number(o.pret), 0);

  const statistici = esteSubcontractor
    ? [
        { titlu: "Oferte Depuse", valoare: toateOferteleMele.length.toString(), icon: <Send color="#3b82f6" />, bg: "rgba(59,130,246,0.06)" },
        { titlu: "Licitații Active", valoare: proiecte.length.toString(), icon: <CheckCircle2 color="#10b981" />, bg: "rgba(16,185,129,0.06)" },
        { titlu: "Valoare Ofertată", valoare: `${totalLicitatValoare.toLocaleString()} RON`, icon: <TrendingUp color="#eab308" />, bg: "rgba(234,179,8,0.06)" },
        { titlu: "Canale Chat", valoare: "1", icon: <MessageSquare color="#a855f7" />, bg: "rgba(168,85,247,0.06)" },
      ]
    : [
        { titlu: "Anunțuri Publicate", valoare: proiecte.filter(p => p.dezvoltator === user?.nume).length.toString(), icon: <Briefcase color="#3b82f6" />, bg: "rgba(59,130,246,0.06)" },
        { titlu: "Total Oferte Primite", valoare: proiecte.reduce((acc, p) => acc + (p.oferte || []).length, 0).toString(), icon: <FolderKanban color="#10b981" />, bg: "rgba(16,185,129,0.06)" },
        { titlu: "Piață Globală", valoare: proiecte.length.toString(), icon: <TrendingUp color="#eab308" />, bg: "rgba(234,179,8,0.06)" },
        { titlu: "Notificări Urgente", valoare: "0", icon: <AlertTriangle color="#ef4444" />, bg: "rgba(239,68,68,0.06)" },
      ];

  const chatMesejeGrupate = chatMesaje.reduce((acc, msg) => {
    if (!acc[msg.proiectId]) acc[msg.proiectId] = [];
    acc[msg.proiectId].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  backgroundColor: t.bgCrap, 
  minHeight: '100vh', 
  fontFamily: '"Plus Jakarta Sans", sans-serif', 
  color: t.textPrincipal, 
  transition: 'all 0.25s ease',
  margin: 0,    // ← adaugă asta
  padding: 0    // ← și asta
}}>

      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'santiere') {
            setProiectSelectat(null);
            setOfertaSelectata(null);
          }
        }}
        user={user}
        onLogout={() => setUser(null)}
        modTema={modTema}
        onToggleTema={toggleTema}
        t={t}
        esteSubcontractor={esteSubcontractor}
        nrNotificariNecitite={notificari.filter(n => !n.citit).length}
      />

      <main style={{ width: '100%', maxWidth: '2000px', margin: '0 auto', padding: '40px 24px', lateraleboxSizing: 'border-box', flex: 1 }}>

        {activeTab === 'santiere' && (
          ofertaSelectata ? (
            <OfertaDetailView
              oferta={ofertaSelectata.oferta}
              indexOferta={ofertaSelectata.indexOferta}
              proiect={ofertaSelectata.proiect}
              t={t}
              onBack={() => setOfertaSelectata(null)}
              onAccepta={acceptaOferta}
              onRefuza={refuzaOferta}
              deschideChat={() => setActiveTab('chat')}
              dezvoltator={user}
            />
          ) : proiectSelectat ? (
            <ProiectDetailView
              proiect={proiectSelectat}
              onBack={() => setProiectSelectat(null)}
              t={t}
              user={user}
              deschideChat={() => setActiveTab('chat')}
              onAdaugaOferta={(oferta) => adaugaOfertaLaProiect(proiectSelectat.id, oferta)}
              loadingOferta={loadingOferta}
              errorOferta={errorOferta}
              onSelectOferta={(oferta, idx, proiect) =>
                setOfertaSelectata({ oferta, indexOferta: idx, proiect })
              }
            />
          ) : (
            <SantiereView t={t} proiecte={proiecte} onSelect={(p) => setProiectSelectat(p)} />
          )
        )}

        {activeTab === 'index' && (
          <IndexView t={teme[modTema]} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'notificari' && (
          <NotificariView
            t={t}
            notificari={notificari}
            setNotificari={setNotificari}
            setActiveTab={setActiveTab}
            setProiectChatActivId={setProiectChatActivId}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            t={t}
            modTema={modTema}
            user={user}
            proiecte={proiecte}
            proiectChatActivId={proiectChatActivId}
            setProiectChatActivId={setProiectChatActivId}
            chatMesejeGrupate={chatMesejeGrupate}
            nouMesaj={nouMesaj}
            setNouMesaj={setNouMesaj}
            trimiteMesajChat={trimiteMesajChat}
            loadingMesaj={loadingMesaj}
            errorMesaj={errorMesaj}
          />
        )}

        {activeTab === 'adauga_anunt' && (
          <AdaugaAnuntView
            t={t}
            formAnunt={formAnunt}
            setFormAnunt={setFormAnunt}
            adaugaAnuntNou={adaugaAnuntNou}
            dateGeograficeServer={dateGeograficeServer}
            localitatiDeAfisat={localitatiDeAfisat}
            loading={loadingAnunt}
            error={errorAnunt}
            success={successAnunt}
          />
        )}

        {activeTab === 'servicii' && (
          <ServiciiSubcontractorView t={t} user={user} />
        )}

        {activeTab === 'profil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: t.bgCard, padding: '32px', borderRadius: '16px', border: `1px solid ${t.border}`, boxShadow: `0 4px 20px ${t.shadow}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '32px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => schimbaRolUtilizator(esteSubcontractor ? 'DEZVOLTATOR' : 'SUBCONTRACTOR')}
                  style={{ border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '800', backgroundColor: esteSubcontractor ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)', color: esteSubcontractor ? '#3b82f6' : '#a855f7', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}
                >
                  ROL: {user?.rol} (Schimbă)
                </button>
                <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px' }}>VERIFICAT ✓</span>
              </div>

              <div style={{ textAlign: 'left', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '850', color: t.textPrincipal, margin: 0 }}>Profil Oficial {esteSubcontractor ? 'Subcontractor' : 'Dezvoltator'}</h2>
                <p style={{ color: t.textSecundar, margin: '4px 0 0 0', fontSize: '13px' }}>Identitatea fiscală securizată a entității juridice.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left' }}>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textSecundar, marginBottom: '4px' }}>COMPANIE</span><div style={{ color: t.textPrincipal, fontWeight: '700' }}>{user?.nume}</div></div>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textSecundar, marginBottom: '4px' }}>CUI</span><div style={{ color: t.textPrincipal, fontWeight: '700' }}>{user?.cui || 'RO3421590'}</div></div>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textSecundar, marginBottom: '4px' }}>EMAIL</span><div style={{ color: t.textPrincipal, fontWeight: '700' }}>{user?.email}</div></div>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textSecundar, marginBottom: '4px' }}>JUDEȚ REGISTRU</span><div style={{ color: t.textPrincipal, fontWeight: '700', textTransform: 'uppercase' }}>{user?.judet || 'București'}</div></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Activitate Monitorizată</span>
                <h1 style={{ fontSize: '30px', fontWeight: '850', margin: '4px 0 6px 0', color: t.textPrincipal }}>Panou Central de Control</h1>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                {statistici.map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: t.bgCard, padding: '24px', borderRadius: '16px', border: `1px solid ${t.border}`, boxShadow: `0 4px 20px ${t.shadow}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', color: t.textSecundar, fontWeight: '600' }}>{stat.titlu}</span>
                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: stat.bg }}>{stat.icon}</div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: '850', color: t.textPrincipal, textAlign: 'left' }}>{stat.valoare}</div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: t.bgCard, padding: '32px', borderRadius: '16px', border: `1px solid ${t.border}`, textAlign: 'left', boxShadow: `0 4px 20px ${t.shadow}` }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800' }}>
                  {esteSubcontractor ? "Centralizator Oferte Trimise de Tine" : "Oferte Primite la Anunțurile Tale"}
                </h3>

                {esteSubcontractor ? (
                  toateOferteleMele.length === 0 ? (
                    <p style={{ color: t.textSecundar, fontSize: '13px', margin: 0 }}>Nu ai trimis nicio ofertă financiară momentan.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {toateOferteleMele.map((o, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', backgroundColor: t.bgInput, border: `1px solid ${t.border}` }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px' }}>Preț propus: <span style={{ color: '#10b981' }}>{Number(o.pret).toLocaleString()} RON</span></div>
                            <div style={{ fontSize: '12px', color: t.textSecundar }}>⏱️ Timp execuție: {o.zile} zile &nbsp;•&nbsp; Mesaj: "{o.mesaj}"</div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308', padding: '4px 8px', borderRadius: '4px' }}>ÎN ANALIZĂ</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {proiecte.filter(p => p.dezvoltator === user?.nume).length === 0 ? (
                      <p style={{ color: t.textSecundar, fontSize: '13px' }}>Nu ai publicat niciun proiect încă.</p>
                    ) : (
                      proiecte.filter(p => p.dezvoltator === user?.nume).map(p => (
                        <div key={p.id} style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: '16px' }}>
                          <div
                            onClick={() => { setProiectSelectat(p); setActiveTab('santiere'); }}
                            style={{ fontWeight: '800', fontSize: '14px', marginBottom: '8px', color: '#2563eb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            {p.titlu}
                            <span style={{ fontSize: '11px', color: t.textSecundar, fontWeight: '600' }}>→ Vezi proiect</span>
                          </div>
                          {(!p.oferte || p.oferte.length === 0) ? (
                            <div style={{ fontSize: '12px', color: t.textSecundar }}>Niciun subcontractor nu a licitat încă.</div>
                          ) : (
                            p.oferte.map((o, idx) => {
                              const statusColor = o.status === 'acceptata' ? '#10b981' : o.status === 'respinsa' ? '#ef4444' : '#eab308';
                              const statusBg = o.status === 'acceptata' ? 'rgba(16,185,129,0.1)' : o.status === 'respinsa' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)';
                              const statusLabel = o.status === 'acceptata' ? '✓ ACCEPTATĂ' : o.status === 'respinsa' ? '✗ RESPINSĂ' : 'ÎN ANALIZĂ';
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setOfertaSelectata({ oferta: o, indexOferta: idx, proiect: p });
                                    setProiectSelectat(p);
                                    setActiveTab('santiere');
                                  }}
                                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: t.bgInput, padding: '12px 16px', borderRadius: '8px', marginTop: '8px', cursor: 'pointer', border: `1px solid ${t.border}`, transition: 'all 0.15s' }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                  onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                                >
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700' }}>👷 {o.firma}</div>
                                    <div style={{ fontSize: '12px', color: t.textSecundar }}>Ofertă: {Number(o.pret).toLocaleString()} RON &nbsp;•&nbsp; Timp: {o.zile} zile</div>
                                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: t.textPrincipal }}>"{o.mesaj}"</div>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: statusBg, color: statusColor, padding: '4px 8px', borderRadius: '4px' }}>{statusLabel}</span>
                                    <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600' }}>Deschide →</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}