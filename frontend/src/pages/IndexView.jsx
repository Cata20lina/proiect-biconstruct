import React from 'react';
import { LayoutDashboard, ShieldCheck, MessageSquare, Zap, ArrowRight, TrendingUp, Users, FileCheck, Building2, ChevronRight } from 'lucide-react';

export default function IndexView({ t, setActiveTab }) {


  const caracteristici = [
    {
      icon: <LayoutDashboard size={22} />,
      titlu: "Dashboard Centralizat",
      desc: "Monitorizează toate șantierele și licitațiile active într-un singur loc, cu filtre avansate pe județ și categorie.",
      accent: '#2563eb',
      bg: 'rgba(37,99,235,0.08)',
    },
    {
      icon: <MessageSquare size={22} />,
      titlu: "Chat B2B Integrat",
      desc: "Negociezi direct termenii și prețurile cu furnizorii, fără intermediari și fără comisioane ascunse.",
      accent: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
    },
    {
      icon: <Zap size={22} />,
      titlu: "Notificări în Timp Real",
      desc: "Primești alerte imediate pentru cotații noi, actualizări de proiect și mesaje de la parteneri.",
      accent: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
    },
  ];

  const pasi = [
    { nr: '01', titlu: 'Creezi un anunț', desc: 'Publici detaliile proiectului — categorie, buget, termen și locație.' },
    { nr: '02', titlu: 'Primești cotații', desc: 'Subcontractorii verificați licitează direct pe platforma ta.' },
    { nr: '03', titlu: 'Negociezi și alegi', desc: 'Compari ofertele, chați cu firmele și semnezi cu cel mai bun.' },
  ];


  const isDark = t.bgCrap === '#090e1a';

  const cardStyle = {
    backgroundColor: t.bgCard,
    border: `1px solid ${t.border}`,
    borderRadius: '16px',
    padding: '28px',
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <span style={{
          display: 'inline-block',
          backgroundColor: 'rgba(37,99,235,0.1)',
          color: '#2563eb',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: '999px',
          marginBottom: '20px',
          border: '1px solid rgba(37,99,235,0.2)',
        }}>
          Platformă B2B pentru Construcții
        </span>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: '900',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: t.textPrincipal,
          margin: '0 auto 20px',
          maxWidth: '720px',
        }}>
          Licitații, parteneri și<br />
          <span style={{
            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            proiecte — centralizat.
          </span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: t.textSecundar,
          maxWidth: '560px',
          margin: '0 auto 36px',
          lineHeight: '1.7',
        }}>
          Simplifică procesul de achiziție pentru orice șantier. De la anunț la contract, totul într-un singur loc.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab && setActiveTab('santiere')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '14px 24px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Vezi Șantierele Active <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('anunt')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'transparent', color: t.textPrincipal,
              border: `1px solid ${t.border}`, borderRadius: '10px',
              padding: '14px 24px', fontSize: '15px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Publică un Anunț
          </button>
        </div>
      </div>

      {/* ── Propunere de valoare ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        backgroundColor: t.border,
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '72px',
        border: `1px solid ${t.border}`,
      }}>
        {[
          { valoare: 'Gratuit', eticheta: 'În perioada de lansare', icon: <FileCheck size={18} />, sub: 'Publică primele anunțuri fără costuri' },
          { valoare: 'Rapid', eticheta: 'Proces simplificat', icon: <Users size={18} />, sub: 'De la anunț la oferte în ore, nu săptămâni' },
          { valoare: 'Sigur', eticheta: 'Firme verificate', icon: <TrendingUp size={18} />, sub: 'Parteneri validați înainte de publicare' },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: t.bgCard,
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            <div style={{ color: '#2563eb', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: t.textPrincipal, letterSpacing: '-0.5px' }}>{s.valoare}</div>
            <div style={{ fontSize: '13px', color: t.textSecundar, marginTop: '4px', fontWeight: '600' }}>{s.eticheta}</div>
            <div style={{ fontSize: '12px', color: t.textSecundar, marginTop: '6px', opacity: 0.8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Caracteristici ── */}
      <div style={{ marginBottom: '72px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>De ce platforma noastră</p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: t.textPrincipal, margin: 0 }}>Tot ce ai nevoie, nimic în plus</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {caracteristici.map((item, idx) => (
            <div key={idx} style={{
              ...cardStyle,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: item.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.accent,
                marginBottom: '18px',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, marginBottom: '8px' }}>{item.titlu}</h3>
              <p style={{ fontSize: '14px', color: t.textSecundar, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cum funcționează ── */}
      <div style={{ marginBottom: '72px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Procesul</p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: t.textPrincipal, margin: 0 }}>De la anunț la contract în 3 pași</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {pasi.map((pas, i) => (
            <div key={i} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: '-12px', right: '16px',
                fontSize: '72px', fontWeight: '900', color: 'rgba(37,99,235,0.06)',
                lineHeight: '1', userSelect: 'none', pointerEvents: 'none',
              }}>{pas.nr}</div>
              <div style={{
                fontSize: '13px', fontWeight: '800', color: '#2563eb',
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px',
              }}>Pasul {pas.nr}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.textPrincipal, marginBottom: '8px' }}>{pas.titlu}</h3>
              <p style={{ fontSize: '14px', color: t.textSecundar, lineHeight: '1.6', margin: 0 }}>{pas.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Early adopters ── */}
      <div style={{ marginBottom: '72px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Acces Timpuriu</p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: t.textPrincipal, margin: 0 }}>Fii printre primii pe platformă</h2>
          <p style={{ fontSize: '15px', color: t.textSecundar, marginTop: '12px', maxWidth: '520px', margin: '12px auto 0', lineHeight: '1.6' }}>
            Platforma este în faza de lansare. Primele firme înscrise beneficiază de acces gratuit extins și suport prioritar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px' }}>
          {[
            { titlu: 'Acces gratuit', desc: 'Publică anunțuri și trimite oferte fără niciun cost în perioada de lansare.', icon: '🎯', accent: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
            { titlu: 'Suport direct', desc: 'Echipa noastră te ajută să configurezi profilul și primele proiecte pas cu pas.', icon: '🤝', accent: '#10b981', bg: 'rgba(16,185,129,0.08)' },
            { titlu: 'Influențezi produsul', desc: 'Feedback-ul tău din primele luni modelează direct funcționalitățile viitoare.', icon: '💡', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: item.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
                marginBottom: '18px',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, marginBottom: '8px' }}>{item.titlu}</h3>
              <p style={{ fontSize: '14px', color: t.textSecundar, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Final ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
        borderRadius: '20px',
        padding: '48px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />
        <Building2 size={32} color="rgba(255,255,255,0.4)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>
          Gata să simplificați achizițiile?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: '0 0 28px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          Platforma este disponibilă acum. Înregistrează-ți firma și publică primul anunț gratuit astăzi.
        </p>
        <button
          onClick={() => setActiveTab && setActiveTab('santiere')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fff', color: '#1d4ed8',
            border: 'none', borderRadius: '10px',
            padding: '14px 28px', fontSize: '15px', fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          Explorează Platforma <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}