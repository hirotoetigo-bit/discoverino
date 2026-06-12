const NAV_ITEMS = [
  { id: 'explore', icon: '✦', label: 'ホーム' },
  { id: 'explore', icon: '⊕', label: '探索', key: 'explore2' },
  { id: 'favorite', icon: '♡', label: 'お気に入り' },
  { id: 'store', icon: '⊞', label: '店舗' },
  { id: 'recommend', icon: '◈', label: 'マイページ' },
];

// dedup by unique key
const ITEMS = [
  { id: 'explore', icon: '✦', label: 'ホーム' },
  { id: 'store', icon: '⊞', label: '探索' },
  { id: 'favorite', icon: '♡', label: 'お気に入り' },
  { id: 'recommend', icon: '◈', label: 'おすすめ' },
  { id: 'history', icon: '◷', label: 'マイページ' },
];

export function BottomNav({ activePage, favoritesCount, onNavigate }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(168,85,247,0.1)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 200,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              position: 'relative',
              transition: 'all 0.15s',
              paddingBottom: 4,
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 32,
                height: 2.5,
                background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                borderRadius: '0 0 3px 3px',
              }} />
            )}
            <span style={{
              fontSize: 18,
              color: isActive ? '#a855f7' : '#bbb',
              lineHeight: 1,
              position: 'relative',
            }}>
              {item.icon}
              {item.id === 'favorite' && favoritesCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  minWidth: 14,
                  height: 14,
                  background: '#e91e63',
                  borderRadius: 7,
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}>
                  {favoritesCount}
                </span>
              )}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#7c3aed' : '#bbb',
              letterSpacing: '0.01em',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
