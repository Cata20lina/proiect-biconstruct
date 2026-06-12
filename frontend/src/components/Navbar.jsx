import React from 'react';
import { Building2, HardHat, PlusCircle, MessageSquare, LogOut, Bell, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, modTema, onToggleTema, t, esteSubcontractor }) {
  const allMenuItems = [
    { id: 'index', text: 'Acasă', icon: <Building2 size={16} />, always: true },
    { id: 'santiere', text: 'Proiecte Disponibile', icon: <HardHat size={16} />, always: true },
    { id: 'adauga_anunt', text: 'Adaugă Anunț', icon: <PlusCircle size={16} />, onlyDezvolator: true },
    { id: 'servicii', text: 'Serviciile Mele', icon: <PlusCircle size={16} />, onlySubcontractor: true },
    { id: 'chat', text: 'Mesaje', icon: <MessageSquare size={16} />, always: true }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.always) return true;
    if (item.onlySubcontractor) return esteSubcontractor;
    if (item.onlyDezvolator) return !esteSubcontractor;
    return true;
  });

  return (
    <header style={{ width: '100%', backgroundColor: t.bgCard, borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.25s ease', boxShadow: `0 2px 10px ${t.shadow}` }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('index')}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
            <Building2 size={18} />
          </div>
          <span style={{ fontSize: '19px', fontWeight: '800', color: t.textPrincipal, letterSpacing: '-0.5px' }}>
            Construct<span style={{ color: '#3b82f6' }}>Bid</span>
          </span>
        </div>

        {/* Navigare */}
        <nav style={{ display: 'flex', gap: '6px', height: '100%', alignItems: 'center' }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent', color: isActive ? '#3b82f6' : t.textSecundar, fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', outline: 'none' }}>
                {item.icon}
                {item.text}
              </button>
            );
          })}
        </nav>

        {/* Actiuni Dreapta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          
          <button onClick={onToggleTema} style={{ background: 'none', border: 'none', color: t.textSecundar, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', backgroundColor: modTema === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', transition: 'all 0.2s' }} title={modTema === 'dark' ? "Mod Luminos" : "Mod Întunecat"}>
            {modTema === 'dark' ? <Sun size={18} style={{ color: '#eab308' }} /> : <Moon size={18} style={{ color: '#475569' }} />}
          </button>
<button 
  onClick={() => setActiveTab('notificari')}
  style={{ 
    background: 'none', 
    border: 'none', 
    color: activeTab === 'notificari' ? '#3b82f6' : t.textSecundar,
    cursor: 'pointer',
    position: 'relative',
    padding: '8px'
  }}
>
  <Bell size={20} />
  {/* Indicator de notificare necitită (opțional) */}
  <span style={{ 
    position: 'absolute', top: '4px', right: '4px', 
    width: '8px', height: '8px', backgroundColor: '#ef4444', 
    borderRadius: '50%' 
  }}></span>
</button>

          {/* Zona de Profil */}
          <div 
            onClick={() => setActiveTab('profil')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '6px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'profil' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              borderLeft: `1px solid ${t.border}`,
              transition: 'all 0.2s'
            }}
            title="Vezi Dashboard & Profil"
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: activeTab === 'profil' ? '#3b82f6' : t.textPrincipal, fontSize: '13px', fontWeight: '700', lineHeight: '1.2' }}>
                {user?.nume || 'Compania Ta'}
              </div>
              <span style={{ color: t.textSecundar, fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
                {user?.rol}
              </span>
            </div>
            
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
              {(user?.nume || 'C').charAt(0).toUpperCase()}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}