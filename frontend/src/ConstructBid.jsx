import React, { useState, useEffect } from 'react';
import { 
  Building2, Briefcase, Trophy, BarChart3, Clock, 
  MapPin, CircleDollarSign, Users, LogOut, Bell, ShieldCheck, Plus, ExternalLink
} from 'lucide-react';

export default function ConstructBid({ user, onLogout }) {
  const [proiecte, setProiecte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState(null);

  // Preluăm proiectele din baza de date în mod real
  useEffect(() => {
    const incarcaProiecte = async () => {
      try {
        const token = localStorage.getItem('token');
        const raspuns = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!raspuns.ok) throw new Error('Nu am putut prelua proiectele active.');
        const date = await raspuns.json();
        setProiecte(date);
      } catch (err) {
        setEroare(err.message);
        // Fallback la date simulate în caz că API-ul nu e complet pornit
        setProiecte([
          { _id: '1', titlu: 'Construcție Complex Rezidențial P+6 Berceni', locatie: 'București, Sector 4', buget: '4.200.000 RON', oferte: 3, zile: 96, urgent: true, descriere: 'Execuție structură din beton armat și zidărie exterioară pentru 3 blocuri.' },
          { _id: '2', titlu: 'Reabilitare Termică Bloc 14 Scări', locatie: 'Cluj-Napoca', buget: '890.000 RON', oferte: 2, zile: 51, urgent: false, descriere: 'Lucrări de izolație exterioară cu vată bazaltică de 15cm.' },
          { _id: '3', titlu: 'Hală Industrială Depozitare 5000 mp', locatie: 'Ploiești, Prahova', buget: '2.750.000 RON', oferte: 1, zile: 141, urgent: false, descriere: 'Montaj structură metalică prefabricată și închideri panouri sandwich.' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    incarcaProiecte();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0f172a' }}>
      
      {/* HEADER ALB MINIMALIST */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
            <Building2 size={22} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>Construct<span style={{ color: '#2563eb' }}>Bid</span></span>
          <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '30px', marginLeft: '12px', textTransform: 'uppercase' }}>
            {user.rol}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user.rol === 'dezvoltator' && (
            <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s' }}>
              <Plus size={18} /> Publică Șantier Nou
            </button>
          )}

          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px', borderRadius: '50%', backgroundColor: '#f8fafc' }}>
            <Bell size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: '800', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
              {user.nume ? user.nume.charAt(0).toUpperCase() : 'C'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{user.nume || 'Companie'}</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Firmă Verificată ✓</span>
            </div>
          </div>

          <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '12px', backgroundColor: '#fef2f2', transition: 'all 0.2s' }} title="Deconectare Securizată">
            <LogOut size={18} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </header>

      {/* BANNER INTRODUCTIV */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '50px 40px 130px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Panou de Comandă — {user.nume}</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            {user.rol === 'dezvoltator' 
              ? 'Lansează caiete de sarcini, evaluează ofertele financiare depuse și generează contracte securizate.'
              : 'Răsfoiește cererile de ofertă deschise, descarcă documentația tehnică și licitează strategic.'}
          </p>
        </div>
      </div>

      {/* SECTIUNEA PRINCIPALA */}
      <div style={{ maxWidth: '2000px', margin: '-80px auto 40px auto', padding: '0 40px', boxSizing: 'border-box' }}>
        
        {/* CARDS STATISTICI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { label: 'ȘANTIERE ACTIVE', val: proiecte.length, icon: <BarChart3 size={22} />, bg: '#eff6ff', color: '#2563eb' },
            { label: 'CONTRACTE SEMNATE', val: '2', icon: <Trophy size={22} />, bg: '#ecfdf5', color: '#10b981' },
            { label: 'VOLUM TOTAL LICITAȚII', val: '15.1M RON', icon: <CircleDollarSign size={22} />, bg: '#fdf2f8', color: '#db2777' },
            { label: 'TERMENE URGENTE', val: proiecte.filter(p => p.urgent).length, icon: <Clock size={22} />, bg: '#fff7ed', color: '#ea580c' }
          ].map((card, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ backgroundColor: card.bg, color: card.color, padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center' }}>{card.icon}</div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>{card.label}</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{card.val}</span>
              </div>
            </div>
          ))}
        </div>

        {/* REZULTATE ȘI LISTĂ */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* LISTA DE SANANTIERE */}
          <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', padding: '30px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>Șantiere Recomandate spre Ofertare</h3>
              <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Vezi Piața Completă →</span>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Se încarcă șantierele active...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {proiecte.map((proiect) => (
                  <div key={proiect._id} style={{ padding: '24px', border: '1px solid #f1f5f9', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div style={{ maxWidth: '75%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#0f172a' }}>{proiect.titlu}</h4>
                        {proiect.urgent && <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px' }}>URGENT</span>}
                      </div>
                      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.5' }}>{proiect.descriere}</p>
                      
                      <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '13px', fontWeight: '500', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {proiect.locatie}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: '700' }}><CircleDollarSign size={14} /> {proiect.buget}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {proiect.oferte} oferte depuse</span>
                      </div>
                    </div>

                    <button style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      {user.rol === 'subcontractor' ? 'Licitează' : 'Vezi Management'} <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SIDEBAR METRICE INTELIGENTE */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Garanția Plăților B2B</h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Toate bugetele afișate de dezvoltatori sunt supuse verificării lichidităților bancare. Subcontractorii au garanția decontării etapizate a situațiilor de lucrări depuse.
              </p>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 30px rgba(15,23,42,0.15)' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', tracking: '1px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>MODUL EXPERT</span>
              <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0', lineHeight: '1.3' }}>Ai nevoie de asistență la întocmirea devizului?</h4>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>
                Consultanții noștri tehnici te pot ajuta să configurezi listele de cantități și materiale conform normativelor europene.
              </p>
              <button style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Contactează un Expert
              </button>
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
}