import { useState, useEffect } from 'react';

const INTERESTS = [
  { id: 'interior', label: 'インテリア', emoji: '🛋️', bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' },
  { id: 'outdoor', label: 'アウトドア', emoji: '🏕️', bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' },
  { id: 'gadget', label: 'ガジェット', emoji: '💻', bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' },
  { id: 'fashion', label: 'ファッション', emoji: '👗', bg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)' },
  { id: 'art', label: 'アート', emoji: '🎨', bg: 'linear-gradient(135deg, #fff8e1, #ffecb3)' },
  { id: 'food', label: 'フード', emoji: '🍳', bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)' },
  { id: 'travel', label: 'トラベル', emoji: '✈️', bg: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)' },
  { id: 'music', label: '音楽', emoji: '🎵', bg: 'linear-gradient(135deg, #f1f8e9, #dcedc8)' },
  { id: 'book', label: '読書', emoji: '📚', bg: 'linear-gradient(135deg, #fafafa, #f0f0f0)' },
  { id: 'sport', label: 'スポーツ', emoji: '🏃', bg: 'linear-gradient(135deg, #e8eaf6, #c5cae9)' },
  { id: 'beauty', label: 'ビューティー', emoji: '💄', bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' },
  { id: 'pet', label: 'ペット', emoji: '🐾', bg: 'linear-gradient(135deg, #f9fbe7, #f0f4c3)' },
];

const MOODS = [
  { id: 'wander', emoji: '🚶', label: 'ぶらぶらしたい', desc: 'ゆっくり眺めて気になるものを探したい' },
  { id: 'search', emoji: '🔍', label: '何か探している', desc: '特定のものが頭にある、今すぐ見つけたい' },
  { id: 'refresh', emoji: '🌿', label: '気分転換したい', desc: 'いつもと違うものに触れてリフレッシュ' },
  { id: 'thrill', emoji: '✨', label: 'ときめくものが欲しい', desc: '心が躍るものに出会いたい' },
];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleStep2 = (moodId) => {
    setSelectedMood(moodId);
    setTimeout(() => setStep(3), 400);
  };

  const handleReveal = () => {
    onComplete(selectedInterests, selectedMood);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #fdf2f8 0%, #f0ebff 50%, #e8f0ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        fontFamily: "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
      }}
    >
      {step === 1 && <Step1 selected={selectedInterests} onToggle={toggleInterest} onNext={() => setStep(2)} />}
      {step === 2 && <Step2 onSelect={handleStep2} />}
      {step === 3 && <Step3 onReveal={handleReveal} />}
    </div>
  );
}

function Step1({ selected, onToggle, onNext }) {
  return (
    <div style={{ width: '100%', maxWidth: 560, padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', margin: '0 0 8px' }}>
          ようこそ Discoverino へ
        </h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
          好きなジャンルを{' '}
          <span style={{ color: '#a855f7', fontWeight: 700 }}>3つ</span> 選んでください
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginTop: 12,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: selected.length > i ? '#a855f7' : '#ddd',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 28,
        }}
      >
        {INTERESTS.map((item) => {
          const isSelected = selected.includes(item.id);
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onToggle(item.id)}
              style={{
                padding: '14px 8px',
                borderRadius: 14,
                border: isSelected ? '2px solid #a855f7' : '2px solid transparent',
                background: item.bg,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.4 : 1,
                transition: 'all 0.15s',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                boxShadow: isSelected ? '0 6px 18px rgba(168,85,247,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 5 }}>{item.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{item.label}</div>
              {isSelected && (
                <div style={{ fontSize: 10, color: '#a855f7', marginTop: 3, fontWeight: 700 }}>
                  ✓ 選択中
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selected.length < 3}
        style={{
          width: '100%',
          padding: '14px',
          background: selected.length < 3 ? '#e0e0e0' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
          border: 'none',
          borderRadius: 14,
          color: selected.length < 3 ? '#aaa' : '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: selected.length < 3 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: selected.length >= 3 ? '0 6px 20px rgba(168,85,247,0.35)' : 'none',
          fontFamily: 'inherit',
        }}
      >
        次へ → ({selected.length}/3 選択)
      </button>
    </div>
  );
}

function Step2({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌤️</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', margin: '0 0 8px' }}>
          今日の気分は？
        </h2>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
          あなたの今のモードに合わせてマップを調整します
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            onMouseEnter={() => setHovered(mood.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              background: hovered === mood.id ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.8)',
              border: hovered === mood.id ? '2px solid rgba(168,85,247,0.4)' : '2px solid rgba(0,0,0,0.06)',
              borderRadius: 16,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              transform: hovered === mood.id ? 'translateX(4px)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 28 }}>{mood.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 3 }}>
                {mood.label}
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{mood.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ onReveal }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <style>{`
        @keyframes mapReveal {
          0% { transform: scale(0.7) rotate(-5deg); opacity: 0; }
          60% { transform: scale(1.05) rotate(1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes dot1 { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        @keyframes dot2 { 0%,20%,100%{opacity:0.2} 60%{opacity:1} }
        @keyframes dot3 { 0%,40%,100%{opacity:0.2} 80%{opacity:1} }
      `}</style>

      <div style={{ animation: 'mapReveal 0.8s ease-out both', marginBottom: 24 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: 52,
            boxShadow: '0 16px 48px rgba(168,85,247,0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          🗺️
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', margin: '0 0 8px' }}>
        あなただけのマップを作成中
        <span style={{ display: 'inline-flex', gap: 3, marginLeft: 4, verticalAlign: 'middle' }}>
          <span style={{ animation: 'dot1 1.2s infinite', color: '#a855f7' }}>●</span>
          <span style={{ animation: 'dot2 1.2s infinite', color: '#a855f7' }}>●</span>
          <span style={{ animation: 'dot3 1.2s infinite', color: '#a855f7' }}>●</span>
        </span>
      </h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>
        あなたの好みに合った30点の商品が集まっています
      </p>

      {ready && (
        <button
          onClick={onReveal}
          style={{
            padding: '14px 40px',
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            border: 'none',
            borderRadius: 50,
            color: '#fff',
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(168,85,247,0.45)',
            fontFamily: 'inherit',
            animation: 'mapReveal 0.4s ease-out both',
          }}
        >
          ✨ マップを見る
        </button>
      )}
    </div>
  );
}
