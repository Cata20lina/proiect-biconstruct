import React from 'react';
import { Building2, Mail, ShieldCheck, Briefcase, MapPin, Hash, ChevronRight, Star } from 'lucide-react';

export default function ProfilView({ user, t, proiecte = [], setActiveTab }) {
  const nrProiecte = proiecte.filter(p => p.dezvoltator === user?.nume).length;
  const nrOferte = proiecte.reduce((acc, p) => acc + (p.oferte?.length || 0), 0);
  const esteSubcontractor = user?.rol === 'SUBCONTRACTOR';

  const campProfil = [
    { icon: <Building2 size={16} />, label: 'Companie', valoare: user?.nume },
    { icon: <Hash size={16} />, label: 'CUI', valoare: user?.cui || 'RO3421590' },
    { icon: <Mail size={16} />, label: 'Email', valoare: user?.email || 'Nespecificat' },
    { icon: <MapPin size={16} />, label: 'Județ Registru', valoare: user?.judet || 'București' },
  ];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Card principal profil */}
      <div style={{
        backgroundColor: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {/* Banner gradient */}
        <div style={{
          height: '90px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: '-28px', left: '32px',
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${t.bgCard}`,
            fontSize: '22px', fontWeight: '900', color: '#fff',
          }}>
            {(user?.nume || 'C').charAt(0)}
          </div>
        </div>

        <div style={{ padding: '44px 32px 32px' }}>
          {/* Nume + badge-uri */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: t.textPrincipal, margin: '0 0 6px' }}>{user?.nume}</h2>
              <p style={{ fontSize: '13px', color: t.textSecundar, margin: 0 }}>Entitate juridică înregistrată pe platformă</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px',
                backgroundColor: esteSubcontractor ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)',
                color: esteSubcontractor ? '#3b82f6' : '#a855f7',
                padding: '5px 12px', borderRadius: '8px',
                textTransform: 'uppercase',
              }}>
                {user?.rol}
              </span>
              <span style={{
                fontSize: '11px', fontWeight: '800',
                backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981',
                padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <ShieldCheck size={12} /> VERIFICAT
              </span>
            </div>
          </div>

          {/* Grid câmpuri */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {campProfil.map((camp, i) => (
              <div key={i} style={{
                backgroundColor: t.bgInput,
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: t.textSecundar, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  <span style={{ color: '#2563eb' }}>{camp.icon}</span>
                  {camp.label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: t.textPrincipal }}>{camp.valoare}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistici rapide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { valoare: nrProiecte, label: esteSubcontractor ? 'Proiecte urmărite' : 'Proiecte publicate', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { valoare: nrOferte, label: 'Oferte primite', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { valoare: '4.8', label: 'Scor de încredere', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', suffix: <Star size={14} style={{ marginLeft: '3px' }} /> },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: '16px',
            padding: '22px 24px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: t.textSecundar, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '30px', fontWeight: '900', color: s.color, display: 'flex', alignItems: 'center' }}>
              {s.valoare}{s.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Banner status cont */}
      <div style={{
        backgroundColor: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: t.textPrincipal }}>Cont activ și verificat</div>
            <div style={{ fontSize: '13px', color: t.textSecundar }}>Eligibil pentru toate licitațiile B2B de pe platformă.</div>
          </div>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('santiere')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '10px 18px', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <Briefcase size={14} /> Vezi Licitații <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
