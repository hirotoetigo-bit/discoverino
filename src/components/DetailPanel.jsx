import { useState } from 'react';
import { stores } from '../data/stores';

const CAT_INTEREST_MAP = {
  'インテリア': 'interior',
  'アウトドア': 'outdoor',
  'ガジェット': 'gadget',
  'ファッション': 'fashion',
};

const ALL_INTERESTS = [
  { id: 'interior', label: 'インテリア' },
  { id: 'gadget', label: 'ガジェット' },
  { id: 'natural', label: 'ナチュラル雑貨' },
  { id: 'outdoor', label: 'アウトドア' },
  { id: 'coffee', label: 'コーヒー・カフェ' },
  { id: 'minimal', label: 'ミニマルデザイン' },
];

const SUGGEST_INTERESTS = [
  'ファッション', 'アート・デザイン', 'キッチン',
];

export function DetailPanel({ product, favorites, userInterests, onToggleFavorite, onClose }) {
  const [imgError, setImgError] = useState(false);
  const isFav = favorites.has(product.id);
  const store = stores.find((s) => s.id === product.storeId);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 340,
        height: '100vh',
        background: 'rgba(255,255,255,0.99)',
        backdropFilter: 'blur(20px)',
        boxShadow: '-8px 0 48px rgba(168,85,247,0.12)',
        display: 'flex',
        flexDirection: 'column',
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

      {/* 商品画像（トップ全幅） */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 220,
          flexShrink: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #fdf2f8 0%, #f0ebff 50%, #ebf0ff 100%)',
        }}
      >
        {product.image && !imgError ? (
          <img
            src={product.image.replace('w=240&h=200', 'w=680&h=440')}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
            {product.emoji}
          </div>
        )}
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 700,
            color: '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          ✕
        </button>
        {/* ハートボタン */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
        {/* 「…」ボタン */}
        <button
          style={{
            position: 'absolute',
            top: 12,
            right: 54,
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            color: '#555',
            fontWeight: 700,
          }}
        >
          ···
        </button>
      </div>

      {/* スクロールコンテンツ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 16px' }}>
        {/* 商品名・価格・説明 */}
        <h2 style={{ fontSize: 17, fontWeight: 900, color: '#1a1a2e', margin: '0 0 5px', lineHeight: 1.35 }}>
          {product.name}
        </h2>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ color: '#1a1a2e' }}>¥{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>（税込）</span>
        </div>
        <p style={{ fontSize: 12.5, color: '#777', lineHeight: 1.7, margin: '0 0 16px' }}>
          {product.description}
        </p>

        {/* 詳しく見るボタン */}
        <button
          style={{
            width: '100%',
            padding: '13px',
            background: '#1a1a2e',
            border: 'none',
            borderRadius: 13,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 8,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          詳しく見る
        </button>

        {/* この商品を見たストアを見るボタン */}
        {store && (
          <button
            style={{
              width: '100%',
              padding: '11px',
              background: 'transparent',
              border: '1.5px solid rgba(0,0,0,0.12)',
              borderRadius: 13,
              color: '#555',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 14 }}>⊞</span>
            この商品を見たストアを見る
          </button>
        )}

        {/* あなたのパーソナライズ */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e' }}>あなたのパーソナライズ</span>
            <button
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: 'none',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 10,
                color: '#a855f7',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              編集
            </button>
          </div>

          {/* パーソナライズ統計 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'パーソナライズ状況', value: '学習中' },
              { label: '閲覧時間', value: '2時間15分' },
              { label: 'クリック数', value: '48回' },
              { label: 'お気に入り', value: `${favorites.size}件` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(168,85,247,0.05)',
                  borderRadius: 10,
                  padding: '8px 6px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', marginBottom: 2 }}>{value}</div>
                <div style={{ fontSize: 9, color: '#aaa', lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* 興味ジャンル */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a4a5a', marginBottom: 8 }}>興味・関心のジャンル</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {ALL_INTERESTS.map(({ id, label }) => (
              <span
                key={id}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#7c3aed',
                  background: 'rgba(168,85,247,0.08)',
                  borderRadius: 20,
                  padding: '5px 11px',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.08)')}
              >
                {label}
              </span>
            ))}
          </div>

          {/* 新しい興味を追加 */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a4a5a', marginBottom: 8 }}>新しい興味を追加</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {SUGGEST_INTERESTS.map((label) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#aaa',
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 20,
                  padding: '5px 11px',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              >
                {label}
              </span>
            ))}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#a855f7',
                background: 'rgba(168,85,247,0.07)',
                borderRadius: 20,
                padding: '5px 11px',
                cursor: 'pointer',
              }}
            >
              + カスタム追加
            </span>
          </div>

          {/* 初期化 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#4a4a5a', marginBottom: 2 }}>初期化</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>パーソナライズをリセットして新しい発見を楽しもう</div>
            </div>
            <button
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 10,
                color: '#888',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              ↺ リセットする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
