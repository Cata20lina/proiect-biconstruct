import React, { useState } from 'react';
import {
  PlusCircle, Building2, Banknote, MapPin, Calendar,
  FileText, ChevronRight, Layers, Zap, Wrench, Paintbrush2,
  CheckCircle2, Loader, AlertCircle
} from 'lucide-react';

const CATEGORII = [
  { value: 'Structuri',  label: 'Structuri & Betoane',              icon: <Layers size={16} />,      color: '#3b82f6' },
  { value: 'Instalații', label: 'Instalații (Sanitare/Termice)',    icon: <Wrench size={16} />,      color: '#f59e0b' },
  { value: 'Electrice',  label: 'Sisteme Electrice & Automatizări', icon: <Zap size={16} />,         color: '#a855f7' },
  { value: 'Finisaje',   label: 'Finisaje & Amenajări',             icon: <Paintbrush2 size={16} />, color: '#10b981' },
];

export default function AdaugaAnuntView({
  t, formAnunt, setFormAnunt, adaugaAnuntNou,
  dateGeograficeServer, localitatiDeAfisat,
  loading = false, error = '', success = false
}) {
  const [focusat, setFocusat] = useState(null);

  const inputBase = (field) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: t.bgInput,
    border: `1.5px solid ${focusat === field ? '#2563eb' : t.border}`,
    color: t.textPrincipal,
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s',
  });

  const labelBase = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '0.8px', color: t.textSecundar, marginBottom: '7px',
  };

  if (success) {
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={32} color="#10b981" />
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: t.textPrincipal, margin: 0 }}>Anunț publicat cu succes!</h3>
        <p style={{ color: t.textSecundar, fontSize: '14px', margin: 0 }}>Ești redirecționat către lista de șantiere...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb',
          fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
          letterSpacing: '1px', padding: '5px 12px', borderRadius: '20px',
          marginBottom: '12px',
        }}>
          <Building2 size={11} /> Panou Dezvoltator
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '850', color: t.textPrincipal, margin: '0 0 6px' }}>
          Lansează un Anunț de Subcontractare
        </h2>
        <p style={{ color: t.textSecundar, fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
          Completează cerințele tehnice pentru a primi cotații directe de la firme specializate.
        </p>
      </div>

      <form onSubmit={adaugaAnuntNou}>

        {/* Bloc 1 — Identitate */}
        <FormSection label="1. Identitate Proiect" t={t}>
          <div>
            <label style={labelBase}><FileText size={12} /> Titlu Lucrare / Obiectiv</label>
            <input
              required type="text"
              value={formAnunt.titlu}
              onChange={e => setFormAnunt({ ...formAnunt, titlu: e.target.value })}
              onFocus={() => setFocusat('titlu')}
              onBlur={() => setFocusat(null)}
              placeholder="ex: Execuție tencuieli interioare automatizate 2000mp"
              style={inputBase('titlu')}
            />
          </div>
          <div>
            <label style={labelBase}><Layers size={12} /> Categorie Serviciu</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {CATEGORII.map(cat => {
                const activ = formAnunt.categorie === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormAnunt({ ...formAnunt, categorie: cat.value })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 14px', borderRadius: '10px',
                      border: `1.5px solid ${activ ? cat.color : t.border}`,
                      backgroundColor: activ ? `${cat.color}18` : t.bgInput,
                      color: activ ? cat.color : t.textSecundar,
                      fontSize: '13px', fontWeight: activ ? '700' : '500',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </FormSection>

        {/* Bloc 2 — Financiar & Timp */}
        <FormSection label="2. Financiar & Timp" t={t}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelBase}><Banknote size={12} /> Buget Maxim (RON)</label>
              <input
                required type="number" min="1"
                value={formAnunt.bugetMax}
                onChange={e => setFormAnunt({ ...formAnunt, bugetMax: e.target.value })}
                onFocus={() => setFocusat('buget')}
                onBlur={() => setFocusat(null)}
                placeholder="ex: 75000"
                style={inputBase('buget')}
              />
            </div>
            <div>
              <label style={labelBase}><Calendar size={12} /> Termen Limită Oferte</label>
              <input
                required type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formAnunt.termenLimita}
                onChange={e => setFormAnunt({ ...formAnunt, termenLimita: e.target.value })}
                onFocus={() => setFocusat('termen')}
                onBlur={() => setFocusat(null)}
                style={inputBase('termen')}
              />
            </div>
          </div>
        </FormSection>

        {/* Bloc 3 — Locație */}
        <FormSection label="3. Locație Șantier" t={t}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelBase}><MapPin size={12} /> Județ</label>
              <select
                required
                value={formAnunt.judet}
                onChange={e => setFormAnunt({ ...formAnunt, judet: e.target.value, oras: '' })}
                onFocus={() => setFocusat('judet')}
                onBlur={() => setFocusat(null)}
                style={inputBase('judet')}
              >
                <option value="">Selectează județ...</option>
                {dateGeograficeServer.map(item => (
                  <option key={item._id} value={item.judet}>{item.judet}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelBase}><MapPin size={12} /> Oraș / Localitate</label>
              <select
                required
                disabled={!formAnunt.judet}
                value={formAnunt.oras}
                onChange={e => setFormAnunt({ ...formAnunt, oras: e.target.value })}
                onFocus={() => setFocusat('oras')}
                onBlur={() => setFocusat(null)}
                style={{ ...inputBase('oras'), opacity: formAnunt.judet ? 1 : 0.45, cursor: formAnunt.judet ? 'pointer' : 'not-allowed' }}
              >
                <option value="">Selectează oraș...</option>
                {localitatiDeAfisat.map(oras => (
                  <option key={oras} value={oras}>{oras}</option>
                ))}
              </select>
            </div>
          </div>
        </FormSection>

        {/* Bloc 4 — Descriere */}
        <FormSection label="4. Caiet de Sarcini" t={t}>
          <div>
            <label style={labelBase}><FileText size={12} /> Descriere Tehnică Detaliată</label>
            <textarea
              required rows={5}
              value={formAnunt.descriere}
              onChange={e => setFormAnunt({ ...formAnunt, descriere: e.target.value })}
              onFocus={() => setFocusat('descriere')}
              onBlur={() => setFocusat(null)}
              placeholder="Descrie fRONtul de lucru, utilajele asigurate, materialele, stadiul actual al șantierului și orice condiție specială..."
              style={{ ...inputBase('descriere'), resize: 'vertical', lineHeight: 1.65 }}
            />
            <div style={{ fontSize: '11px', color: t.textSecundar, marginTop: '6px' }}>
              Cu cât ești mai specific, cu atât primești cotații mai precise.
            </div>
          </div>
        </FormSection>

        {/* Eroare */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
            color: '#ef4444', fontSize: '13px', fontWeight: '600',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ paddingTop: '8px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: '12px',
              padding: '15px 28px', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(37,99,235,0.35)',
              transition: 'all 0.15s',
            }}
          >
            {loading ? (
              <>
                <Loader size={17} style={{ animation: 'spin 1s linear infinite' }} />
                Se publică...
              </>
            ) : (
              <>
                <PlusCircle size={17} />
                Publică Anunțul pe Platformă
                <ChevronRight size={16} />
              </>
            )}
          </button>
          <p style={{ fontSize: '12px', color: t.textSecundar, marginTop: '10px' }}>
            Anunțul va fi vizibil imediat tuturor subcontractorilor verificați.
          </p>
        </div>

      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FormSection({ label, t, children }) {
  return (
    <div style={{
      backgroundColor: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: '16px', overflow: 'hidden', marginBottom: '16px',
    }}>
      <div style={{
        padding: '14px 24px', borderBottom: `1px solid ${t.border}`,
        fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
        letterSpacing: '1px', color: t.textSecundar, backgroundColor: t.bgInput,
      }}>
        {label}
      </div>
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {children}
      </div>
    </div>
  );
}
