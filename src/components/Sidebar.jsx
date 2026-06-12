const NAV_ITEMS = [
  { id: 'explore', icon: '✦', label: '探索モード' },
  { id: 'store', icon: '⊞', label: '店舗モード' },
  { id: 'favorite', icon: '♡', label: 'お気に入り' },
  { id: 'history', icon: '◷', label: '閲覧履歴' },
  { id: 'recommend', icon: '◈', label: 'おすすめ' },
  { id: 'collection', icon: '▣', label: 'コレクション' },
  { id: 'gift', icon: '◎', label: 'ギフト・贈り物' },
  { id: 'delivery', icon: '⟶', label: '届くまでの物語' },
];

export function Sidebar({ activePage, favoritesCount, onNavigate, onReset }) {
  return (
    <aside
      style={{
        width: 228,
        height: '100vh',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(168,85,247,0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '2px 0 20px rgba(0,0,0,0.05)',
        zIndex: 90,
      }}
    >
      {/* ロゴ */}
      <div style={{ padding: '28px 22px 20px', borderBottom: '1px solid rgba(168,85,247,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Discoverino
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#c084fc', letterSpacing: '0.06em', paddingLeft: 36 }}>
          見つける楽しさが、買い物になる。
        </div>
      </div>

      {/* ナビゲーション */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px 10px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const isFav = item.id === 'favorite';
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                marginBottom: 2,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(124,58,237,0.06))'
                  : 'transparent',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(168,85,247,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    background: 'linear-gradient(180deg, #a855f7, #7c3aed)',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 15,
                  color: isActive ? '#a855f7' : '#999',
                  fontWeight: isActive ? 700 : 400,
                  width: 18,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#7c3aed' : '#4a4a5a',
                }}
              >
                {item.label}
              </span>
              {isFav && favoritesCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#e91e63',
                    background: '#fce4ec',
                    borderRadius: 10,
                    padding: '2px 7px',
                  }}
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ユーザー + リセット */}
      <div style={{ padding: '14px 14px 22px' }}>
        {/* ユーザー情報 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'rgba(168,85,247,0.04)',
            borderRadius: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=68&h=68&fit=crop&q=80"
              alt="user"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>Haruka</div>
          </div>
        </div>

        {/* リセットボタン */}
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '11px',
            background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: '0 4px 16px rgba(168,85,247,0.4)',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ↺ パーソナライズをリセット
        </button>
      </div>
    </aside>
  );
}
