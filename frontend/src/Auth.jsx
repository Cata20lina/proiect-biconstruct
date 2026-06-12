import React, { useState } from 'react';
import { Building2, ShieldCheck, Mail, Lock, User, Phone, FileText, ArrowRight, Map, KeyRound } from 'lucide-react';
// Importăm librăria reală de trimis emailuri
import emailjs from '@emailjs/browser';

export default function Auth({ onLoginSuccess }) {
  // ==========================================
  // 🔑 INTRODUCE CHEILE TALE DIN EMAILJS AICI:
  // ==========================================
  const EMAILJS_SERVICE_ID = "service_ld4h1no";
  const EMAILJS_TEMPLATE_ID = "template_by38qdu";
  const EMAILJS_PUBLIC_KEY = "dJrWkJaxVq3h6Io_4";

  const [isLogin, setIsLogin] = useState(true);
  
  // Stări pentru câmpurile din formulare
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [confirmaParola, setConfirmaParola] = useState('');
  const [nume, setNume] = useState('');
  const [cui, setCui] = useState('');
  const [telefon, setTelefon] = useState('');
  const [rol, setRol] = useState('SUBCONTRACTOR'); 
  const [judet, setJudet] = useState(''); // Va stoca județul selectat

  // Stări pentru fluxul de verificare real prin Email
  const [stepVerificare, setStepVerificare] = useState(false);
  const [codIntrodus, setCodIntrodus] = useState('');
  const [codOTPReal, setCodOTPReal] = useState('');
  const [dateContTemporar, setDateContTemporar] = useState(null);

  const [eroare, setEroare] = useState('');
  const [succesMesaj, setSuccesMesaj] = useState('');
  const [seIncarca, setSeIncarca] = useState(false);

  // Lista oficială a județelor din România pentru Dropdown
  const judeteRomania = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București",
    "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț",
    "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
  ];

  // 1. ÎNREGISTRARE: VALIDARE ȘI TRIMITERE EMAIL
  const handleRegisterInitiate = async (e) => {
    e.preventDefault();
    setEroare('');
    setSuccesMesaj('');

    if (!judet) {
      setEroare('Te rugăm să selectezi județul în care are sediul firma.');
      return;
    }

    if (parola !== confirmaParola) {
      setEroare('Parolele introduse nu coincid!');
      return;
    }

    if (parola.length < 6) {
      setEroare('Parola trebuie să aibă cel puțin 6 caractere.');
      return;
    }

    const utilizatoriExistenti = JSON.parse(localStorage.getItem('baza_utilizatori') || '[]');
    const emailExista = utilizatoriExistenti.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExista) {
      setEroare('Această adresă de email este deja înregistrată.');
      return;
    }

    const codGenerat = Math.floor(100000 + Math.random() * 900000).toString();
    setCodOTPReal(codGenerat);
    setSeIncarca(true);

    const templateParams = {
      to_email: email.toLowerCase(),
      cod_otp: codGenerat,
      nume_firma: nume || 'Companie'
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setDateContTemporar({
        id: Date.now(),
        email: email.toLowerCase(),
        parola: parola,
        nume: nume || 'Companie Anonimă',
        cui: cui || 'RO000000',
        telefon: telefon || '',
        judet: judet,
        rol: rol
      });

      setStepVerificare(true);
      setSuccesMesaj(`📧 Un e-mail cu codul de verificare a fost trimis la adresa ${email}.`);
    } catch (error) {
      console.error("Eroare EmailJS:", error);
      setEroare("Eroare la trimiterea e-mail-ului! Verifică setările contului EmailJS.");
    } finally {
      setSeIncarca(false);
    }
  };

  // 2. VERIFICARE COD OTP INTRODUS
  const handleVerificareCod = (e) => {
    e.preventDefault();
    setEroare('');

    if (codIntrodus !== codOTPReal) {
      setEroare('Codul introdus este greșit! Verifică cu atenție căsuța de email.');
      return;
    }

    const utilizatoriExistenti = JSON.parse(localStorage.getItem('baza_utilizatori') || '[]');
    utilizatoriExistenti.push(dateContTemporar);
    
    localStorage.setItem('baza_utilizatori', JSON.stringify(utilizatoriExistenti));
    localStorage.setItem('user', JSON.stringify(dateContTemporar));
    localStorage.setItem('token', 'simulated-jwt-token-' + dateContTemporar.id);
    
    onLoginSuccess(dateContTemporar);
  };

  // 3. LOGICA DE LOGIN STANDARD
  const handleLogin = (e) => {
    e.preventDefault();
    setEroare('');

    const utilizatoriExistenti = JSON.parse(localStorage.getItem('baza_utilizatori') || '[]');
    const utilizatorGasit = utilizatoriExistenti.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.parola === parola
    );

    if (!utilizatorGasit) {
      setEroare('Email sau parolă incorectă!');
      return;
    }

    localStorage.setItem('user', JSON.stringify(utilizatorGasit));
    localStorage.setItem('token', 'simulated-jwt-token-' + utilizatorGasit.id);
    onLoginSuccess(utilizatorGasit);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#0b1329', fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* EFFECT BACKGROUND */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>

      {/* COLOANA STÂNGA: PREZENTARE */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px', color: '#ffffff', zIndex: 2, borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
            <Building2 size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Construct<span style={{ color: '#3b82f6' }}>Bid</span></span>
        </div>

        <div style={{ maxWidth: '440px', margin: 'auto 0' }}>
          <div style={{ display: 'inline-flex', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '6px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: '600', gap: '8px', alignItems: 'center', marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} /> Date Standardizate B2B
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-1.5px', background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Cea mai inteligentă piață B2B pentru construcții.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
            Filtrarea pe județe asigură alocarea perfectă a proiectelor către subcontractorii din proximitatea geografică potrivită.
          </p>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b' }}>
          © 2026 ConstructBid • Localizare Controlată
        </div>
      </div>

      {/* COLOANA DREAPTA: FORMULAR */}
      <div style={{ flex: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 2, backgroundColor: '#0f172a', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: isLogin ? '460px' : '540px', transition: 'all 0.3s ease', padding: '20px 0' }}>
          
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', letterSpacing: '-1px' }}>
              {stepVerificare ? 'Verificare Cont' : isLogin ? 'Bine ai revenit!' : 'Creează cont nou'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              {stepVerificare ? 'Introdu codul real primit pe e-mail pentru confirmare.' : isLogin ? 'Introdu credențialele oficiale pentru acces securizat.' : 'Completează profilul tehnic și fiscal pentru listarea în rețea.'}
            </p>
          </div>

          {eroare && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '14px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
              ⚠️ {eroare}
            </div>
          )}

          {succesMesaj && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '14px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
              {succesMesaj}
            </div>
          )}

          {stepVerificare ? (
            /* FAZA INTRODUCERE COD OTP */
            <form onSubmit={handleVerificareCod} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Cod Activare Primit pe Email</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6' }} />
                  <input type="text" required maxLength="6" value={codIntrodus} onChange={(e) => setCodIntrodus(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '1px solid #2563eb', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '18px', fontWeight: '800', letterSpacing: '8px', boxSizing: 'border-box', outline: 'none', textAlign: 'center' }} placeholder="123456" />
                </div>
              </div>

              <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                Verifică Codul Real
              </button>
            </form>
          ) : (
            
            /* FORMULAR PRINCIPAL LOGIN / REGISTER */
            <form onSubmit={isLogin ? handleLogin : handleRegisterInitiate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {!isLogin && (
                <>
                  {/* TIP CONT */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Tipul Contului (Rol Execuție)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button type="button" onClick={() => setRol('SUBCONTRACTOR')} style={{ padding: '14px 16px', borderRadius: '12px', border: `2px solid ${rol === 'SUBCONTRACTOR' ? '#2563eb' : 'rgba(255,255,255,0.06)'}`, backgroundColor: rol === 'SUBCONTRACTOR' ? 'rgba(37,99,235,0.1)' : '#1e293b', color: rol === 'SUBCONTRACTOR' ? '#fff' : '#64748b', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                        👷 Subcontractor
                      </button>
                      <button type="button" onClick={() => setRol('DEZVOLTATOR')} style={{ padding: '14px 16px', borderRadius: '12px', border: `2px solid ${rol === 'DEZVOLTATOR' ? '#a855f7' : 'rgba(255,255,255,0.06)'}`, backgroundColor: rol === 'DEZVOLTATOR' ? 'rgba(168,85,247,0.1)' : '#1e293b', color: rol === 'DEZVOLTATOR' ? '#fff' : '#64748b', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                        🏢 Dezvoltator
                      </button>
                    </div>
                  </div>

                  {/* NUME COMPANIE */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Denumire Firmă / PFA</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input type="text" required value={nume} onChange={(e) => setNume(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="ex: SC Pro Construct SRL" />
                    </div>
                  </div>

                  {/* CUI & TELEFON */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>CUI / CIF</label>
                      <input type="text" required value={cui} onChange={(e) => setCui(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="Cod fiscal" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Telefon Contact</label>
                      <input type="text" required value={telefon} onChange={(e) => setTelefon(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="07xxxxxxxx" />
                    </div>
                  </div>

                  {/* DROPDOWN JUDEȚ (ACTUALIZAT CONFORM CERINȚEI) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Sediul Central (Județ)</label>
                    <div style={{ position: 'relative' }}>
                      <Map size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 3 }} />
                      <select 
                        required 
                        value={judet} 
                        onChange={(e) => setJudet(e.target.value)} 
                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: judet ? '#ffffff' : '#64748b', fontSize: '14px', boxSizing: 'border-box', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="" disabled hidden>Alege județul...</option>
                        {judeteRomania.map((j) => (
                          <option key={j} value={j} style={{ backgroundColor: '#0f172a', color: '#fff' }}>{j}</option>
                        ))}
                      </select>
                      {/* Săgeată custom pentru dropdown */}
                      <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none', fontSize: '12px' }}>▼</div>
                    </div>
                  </div>
                </>
              )}

              {/* EMAIL */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>E-mail Oficial</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="nume@companie.ro" />
                </div>
              </div>

              {/* PAROLĂ */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Parolă</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input type="password" required value={parola} onChange={(e) => setParola(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="••••••••" />
                </div>
              </div>

              {/* CONFIRMĂ PAROLĂ */}
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Confirmă Parolă</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input type="password" required value={confirmaParola} onChange={(e) => setConfirmaParola(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="Repetă parola" />
                  </div>
                </div>
              )}

              {/* BUTON ACTIONS */}
              <button type="submit" disabled={seIncarca} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: seIncarca ? 'not-allowed' : 'pointer', opacity: seIncarca ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {seIncarca ? 'Se trimite e-mailul real...' : isLogin ? 'Intră în cont securizat' : 'Activează Contul Profesional'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {!stepVerificare && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button onClick={() => { setIsLogin(!isLogin); setEroare(''); setSuccesMesaj(''); }} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {isLogin ? 'Compania ta nu este înscrisă? Creează un cont acum' : 'Ai deja cont deschis? Conectează-te'}
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}