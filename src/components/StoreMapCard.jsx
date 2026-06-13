import { useState, useRef } from 'react';

const DOUBLE_TAP_MS = 350;

export function StoreMapCard({ store, isSelected, isFavorite, onSelect, onEnter, onToggleFavorite, wasPinchRecently }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lastClickTime = useRef(0);

  const handleClick = (e) => {
    e.stopPropagation();
    if (wasPinchRecently?.()) return;
    const now = Date.now();
    if (now - lastClickTime.current < DOUBLE_TAP_MS) {
      onEnter(store);
    } else {
      onSelect(store);
    }
    lastClickTime.current = now;
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (wasPinchRecently?.()) return;
    onToggleFavorite(store.id);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: store.x,
        top: store.y,
        width: 188,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.07 : hovered ? 1.04 : 1})`,
        transition: 'transform 0.22s ease, box-shadow 0.2s',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: isSelected ? 10 : hovered ? 5 : 1,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: isSelected
            ? '0 16px 48px rgba(168,85,247,0.32), 0 0 0 2.5px rgba(168,85,247,0.7)'
            : hovered
            ? '0 16px 40px rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.09)'
            : '0 8px 24px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.05)',
          border: isSelected ? '2px solid rgba(168,85,247,0.5)' : '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* 店舗画像エリア */}
        <div style={{ height: 118, position: 'relative', overflow: 'hidden', background: store.gradient }}>
          {store.bgImage && !imgError ? (
            <img
              src={store.bgImage.replace('w=300&h=160', 'w=376&h=236')}
              alt={store.name}
              onError={() => setImgError(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.35s ease',
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: store.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
              {store.emoji}
            </div>
          )}

          {/* 暗いオーバーレイ */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

          {/* ハートボタン */}
          <button
            onClick={handleFav}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: isFavorite ? 'rgba(233,30,99,0.9)' : 'rgba(255,255,255,0.9)',
              border: 'none', borderRadius: '50%', width: 28, height: 28,
              cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          {/* ホバー時のダブルタップヒント */}
          {hovered && (
            <div
              style={{
                position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                borderRadius: 20, padding: '3px 10px',
                fontSize: 9.5, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              ダブルタップで入店
            </div>
          )}
        </div>

        {/* テキストエリア */}
        <div style={{ padding: '9px 12px 11px', background: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>
            {store.name}
          </div>
          <div style={{ fontSize: 10, color: '#999', fontWeight: 500 }}>
            {store.tagline}
          </div>
        </div>
      </div>
    </div>
  );
}
