import React, { useState } from 'react';
import {
  Layers, Wrench, Zap, Paintbrush2, MapPin, Calendar,
  PlusCircle, CheckCircle2, User, Briefcase, Phone,
  Clock, ChevronRight, Trash2, RefreshCw, Star
} from 'lucide-react';

const CATEGORII_SERVICII = [
  { value: 'Structuri',   label: 'Structuri & Betoane',              icon: <Layers size={15} />,      color: '#3b82f6' },
  { value: 'Instalații',  label: 'Instalații (Sanitare/Termice)',    icon: <Wrench size={15} />,      color: '#f59e0b' },
  { value: 'Electrice',   label: 'Sisteme Electrice & Automatizări', icon: <Zap size={15} />,          color: '#a855f7' },
  { value: 'Finisaje',    label: 'Finisaje & Amenajări',             icon: <Paintbrush2 size={15} />, color: '#10b981' },
];

const DATE_GEOGRAFICE = {
  "București": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
  "Cluj":      ["Cluj-Napoca", "Turda", "Dej", "Câmpia Turzii", "Gherla"],
  "Timiș":    ["Timișoara", "Lugoj", "Sânnicolau Mare", "Jimbolia"],
  "Constanța":["Constanța", "Medgidia", "Mangalia", "Năvodari", "Cernavodă"],
  "Iași":      ["Iași", "Pașcani", "Hârlău"],
  "Brașov":   ["Brașov", "Făgăraș", "Săcele", "Zărnești", "Râșnov"],
};

const tabStyle = (activ, t) => ({
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: activ ? '#2563eb' : 'transparent',
  color: activ ? '#fff' : t.textSecundar,
  fontWeight: '700', fontSize: '13px', cursor: 'pointer',
  transition: 'all 0.15s',
});

export default function ServiciiSubcontractorView({ t, user }) {
  const [tabActiv, setTabActiv] = useState('profil'); // 'profil' | 'disponibilitate'
  const [focusat, setFocusat]   = useState(null);
  const [salvat, setSalvat]     = useState(false);

  // ── Profil servicii ──
  const [profil, setProfil] = useState({
    descriere:    '',
    aniFunctie:   '',
    nrAngajati:   '',
    telefon:      '',
    categorii:    [],
    judete:       [],
  });

  // ── Anunț disponibilitate ──
  const [anunt, setAnunt] = useState({
    judet:         '',
    oras:          '',
    dataStart:     '',
    dataFinal:     '',
    categorie:     '',
    detalii:       '',
  });
  const [anunturi, setAnunturi] = useState([]);
  const [anuntSalvat, setAnuntSalvat] = useState(false);

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    backgroundColor: t.bgInput,
    border: `1.5px solid ${focusat === field ? '#2563eb' : t.border}`,
    color: t.textPrincipal, fontSize: '14px', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
  });

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '0.8px', color: t.textSecundar, marginBottom: '7px',
  };

  const toggleCategorie = (val) => {
    setProfil(prev => ({
      ...prev,
      categorii: prev.categorii.includes(val)
        ? prev.categorii.filter(c => c !== val)
        : [...prev.categorii, val],
    }));
  };

  const toggleJudet = (val) => {
    setProfil(prev => ({
      ...prev,
      judete: prev.judete.includes(val)
        ? prev.judete.filter(j => j !== val)
        : [...prev.judete, val],
    }));
  };

  const salveazaProfil = (e) => {
    e.preventDefault();
    // Aici poți face fetch POST la API
    setSalvat(true);
    setTimeout(() => setSalvat(false), 3000);
  };

  const adaugaAnunt = (e) => {
    e.preventDefault();
    const nou = { ...anunt, id: Date.now(), firma: user?.nume };
    setAnunturi(prev => [nou, ...prev]);
    setAnunt({ judet: '', oras: '', dataStart: '', dataFinal: '', categorie: '', detalii: '' });
    setAnuntSalvat(true);
    setTimeout(() => setAnuntSalvat(false), 3000);
  };

  const stergeAnunt = (id) => setAnunturi(prev => prev.filter(a => a.id !== id));

  const localitatiAnunt = anunt.judet ? (DATE_GEOGRAFICE[anunt.judet] || []) : [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Panou Subcontractor
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: '850', margin: '6px 0 4px 0', color: t.textPrincipal }}>
          Serviciile & Disponibilitatea Mea
        </h2>
        <p style={{ color: t.textSecundar, fontSize: '14px', margin: 0 }}>
          Definește ce lucrări execuți și anunță perioadele când ești disponibil.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'inline-flex', gap: '4px', padding: '4px',
        backgroundColor: t.bgCard, borderRadius: '10px',
        border: `1px solid ${t.border}`, alignSelf: 'flex-start',
      }}>
        <button style={tabStyle(tabActiv === 'profil', t)} onClick={() => setTabActiv('profil')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} /> Profil Servicii
          </span>
        </button>
        <button style={tabStyle(tabActiv === 'disponibilitate', t)} onClick={() => setTabActiv('disponibilitate')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Disponibilitate
          </span>
        </button>
      </div>

      {/* ══ TAB: PROFIL SERVICII ══ */}
      {tabActiv === 'profil' && (
        <form onSubmit={salveazaProfil} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Categorii de servicii */}
          <FormSection label="1. Ce Lucrări Execuți" t={t}>
            <div>
              <label style={labelStyle}><Star size={12} /> Categorii de Specialitate</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {CATEGORII_SERVICII.map(cat => {
                  const activ = profil.categorii.includes(cat.value);
                  return (
                    <button
                      key={cat.value} type="button"
                      onClick={() => toggleCategorie(cat.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 14px', borderRadius: '10px',
                        border: `1.5px solid ${activ ? cat.color : t.border}`,
                        backgroundColor: activ ? `${cat.color}15` : t.bgInput,
                        color: activ ? cat.color : t.textSecundar,
                        fontSize: '13px', fontWeight: activ ? '700' : '500',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}
                    >
                      {cat.icon} {cat.label}
                      {activ && <CheckCircle2 size={14} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone de activitate */}
            <div>
              <label style={labelStyle}><MapPin size={12} /> Județe de Activitate</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.keys(DATE_GEOGRAFICE).map(j => {
                  const activ = profil.judete.includes(j);
                  return (
                    <button
                      key={j} type="button"
                      onClick={() => toggleJudet(j)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                        border: `1.5px solid ${activ ? '#2563eb' : t.border}`,
                        backgroundColor: activ ? 'rgba(37,99,235,0.1)' : t.bgInput,
                        color: activ ? '#2563eb' : t.textSecundar,
                        fontSize: '13px', fontWeight: activ ? '700' : '500',
                        transition: 'all 0.15s',
                      }}
                    >
                      {j}
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* Date firmă */}
          <FormSection label="2. Date Firmă" t={t}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}><Briefcase size={12} /> Ani de Activitate</label>
                <input type="number" min="0" placeholder="ex: 8"
                  value={profil.aniFunctie}
                  onChange={e => setProfil({ ...profil, aniFunctie: e.target.value })}
                  onFocus={() => setFocusat('ani')} onBlur={() => setFocusat(null)}
                  style={inputStyle('ani')}
                />
              </div>
              <div>
                <label style={labelStyle}><User size={12} /> Număr Angajați</label>
                <input type="number" min="1" placeholder="ex: 15"
                  value={profil.nrAngajati}
                  onChange={e => setProfil({ ...profil, nrAngajati: e.target.value })}
                  onFocus={() => setFocusat('angajati')} onBlur={() => setFocusat(null)}
                  style={inputStyle('angajati')}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}><Phone size={12} /> Telefon Contact Direct</label>
              <input type="tel" placeholder="ex: 0722 123 456"
                value={profil.telefon}
                onChange={e => setProfil({ ...profil, telefon: e.target.value })}
                onFocus={() => setFocusat('tel')} onBlur={() => setFocusat(null)}
                style={inputStyle('tel')}
              />
            </div>
          </FormSection>

          {/* Descriere */}
          <FormSection label="3. Prezentare Scurtă" t={t}>
            <div>
              <label style={labelStyle}><Star size={12} /> Ce vă diferențiază</label>
              <textarea rows={4}
                placeholder="Descrie echipa, utilajele deținute, certificările, proiectele reprezentative..."
                value={profil.descriere}
                onChange={e => setProfil({ ...profil, descriere: e.target.value })}
                onFocus={() => setFocusat('desc')} onBlur={() => setFocusat(null)}
                style={{ ...inputStyle('desc'), resize: 'vertical', lineHeight: 1.65 }}
              />
            </div>
          </FormSection>

          {/* Submit profil */}
          <div style={{ paddingTop: '4px' }}>
            {salvat && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '700', fontSize: '13px', marginBottom: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={16} /> Profilul a fost salvat cu succes!
              </div>
            )}
            <button type="submit"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px 26px', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <CheckCircle2 size={16} /> Salvează Profilul <ChevronRight size={15} />
            </button>
          </div>
        </form>
      )}

      {/* ══ TAB: DISPONIBILITATE ══ */}
      {tabActiv === 'disponibilitate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Formular anunț nou */}
          <form onSubmit={adaugaAnunt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormSection label="Anunță o Perioadă Disponibilă" t={t}>

              {/* Categorie */}
              <div>
                <label style={labelStyle}><Star size={12} /> Tip Lucrare Disponibilă</label>
                <select required value={anunt.categorie}
                  onChange={e => setAnunt({ ...anunt, categorie: e.target.value })}
                  onFocus={() => setFocusat('catAnunt')} onBlur={() => setFocusat(null)}
                  style={inputStyle('catAnunt')}
                >
                  <option value="">Selectează categoria...</option>
                  {CATEGORII_SERVICII.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Locație */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><MapPin size={12} /> Județ</label>
                  <select required value={anunt.judet}
                    onChange={e => setAnunt({ ...anunt, judet: e.target.value, oras: '' })}
                    onFocus={() => setFocusat('jAnunt')} onBlur={() => setFocusat(null)}
                    style={inputStyle('jAnunt')}
                  >
                    <option value="">Selectează județ...</option>
                    {Object.keys(DATE_GEOGRAFICE).map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={12} /> Oraș</label>
                  <select required disabled={!anunt.judet} value={anunt.oras}
                    onChange={e => setAnunt({ ...anunt, oras: e.target.value })}
                    onFocus={() => setFocusat('oAnunt')} onBlur={() => setFocusat(null)}
                    style={{ ...inputStyle('oAnunt'), opacity: anunt.judet ? 1 : 0.5, cursor: anunt.judet ? 'pointer' : 'not-allowed' }}
                  >
                    <option value="">Selectează oraș...</option>
                    {localitatiAnunt.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Interval timp */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><Calendar size={12} /> Disponibil De La</label>
                  <input required type="date" value={anunt.dataStart}
                    onChange={e => setAnunt({ ...anunt, dataStart: e.target.value })}
                    onFocus={() => setFocusat('ds')} onBlur={() => setFocusat(null)}
                    style={inputStyle('ds')}
                  />
                </div>
                <div>
                  <label style={labelStyle}><Clock size={12} /> Până La</label>
                  <input required type="date" value={anunt.dataFinal}
                    onChange={e => setAnunt({ ...anunt, dataFinal: e.target.value })}
                    onFocus={() => setFocusat('df')} onBlur={() => setFocusat(null)}
                    style={inputStyle('df')}
                  />
                </div>
              </div>

              {/* Detalii */}
              <div>
                <label style={labelStyle}><Star size={12} /> Detalii Suplimentare (opțional)</label>
                <textarea rows={3}
                  placeholder="ex: Echipă de 5 persoane disponibilă pentru lucrări de finisaje, deținem utilaje proprii..."
                  value={anunt.detalii}
                  onChange={e => setAnunt({ ...anunt, detalii: e.target.value })}
                  onFocus={() => setFocusat('det')} onBlur={() => setFocusat(null)}
                  style={{ ...inputStyle('det'), resize: 'vertical', lineHeight: 1.65 }}
                />
              </div>
            </FormSection>

            {anuntSalvat && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '700', fontSize: '13px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={16} /> Anunțul a fost publicat!
              </div>
            )}

            <button type="submit"
              style={{
                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px 26px', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <PlusCircle size={16} /> Publică Disponibilitatea <ChevronRight size={15} />
            </button>
          </form>

          {/* Lista anunțuri existente */}
          {anunturi.length > 0 && (
            <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
              <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={13} /> Anunțuri Active ({anunturi.length})
              </div>
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {anunturi.map(a => {
                  const cat = CATEGORII_SERVICII.find(c => c.value === a.categorie);
                  return (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', backgroundColor: t.bgInput, border: `1px solid ${t.border}` }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          {cat && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '20px', backgroundColor: `${cat.color}15`, color: cat.color }}>
                              {cat.icon} {a.categorie}
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="#ef4444" /> {a.oras}, {a.judet}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {a.dataStart} → {a.dataFinal}
                        </div>
                        {a.detalii && <div style={{ fontSize: '12px', fontStyle: 'italic', color: t.textSecundar, marginTop: '4px' }}>"{a.detalii}"</div>}
                      </div>
                      <button
                        onClick={() => stergeAnunt(a.id)}
                        style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Șterge anunț"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormSection({ label, t, children }) {
  return (
    <div style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar }}>
        {label}
      </div>
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {children}
      </div>
    </div>
  );
}
