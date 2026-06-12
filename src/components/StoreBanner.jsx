import { useRef } from 'react';
import { stores } from '../data/stores';

const DOUBLE_TAP_MS = 350;

export function StoreBanner({ onEnterStore, onShowAllStores, isMobile }) {
  const scrollRef = useRef(null);

  return (
    <div
      style={{
        flexShrink: 0,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(168,85,247,0.08)',
        padding: isMobile ? '12px 16px 14px' : '14px 22px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#4a4a5a', letterSpacing: '0.04em' }}>
          おすすめのストア
        </span>
        <span
          onClick={onShowAllStores}
          style={{ fontSize: 11, color: '#a855f7', cursor: 'pointer', fontWeight: 600 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          すべて見る →
        </span>
      </div>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: 2,
        }}
      >
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onEnterStore={onEnterStore} />
        ))}
      </div>
    </div>
  );
}

function StoreCard({ store, onEnterStore }) {
  const lastClickTime = useRef(0);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < DOUBLE_TAP_MS) {
      onEnterStore?.(store);
    }
    lastClickTime.current = now;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        flexShrink: 0,
        width: 160,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
    >
      {/* 背景画像 */}
      <div style={{ height: 88, position: 'relative', overflow: 'hidden' }}>
        {store.bgImage ? (
          <img
            src={store.bgImage}
            alt={store.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              e.target.parentElement.style.background = store.gradient;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: store.gradient }} />
        )}

        {/* 暗いオーバーレイ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          }}
        />

        {/* ブランド名・ボタン */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            right: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {store.name}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onEnterStore?.(store); }}
            style={{
              padding: '4px 10px',
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: 20,
              color: '#333',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              backdropFilter: 'blur(4px)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            入店する
          </button>
        </div>

        {/* ダブルタップヒント */}
        <div style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          borderRadius: 20,
          padding: '2px 8px',
          fontSize: 8.5,
          color: '#fff',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          ダブルタップで入店
        </div>
      </div>
    </div>
  );
}
