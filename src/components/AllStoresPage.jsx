import { stores } from '../data/stores';

export function AllStoresPage({ onEnterStore, onClose, isMobile }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f5f0ff 40%, #ede9fe 70%, #f0f7ff 100%)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: isMobile ? '12px 16px' : '16px 24px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(168,85,247,0.08)',
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36,
            borderRadius: '50%',
            border: '1.5px solid rgba(168,85,247,0.2)',
            background: 'rgba(250,247,255,0.9)',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7c3aed', fontWeight: 700, flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#1a1a2e' }}>すべてのストア</div>
          <div style={{ fontSize: 11, color: '#a855f7', marginTop: 1 }}>{stores.length}店舗</div>
        </div>
      </div>

      {/* グリッド */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px 14px 80px' : '24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: isMobile ? 12 : 18,
        alignContent: 'start',
      }}>
        {stores.map((store) => (
          <StoreGridCard key={store.id} store={store} onEnterStore={onEnterStore} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function StoreGridCard({ store, onEnterStore, isMobile }) {
  return (
    <div
      onClick={() => onEnterStore(store)}
      style={{
        borderRadius: 16,
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        background: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
    >
      {/* 画像 */}
      <div style={{ height: isMobile ? 110 : 140, position: 'relative', overflow: 'hidden', background: store.gradient }}>
        {store.bgImage ? (
          <img
            src={store.bgImage.replace('w=300&h=160', 'w=480&h=280')}
            alt={store.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.parentElement.style.background = store.gradient;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48,
          }}>
            {store.emoji}
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 10,
          fontSize: isMobile ? 14 : 16, fontWeight: 900, color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.4)', lineHeight: 1.2,
        }}>
          {store.name}
        </div>
      </div>

      {/* 情報 */}
      <div style={{ padding: isMobile ? '10px 12px 12px' : '12px 14px 14px' }}>
        <div style={{ fontSize: isMobile ? 11 : 12, color: '#a855f7', fontWeight: 700, marginBottom: 4 }}>
          {store.tagline}
        </div>
        <div style={{
          fontSize: isMobile ? 10.5 : 11.5,
          color: '#888',
          lineHeight: 1.6,
          overflow: 'visible',
        }}>
          {store.description}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEnterStore(store); }}
          style={{
            marginTop: 10,
            width: '100%',
            padding: isMobile ? '8px' : '9px',
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontSize: isMobile ? 11 : 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          入店する
        </button>
      </div>
    </div>
  );
}
