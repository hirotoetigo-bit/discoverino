import { useState } from 'react';
import { products } from '../data/products';

export function StoreDetailPanel({ store, isFavorite, onToggleFavorite, onClose, onEnter }) {
  const [imgError, setImgError] = useState(false);
  const [entered, setEntered] = useState(false);

  const storeProducts = products.filter((p) => p.storeId === store.id);
  const categories = [...new Set(storeProducts.map((p) => p.category))];

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      setEntered(false);
      onEnter(store);
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0,
        width: 340, height: '100vh',
        background: 'rgba(255,255,255,0.99)',
        backdropFilter: 'blur(20px)',
        boxShadow: '-8px 0 48px rgba(168,85,247,0.12)',
        display: 'flex', flexDirection: 'column',
        zIndex: 100,
        animation: 'panelSlideIn 0.28s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <style>{`
        @keyframes panelSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* 店舗画像（トップ全幅） */}
      <div style={{ position: 'relative', width: '100%', height: 200, flexShrink: 0, overflow: 'hidden', background: store.gradient }}>
        {store.bgImage && !imgError ? (
          <img
            src={store.bgImage.replace('w=300&h=160', 'w=680&h=400')}
            alt={store.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
            {store.emoji}
          </div>
        )}
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', fontSize: 15, fontWeight: 700,
            color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          ✕
        </button>
        {/* ハートボタン */}
        <button
          onClick={() => onToggleFavorite(store.id)}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* スクロールコンテンツ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 20px' }}>
        {/* 店舗名・タグライン */}
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', margin: '0 0 4px' }}>
          {store.name}
        </h2>
        <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginBottom: 12 }}>
          {store.tagline}
        </div>

        {/* 説明文 */}
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, margin: '0 0 18px' }}>
          {store.description}
        </p>

        {/* 入店ボタン */}
        <button
          onClick={handleEnter}
          style={{
            width: '100%', padding: '13px',
            background: entered ? 'linear-gradient(135deg, #48bb78, #38a169)' : '#1a1a2e',
            border: 'none', borderRadius: 13,
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: 8, transition: 'all 0.25s',
          }}
          onMouseEnter={(e) => { if (!entered) e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {entered ? '✓ 入店しました！' : `${store.name} に入店する`}
        </button>

        {/* 探索モードで商品を見るボタン */}
        <button
          onClick={() => onEnter(store)}
          style={{
            width: '100%', padding: '11px',
            background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
            borderRadius: 13, color: '#555', fontSize: 12.5, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ⊞ この店の商品を探索モードで見る
        </button>

        {/* 店舗データ */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>
            ストア情報
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: '取扱商品数', value: `${storeProducts.length}件` },
              { label: 'カテゴリ数', value: `${categories.length}種` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(168,85,247,0.05)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed', marginBottom: 2 }}>{value}</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* カテゴリタグ */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a4a5a', marginBottom: 8 }}>取扱カテゴリ</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {categories.map((cat) => (
              <span key={cat} style={{
                fontSize: 11, fontWeight: 600, color: '#7c3aed',
                background: 'rgba(168,85,247,0.08)', borderRadius: 20, padding: '5px 11px',
              }}>
                {cat}
              </span>
            ))}
          </div>

          {/* 商品名プレビュー */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a4a5a', marginBottom: 8 }}>ピックアップ商品</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {storeProducts.slice(0, 4).map((p) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(0,0,0,0.025)', borderRadius: 10, padding: '7px 10px',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f0ff' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{p.emoji}</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#a855f7' }}>¥{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
