export function Header({ activePage, searchQuery, budget, onSearch, onNavigate }) {
  return (
    <header
      style={{
        height: 64,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(168,85,247,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 24px',
        flexShrink: 0,
        zIndex: 70,
      }}
    >
      {/* サーチバー */}
      <div style={{ flex: 1, position: 'relative', maxWidth: 480 }}>
        <svg
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            pointerEvents: 'none',
            color: '#aaa',
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="気になるアイテムを探してみよう"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px 10px 40px',
            border: '1.5px solid rgba(168,85,247,0.15)',
            borderRadius: 28,
            fontSize: 13,
            background: 'rgba(250,247,255,0.95)',
            outline: 'none',
            fontFamily: 'inherit',
            color: '#333',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 8px rgba(168,85,247,0.05)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#a855f7';
            e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(168,85,247,0.15)';
            e.target.style.boxShadow = '0 2px 8px rgba(168,85,247,0.05)';
          }}
        />
      </div>

      {/* モードボタン */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(245,240,255,0.8)',
          borderRadius: 14,
          padding: 3,
          gap: 2,
          border: '1px solid rgba(168,85,247,0.12)',
        }}
      >
        {[
          { id: 'explore', label: '採索モード', icon: '✦' },
          { id: 'store', label: '店舗モード', icon: '⊞' },
        ].map(({ id, label, icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '7px 16px',
                borderRadius: 11,
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                  : 'transparent',
                color: isActive ? '#fff' : '#9c7ec4',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(168,85,247,0.3)' : 'none',
              }}
            >
              <span style={{ fontSize: 11 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* 通知ベル */}
      <button
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1.5px solid rgba(168,85,247,0.15)',
          background: 'rgba(250,247,255,0.9)',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.15)')}
      >
        🔔
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            background: '#e91e63',
            borderRadius: '50%',
            border: '1.5px solid white',
          }}
        />
      </button>
    </header>
  );
}
