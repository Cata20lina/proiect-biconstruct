import React, { useState } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Banknote, Building2,
  Layers, Wrench, Zap, Paintbrush2, Send, CheckCircle2,
  Clock, FileText, ChevronRight, MessageSquare, Users,
  Paperclip, X, File
} from 'lucide-react';

const CATEGORIE_CONFIG = {
  'Structuri':  { icon: <Layers size={15} />,      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  'Instalații': { icon: <Wrench size={15} />,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  'Electrice':  { icon: <Zap size={15} />,          color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  'Finisaje':   { icon: <Paintbrush2 size={15} />, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
};

export default function ProiectDetailView({
  proiect,
  onBack,
  t,
  user,
  deschideChat,
  onAdaugaOferta,
  loadingOferta,
  errorOferta,
  onSelectOferta,   // callback: (oferta, indexOferta) => void — deschide OfertaDetailView
}) {
  const [formOferta, setFormOferta] = useState({ pret: '', zile: '', mesaj: '' });
  const [focusat, setFocusat]       = useState(null);
  const [trimisOK, setTrimisOK]     = useState(false);
  const [fisiere, setFisiere]       = useState([]); // File[]
  const fileInputRef                = React.useRef(null);

  if (!proiect) return null;

  const esteDezvoltator = user?.rol === 'DEZVOLTATOR';

  const catCfg = CATEGORIE_CONFIG[proiect.categorie] || {
    icon: <Layers size={15} />, color: '#6b7280', bg: 'rgba(107,114,128,0.12)',
  };

  const locatie = proiect.judet && proiect.oras
    ? `${proiect.oras}, ${proiect.judet}`
    : proiect.locatie || 'Nespecificat';

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

  const handleSubmitOferta = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pret', formOferta.pret);
    formData.append('zile', formOferta.zile);
    formData.append('mesaj', formOferta.mesaj);
    formData.append('firma', user?.nume || 'Subcontractor Anonim');
    fisiere.forEach(f => formData.append('fisiere', f));
    await onAdaugaOferta(formData);
    setTrimisOK(true);
    setFormOferta({ pret: '', zile: '', mesaj: '' });
    setFisiere([]);
    setTimeout(() => setTrimisOK(false), 4000);
  };

  const handleFisiere = (e) => {
    const noi = Array.from(e.target.files);
    setFisiere(prev => {
      const existente = new Set(prev.map(f => f.name + f.size));
      return [...prev, ...noi.filter(f => !existente.has(f.name + f.size))];
    });
    e.target.value = '';
  };

  const stergeFile = (index) => setFisiere(prev => prev.filter((_, i) => i !== index));

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // Status badge per ofertă
  const StatusBadge = ({ status }) => {
    const cfg = {
      acceptata: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: '✓ Acceptată' },
      respinsa:  { bg: 'rgba(239,68,68,0.10)',  color: '#ef4444', label: '✕ Respinsă'  },
      asteptare: { bg: 'rgba(234,179,8,0.10)',  color: '#eab308', label: '⏳ În analiză' },
    }[status || 'asteptare'];
    return (
      <span style={{
        fontSize: '11px', fontWeight: '800', padding: '4px 10px',
        borderRadius: '20px', backgroundColor: cfg.bg, color: cfg.color,
        whiteSpace: 'nowrap',
      }}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Buton înapoi */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: `1px solid ${t.border}`, borderRadius: '8px',
          padding: '8px 14px', color: t.textSecundar, fontSize: '13px',
          fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecundar; }}
      >
        <ArrowLeft size={15} /> Înapoi la licitații
      </button>

      {/* ── HEADER PROIECT ── */}
      <div style={{
        backgroundColor: t.bgCard, borderRadius: '20px',
        border: `1px solid ${t.border}`, overflow: 'hidden',
        boxShadow: `0 4px 24px ${t.shadow}`,
      }}>
        <div style={{ height: '4px', background: `linear-gradient(90deg, ${catCfg.color}, ${catCfg.color}55)` }} />
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px',
              padding: '5px 12px', borderRadius: '20px',
              backgroundColor: catCfg.bg, color: catCfg.color,
            }}>
              {catCfg.icon} {proiect.categorie}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: t.textSecundar, fontSize: '13px' }}>
              <MapPin size={14} color="#ef4444" />
              <span style={{ fontWeight: '600' }}>{locatie}</span>
            </div>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '850', color: t.textPrincipal, margin: '0 0 10px 0', lineHeight: 1.3 }}>
            {proiect.titlu}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: t.textSecundar, fontSize: '13px' }}>
            <Building2 size={14} />
            <span>Publicat de <strong style={{ color: t.textPrincipal }}>{proiect.dezvoltator}</strong></span>
          </div>

          {/* Statistici rapide */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '28px' }}>
            {[
              { icon: <Banknote size={14} color="#10b981" />, label: 'Buget Maxim', value: proiect.bugetMax ? `${Number(proiect.bugetMax).toLocaleString()} RON` : '–', color: '#10b981' },
              { icon: <Calendar size={14} color="#f59e0b" />, label: 'Termen Limită', value: proiect.termenLimita || '–', color: t.textPrincipal },
              { icon: <Users size={14} color="#3b82f6" />,   label: 'Oferte Primite', value: (proiect.oferte || []).length, color: '#3b82f6' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: t.bgInput, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  {s.icon}
                  <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: t.textSecundar }}>{s.label}</span>
                </div>
                <div style={{ fontSize: i === 1 ? '16px' : '22px', fontWeight: '900', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORP: layout 2 coloane ── */}
      <div style={{ display: 'grid', gridTemplateColumns: esteDezvoltator ? '1fr' : '1fr 380px', gap: '20px', alignItems: 'start' }}>

        {/* Coloana stânga: descriere + oferte (doar pt dezvoltator) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Descriere */}
          <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
            <SectionHeader icon={<FileText size={13} />} label="Caiet de Sarcini" t={t} />
            <div style={{ padding: '24px' }}>
              <p style={{ color: t.textPrincipal, fontSize: '14px', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
                {proiect.descriere || 'Fără descriere detaliată.'}
              </p>
            </div>
          </div>

          {/* Oferte primite — DOAR DEZVOLTATOR */}
          {esteDezvoltator && (
            <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
              <SectionHeader icon={<Users size={13} />} label={`Cotații Primite (${(proiect.oferte || []).length})`} t={t} />
              <div style={{ padding: (proiect.oferte || []).length === 0 ? '32px 24px' : '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(proiect.oferte || []).length === 0 ? (
                  <p style={{ color: t.textSecundar, fontSize: '13px', margin: 0, textAlign: 'center' }}>
                    Niciun subcontractor nu a licitat încă.
                  </p>
                ) : (
                  proiect.oferte.map((o, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectOferta && onSelectOferta(o, idx, proiect)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', borderRadius: '10px',
                        backgroundColor: t.bgInput, border: `1px solid ${t.border}`,
                        cursor: 'pointer', transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: t.textPrincipal, marginBottom: '4px' }}>
                          👷 {o.firma}
                        </div>
                        <div style={{ fontSize: '12px', color: t.textSecundar }}>
                          <span style={{ color: '#10b981', fontWeight: '800' }}>{Number(o.pret).toLocaleString()} RON</span>
                          {' '}&nbsp;•&nbsp; {o.zile} zile execuție
                        </div>
                        {o.mesaj && (
                          <div style={{ fontSize: '12px', fontStyle: 'italic', color: t.textSecundar, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                            "{o.mesaj}"
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
                        <StatusBadge status={o.status} />
                        <ChevronRight size={16} color={t.textSecundar} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coloana dreapta: formular ofertă — DOAR SUBCONTRACTOR */}
        {!esteDezvoltator && (
          <div style={{
            backgroundColor: t.bgCard, borderRadius: '16px',
            border: `1px solid ${t.border}`, overflow: 'hidden',
            boxShadow: `0 2px 12px ${t.shadow}`, position: 'sticky', top: '24px',
          }}>
            <div style={{
              padding: '14px 24px', borderBottom: `1px solid ${t.border}`,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(79,70,229,0.08))',
              fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
              letterSpacing: '1px', color: '#2563eb',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Send size={13} /> Depune Cotație
            </div>

            <div style={{ padding: '22px 24px' }}>
              {trimisOK ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={28} color="#10b981" />
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: t.textPrincipal }}>Cotație trimisă!</div>
                  <div style={{ fontSize: '13px', color: t.textSecundar, lineHeight: 1.5 }}>
                    Dezvoltatorul va reveni cu un răspuns. Poți continua discuția în chat.
                  </div>
                  <button
                    onClick={deschideChat}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.25)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}
                  >
                    <MessageSquare size={14} /> Deschide Chat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOferta} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}><Banknote size={12} /> Prețul tău (RON)</label>
                    <input required type="number" min="1"
                      placeholder={proiect.bugetMax ? `max. ${Number(proiect.bugetMax).toLocaleString()} RON` : 'ex: 45.000'}
                      value={formOferta.pret}
                      onChange={e => setFormOferta({ ...formOferta, pret: e.target.value })}
                      onFocus={() => setFocusat('pret')} onBlur={() => setFocusat(null)}
                      style={inputStyle('pret')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}><Clock size={12} /> Durată Execuție (zile)</label>
                    <input required type="number" min="1" placeholder="ex: 30"
                      value={formOferta.zile}
                      onChange={e => setFormOferta({ ...formOferta, zile: e.target.value })}
                      onFocus={() => setFocusat('zile')} onBlur={() => setFocusat(null)}
                      style={inputStyle('zile')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}><FileText size={12} /> Mesaj pentru Dezvoltator</label>
                    <textarea rows={4}
                      placeholder="Prezintă-ți experiența relevantă, echipa disponibilă, sau orice condiție specială..."
                      value={formOferta.mesaj}
                      onChange={e => setFormOferta({ ...formOferta, mesaj: e.target.value })}
                      onFocus={() => setFocusat('mesaj')} onBlur={() => setFocusat(null)}
                      style={{ ...inputStyle('mesaj'), resize: 'vertical', lineHeight: 1.65 }}
                    />
                  </div>

                  {/* ── UPLOAD FIȘIERE ── */}
                  <div>
                    <label style={labelStyle}><Paperclip size={12} /> Documente Atașate <span style={{ color: t.textSecundar, fontSize: '10px', fontWeight: '500', textTransform: 'none', letterSpacing: 0 }}>(opțional, max 20MB/fișier)</span></label>

                    {/* Zona drop/click */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${focusat === 'fisiere' ? '#2563eb' : t.border}`,
                        borderRadius: '10px', padding: '20px',
                        textAlign: 'center', cursor: 'pointer',
                        backgroundColor: t.bgInput, transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.backgroundColor = t.bgInput; }}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#2563eb'; }}
                      onDrop={e => {
                        e.preventDefault();
                        const dropped = Array.from(e.dataTransfer.files);
                        setFisiere(prev => {
                          const existente = new Set(prev.map(f => f.name + f.size));
                          return [...prev, ...dropped.filter(f => !existente.has(f.name + f.size))];
                        });
                        e.currentTarget.style.borderColor = t.border;
                      }}
                    >
                      <Paperclip size={20} color="#3b82f6" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: '600', color: t.textPrincipal, marginBottom: '4px' }}>
                        Click sau trage fișierele aici
                      </div>
                      <div style={{ fontSize: '11px', color: t.textSecundar }}>
                        PDF, Word, Excel, imagini — orice format acceptat
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFisiere}
                    />

                    {/* Lista fișiere selectate */}
                    {fisiere.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {fisiere.map((f, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 12px', borderRadius: '8px',
                            backgroundColor: 'rgba(37,99,235,0.06)',
                            border: '1px solid rgba(37,99,235,0.15)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                              <File size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: '12px', fontWeight: '600', color: t.textPrincipal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {f.name}
                              </span>
                              <span style={{ fontSize: '11px', color: t.textSecundar, flexShrink: 0 }}>
                                {formatSize(f.size)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => stergeFile(i)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errorOferta && (
                    <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(239,68,68,0.2)' }}>
                      ⚠️ {errorOferta}
                    </div>
                  )}
                  <button type="submit" disabled={loadingOferta}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: loadingOferta ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      color: '#fff', border: 'none', borderRadius: '10px', padding: '13px',
                      fontSize: '14px', fontWeight: '700',
                      cursor: loadingOferta ? 'not-allowed' : 'pointer',
                      boxShadow: loadingOferta ? 'none' : '0 4px 16px rgba(37,99,235,0.3)',
                    }}
                    onMouseEnter={e => { if (!loadingOferta) e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {loadingOferta ? 'Se trimite...' : <><Send size={15} /> Trimite Cotația <ChevronRight size={15} /></>}
                  </button>
                  <p style={{ fontSize: '11px', color: t.textSecundar, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                    Cotația ta va fi vizibilă imediat pentru dezvoltator.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon, label, t }) {
  return (
    <div style={{
      padding: '14px 24px', borderBottom: `1px solid ${t.border}`,
      backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800',
      textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar,
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      {icon} {label}
    </div>
  );
}