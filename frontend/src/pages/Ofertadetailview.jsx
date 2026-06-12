import React, { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, XCircle, MessageSquare,
  Building2, Banknote, Clock, FileText, MapPin,
  Layers, Wrench, Zap, Paintbrush2, AlertTriangle,
  Phone, Mail, Hash, MapPinned, Paperclip, Download
} from 'lucide-react';

const CATEGORIE_CONFIG = {
  'Structuri':  { icon: <Layers size={14} />,      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  'Instalații': { icon: <Wrench size={14} />,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  'Electrice':  { icon: <Zap size={14} />,          color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  'Finisaje':   { icon: <Paintbrush2 size={14} />, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
};

export default function OfertaDetailView({
  oferta,
  proiect,
  indexOferta,
  t,
  onBack,
  onAccepta,
  onRefuza,
  deschideChat,
  dezvoltator,   // { nume, email, telefon, cui, judet } — datele dezvoltatorului
}) {
  const [confirmare, setConformare] = useState(null); // 'accepta' | 'refuza' | null

  if (!oferta || !proiect) return null;

  const catCfg = CATEGORIE_CONFIG[proiect.categorie] || {
    icon: <Layers size={14} />, color: '#6b7280', bg: 'rgba(107,114,128,0.12)',
  };

  const locatie = proiect.judet && proiect.oras
    ? `${proiect.oras}, ${proiect.judet}`
    : proiect.locatie || 'Nespecificat';

  const statusCurent = oferta.status || 'asteptare';
  const esteFinalizata = statusCurent === 'acceptata' || statusCurent === 'respinsa';

  const handleAccepta = () => {
    onAccepta(proiect.id, indexOferta);
    setConformare(null);
  };

  const handleRefuza = () => {
    onRefuza(proiect.id, indexOferta);
    setConformare(null);
  };

  const InfoRow = ({ icon, label, value, valueColor }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
        {icon} {label}
      </div>
      <span style={{ fontWeight: '700', fontSize: '14px', color: valueColor || t.textPrincipal }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

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
        <ArrowLeft size={15} /> Înapoi la proiect
      </button>

      {/* ── HEADER OFERTĂ ── */}
      <div style={{
        backgroundColor: t.bgCard, borderRadius: '20px',
        border: `1px solid ${t.border}`, overflow: 'hidden',
        boxShadow: `0 4px 24px ${t.shadow}`,
      }}>
        {/* Accent bar */}
        <div style={{
          height: '4px',
          background: statusCurent === 'acceptata'
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : statusCurent === 'respinsa'
            ? 'linear-gradient(90deg, #ef4444, #f87171)'
            : 'linear-gradient(90deg, #eab308, #fbbf24)',
        }} />

        <div style={{ padding: '32px' }}>
          {/* Firma + status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: t.textSecundar, marginBottom: '6px' }}>
                Cotație de la
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="#2563eb" />
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '850', color: t.textPrincipal, margin: 0 }}>
                  {oferta.firma}
                </h1>
              </div>
            </div>
            <StatusBadgeMare status={statusCurent} />
          </div>

          {/* Date ofertă */}
          <div style={{ borderTop: `1px solid ${t.border}` }}>
            <InfoRow
              icon={<Banknote size={15} />}
              label="Valoare Ofertată"
              value={`${Number(oferta.pret).toLocaleString()} EUR`}
              valueColor="#10b981"
            />
            <InfoRow
              icon={<Clock size={15} />}
              label="Durată Execuție"
              value={`${oferta.zile} zile`}
            />
          </div>
        </div>
      </div>

      {/* ── MESAJ OFERTANT ── */}
      {oferta.mesaj && (
        <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
          <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={13} /> Mesajul Subcontractorului
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ color: t.textPrincipal, fontSize: '14px', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
              "{oferta.mesaj}"
            </p>
          </div>
        </div>
      )}

      {/* ── DOCUMENTE ATAȘATE ── */}
      {oferta.fisiere && oferta.fisiere.length > 0 && (
        <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
          <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Paperclip size={13} /> Documente Atașate ({oferta.fisiere.length})
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {oferta.fisiere.map((f, i) => (
              <a
                key={i}
                href={`http://localhost:5000/uploads/${f.numeFisier}`}
                target="_blank"
                rel="noopener noreferrer"
                download={f.nume}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '10px',
                  backgroundColor: t.bgInput, border: `1px solid ${t.border}`,
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.backgroundColor = t.bgInput; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={16} color="#3b82f6" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: t.textPrincipal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.nume}
                    </div>
                    <div style={{ fontSize: '11px', color: t.textSecundar }}>
                      {f.tip || 'Document'}
                    </div>
                  </div>
                </div>
                <Download size={15} color="#3b82f6" style={{ flexShrink: 0, marginLeft: '12px' }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTEXT PROIECT ── */}
      <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}` }}>
        <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgInput, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: t.textSecundar, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={13} /> Proiect Asociat
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: t.textPrincipal, marginBottom: '6px' }}>{proiect.titlu}</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: t.textSecundar }}>
                  <MapPin size={12} color="#ef4444" /> {locatie}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', backgroundColor: catCfg.bg, color: catCfg.color }}>
                  {catCfg.icon} {proiect.categorie}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: t.textSecundar, fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Buget Maxim</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>
                {proiect.bugetMax ? Number(proiect.bugetMax).toLocaleString() : '–'} EUR
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACȚIUNI ── */}
      {!esteFinalizata && (
        <div style={{ backgroundColor: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, padding: '24px', boxShadow: `0 2px 12px ${t.shadow}` }}>

          {/* Modal confirmare */}
          {confirmare && (
            <div style={{
              marginBottom: '20px', padding: '16px 20px', borderRadius: '12px',
              backgroundColor: confirmare === 'accepta' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${confirmare === 'accepta' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: confirmare === 'accepta' ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '14px' }}>
                <AlertTriangle size={16} />
                {confirmare === 'accepta'
                  ? 'Confirmi acceptarea acestei cotații? Restul ofertelor vor fi marcate automat ca respinse.'
                  : 'Confirmi respingerea acestei cotații?'
                }
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={confirmare === 'accepta' ? handleAccepta : handleRefuza}
                  style={{
                    padding: '8px 20px', borderRadius: '8px', border: 'none',
                    backgroundColor: confirmare === 'accepta' ? '#10b981' : '#ef4444',
                    color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Da, confirmă
                </button>
                <button
                  onClick={() => setConformare(null)}
                  style={{ padding: '8px 20px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: 'transparent', color: t.textSecundar, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  Anulează
                </button>
              </div>
            </div>
          )}

          <div style={{ fontSize: '12px', color: t.textSecundar, marginBottom: '14px', fontWeight: '600' }}>
            Alege o acțiune pentru această cotație:
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

            {/* Acceptă */}
            <button
              onClick={() => setConformare('accepta')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <CheckCircle2 size={16} /> Acceptă Cotația
            </button>

            {/* Discută */}
            <button
              onClick={deschideChat}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '10px',
                border: '1.5px solid rgba(37,99,235,0.4)',
                backgroundColor: 'rgba(37,99,235,0.08)',
                color: '#2563eb', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.14)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.08)'}
            >
              <MessageSquare size={16} /> Discută în Chat
            </button>

            {/* Refuză */}
            <button
              onClick={() => setConformare('refuza')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '10px',
                border: '1.5px solid rgba(239,68,68,0.35)',
                backgroundColor: 'rgba(239,68,68,0.06)',
                color: '#ef4444', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'}
            >
              <XCircle size={16} /> Refuză
            </button>
          </div>
        </div>
      )}

      {/* Mesaj dacă e deja finalizată */}
      {esteFinalizata && (
        <div style={{
          padding: '18px 24px', borderRadius: '12px',
          backgroundColor: statusCurent === 'acceptata' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${statusCurent === 'acceptata' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          display: 'flex', alignItems: 'center', gap: '10px',
          color: statusCurent === 'acceptata' ? '#10b981' : '#ef4444',
          fontWeight: '700', fontSize: '14px',
        }}>
          {statusCurent === 'acceptata'
            ? <><CheckCircle2 size={18} /> Această cotație a fost acceptată.</>
            : <><XCircle size={18} /> Această cotație a fost respinsă.</>
          }
        </div>
      )}

      {/* ── DATE DE CONTACT DEZVOLTATOR (vizibile după acceptare) ── */}
      {statusCurent === 'acceptata' && dezvoltator && (
        <div style={{
          backgroundColor: t.bgCard, borderRadius: '16px',
          border: '1px solid rgba(16,185,129,0.3)',
          overflow: 'hidden', boxShadow: `0 2px 12px ${t.shadow}`,
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 24px', borderBottom: `1px solid ${t.border}`,
            backgroundColor: 'rgba(16,185,129,0.06)',
            fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
            letterSpacing: '1px', color: '#10b981',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Building2 size={13} /> Date de Contact — Beneficiar
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0px' }}>

            {/* Nume firmă */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
                <Building2 size={15} /> Companie
              </div>
              <span style={{ fontWeight: '800', fontSize: '14px', color: t.textPrincipal }}>{dezvoltator.nume || '—'}</span>
            </div>

            {/* Email */}
            {dezvoltator.email && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
                  <Mail size={15} /> Email
                </div>
                <a
                  href={`mailto:${dezvoltator.email}`}
                  style={{ fontWeight: '700', fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}
                >
                  {dezvoltator.email}
                </a>
              </div>
            )}

            {/* Telefon */}
            {dezvoltator.telefon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
                  <Phone size={15} /> Telefon
                </div>
                <a
                  href={`tel:${dezvoltator.telefon}`}
                  style={{ fontWeight: '700', fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}
                >
                  {dezvoltator.telefon}
                </a>
              </div>
            )}

            {/* CUI */}
            {dezvoltator.cui && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
                  <Hash size={15} /> CUI
                </div>
                <span style={{ fontWeight: '700', fontSize: '14px', color: t.textPrincipal }}>{dezvoltator.cui}</span>
              </div>
            )}

            {/* Județ */}
            {dezvoltator.judet && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecundar, fontSize: '13px' }}>
                  <MapPinned size={15} /> Județ
                </div>
                <span style={{ fontWeight: '700', fontSize: '14px', color: t.textPrincipal, textTransform: 'uppercase' }}>{dezvoltator.judet}</span>
              </div>
            )}

          </div>

          {/* Footer CTA chat */}
          <div style={{
            padding: '16px 24px', borderTop: `1px solid ${t.border}`,
            backgroundColor: t.bgInput, display: 'flex', justifyContent: 'flex-end',
          }}>
            <button
              onClick={deschideChat}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px',
                border: '1.5px solid rgba(37,99,235,0.4)',
                backgroundColor: 'rgba(37,99,235,0.08)',
                color: '#2563eb', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.14)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.08)'}
            >
              <MessageSquare size={15} /> Continuă discuția în Chat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function StatusBadgeMare({ status }) {
  const cfg = {
    acceptata: { bg: 'rgba(16,185,129,0.12)', color: '#10b981',  border: 'rgba(16,185,129,0.25)', label: '✓ Acceptată'  },
    respinsa:  { bg: 'rgba(239,68,68,0.10)',  color: '#ef4444',  border: 'rgba(239,68,68,0.25)',  label: '✕ Respinsă'   },
    asteptare: { bg: 'rgba(234,179,8,0.10)',  color: '#eab308',  border: 'rgba(234,179,8,0.25)',  label: '⏳ În analiză' },
  }[status || 'asteptare'];
  return (
    <span style={{
      fontSize: '13px', fontWeight: '800', padding: '7px 16px',
      borderRadius: '20px', backgroundColor: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}