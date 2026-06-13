import { useState } from 'react';
import { stores } from '../data/stores';

const STORE_MAP = Object.fromEntries(stores.map((s) => [s.id, s.name]));

const CATEGORY_BG = {
  'インテリア': 'linear-gradient(160deg, #fdf6ff 0%, #f0e9ff 100%)',
  'アウトドア': 'linear-gradient(160deg, #f0fff4 0%, #e6f4ea 100%)',
  'ガジェット': 'linear-gradient(160deg, #eff6ff 0%, #e0edff 100%)',
  'ファッション': 'linear-gradient(160deg, #fff5f7 0%, #ffe4ec 100%)',
};

export function ProductCard({ product, isSelected, favorites, onSelect, onToggleFavorite, isFaded, showDetail, wasPinchRecently }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isFav = favorites.has(product.id);

  const handleClick = (e) => {
    e.stopPropagation();
    if (wasPinchRecently?.()) return;
    onSelect(product);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (wasPinchRecently?.()) return;
    onToggleFavorite(product.id);
  };

  const bgFallback = CATEGORY_BG[product.category] || 'linear-gradient(160deg, #fdf6ff 0%, #f5eeff 100%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: product.x,
        top: product.y,
        width: 148,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.07 : hovered ? 1.04 : 1})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s, opacity 0.3s, filter 0.3s',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        opacity: isFaded ? 0.25 : 1,
        filter: isFaded ? 'grayscale(0.85)' : 'none',
        zIndex: isSelected ? 10 : hovered ? 5 : 1,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: isSelected
            ? '0 16px 48px rgba(168,85,247,0.28), 0 0 0 2.5px rgba(168,85,247,0.65)'
            : hovered
            ? '0 16px 40px rgba(0,0,0,0.16), 0 4px 14px rgba(0,0,0,0.08)'
            : '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)',
          border: isSelected
            ? '2px solid rgba(168,85,247,0.45)'
            : '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* 商品画像エリア */}
        <div
          style={{
            height: 110,
            position: 'relative',
            overflow: 'hidden',
            background: bgFallback,
          }}
        >
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.35s ease',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
              }}
            >
              {product.emoji}
            </div>
          )}

          {/* ハートボタン */}
          <button
            onClick={handleFav}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: isFav ? 'rgba(233,30,99,0.9)' : 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s, background 0.15s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* テキストエリア */}
        <div style={{ padding: '9px 11px 11px', background: '#ffffff' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#1a1a2e',
              lineHeight: 1.35,
              marginBottom: 5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: showDetail ? 8 : 0,
            }}
          >
            {product.price != null ? `¥${product.price.toLocaleString()}` : 'Amazon'}
          </div>

          {/* ストアタグ */}
          {product.storeId && STORE_MAP[product.storeId] && (
            <div style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 700,
              color: '#7c3aed',
              background: 'rgba(168,85,247,0.09)',
              borderRadius: 20,
              padding: '2px 7px',
              marginBottom: showDetail ? 6 : 0,
              marginTop: 4,
            }}>
              {STORE_MAP[product.storeId]}
            </div>
          )}

          {/* 200%時の説明文 */}
          {showDetail && (
            <div
              style={{
                fontSize: 10.5,
                color: '#777',
                lineHeight: 1.65,
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: 8,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
