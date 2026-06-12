const STEPS = [
  { id: 1, label: '注文確定', icon: '✅', detail: '2026年6月10日 14:32', done: true },
  { id: 2, label: '梱包中', icon: '📦', detail: '2026年6月11日 09:15', done: true },
  { id: 3, label: '発送済み', icon: '🚀', detail: '2026年6月11日 14:00', done: true },
  { id: 4, label: '配送中', icon: '🚚', detail: '現在 配送中です', done: false, current: true },
  { id: 5, label: 'まもなく到着', icon: '🏘️', detail: '本日中にお届け予定', done: false },
  { id: 6, label: 'お届け完了', icon: '🎉', detail: 'お楽しみに！', done: false },
];

const SUGGESTIONS = [
  {
    emoji: '🛋️',
    title: 'IKEAのおすすめインテリア',
    desc: '届いたシェルフに合わせるアイテムをチェック',
  },
  {
    emoji: '📷',
    title: '届いたら試したいコーデ',
    desc: '北欧スタイルのお部屋コーディネート集',
  },
  {
    emoji: '💬',
    title: 'レビューを読む',
    desc: '購入者のリアルな声を参考にしよう',
  },
];

export function DeliveryStory() {
  const currentStep = STEPS.find((s) => s.current) || STEPS[3];

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '28px 32px',
        background: 'linear-gradient(160deg, #fdf2f8 0%, #f5f0ff 60%, #f0f7ff 100%)',
      }}
    >
      {/* タイトル */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#1a1a2e',
            margin: '0 0 6px',
          }}
        >
          🚚 届くまでの物語
        </h2>
        <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
          あなたの荷物が旅をしています — その軌跡を追いかけよう
        </p>
      </div>

      {/* 注文商品カード */}
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <span style={{ fontSize: 40 }}>🪵</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>
            ノルディックウッドシェルフ
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>注文番号: DIS-2026-001892</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              borderRadius: 20,
              padding: '4px 12px',
            }}
          >
            配送中
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>本日中お届け</div>
        </div>
      </div>

      {/* ステップタイムライン */}
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 16 }}>
          配送ステップ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* 左側アイコン＋線 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    background: step.current
                      ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                      : step.done
                      ? '#e8f5e9'
                      : '#f5f5f5',
                    boxShadow: step.current ? '0 4px 14px rgba(168,85,247,0.4)' : 'none',
                    border: step.current ? '2px solid #a855f7' : '2px solid transparent',
                  }}
                >
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 28,
                      background: step.done
                        ? 'linear-gradient(#a5d6a7, #a5d6a7)'
                        : 'rgba(0,0,0,0.08)',
                      margin: '3px 0',
                    }}
                  />
                )}
              </div>
              {/* テキスト */}
              <div style={{ paddingTop: 6, paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: step.current ? 800 : step.done ? 600 : 400,
                    color: step.current ? '#7c3aed' : step.done ? '#2d7a2d' : '#bbb',
                    marginBottom: 2,
                  }}
                >
                  {step.label}
                  {step.current && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        background: 'rgba(168,85,247,0.1)',
                        color: '#a855f7',
                        borderRadius: 8,
                        padding: '2px 7px',
                        verticalAlign: 'middle',
                      }}
                    >
                      現在
                    </span>
                  )}
                </div>
                <div
                  style={{ fontSize: 11, color: step.done || step.current ? '#888' : '#ccc', marginBottom: i < STEPS.length - 1 ? 8 : 0 }}
                >
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ルートマップ */}
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 16 }}>
          📍 配送ルート
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <RouteNode label="大阪・堺市" sub="IKEA配送センター" active={false} done />
          <RouteLine progress={0.6} />
          <RouteNode label="名古屋" sub="中継センター" active done={false} />
          <RouteLine progress={0} />
          <RouteNode label="東京・渋谷区" sub="お届け先" active={false} done={false} />
        </div>
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'rgba(168,85,247,0.06)',
            borderRadius: 10,
            fontSize: 12,
            color: '#7c3aed',
            fontWeight: 500,
          }}
        >
          🕐 現在、名古屋の中継センターを通過中です。本日17:00〜21:00にお届け予定です。
        </div>
      </div>

      {/* 届くまでの時間も楽しもう */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', marginBottom: 14 }}>
          🎯 届くまでの時間も楽しもう
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {SUGGESTIONS.map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: 'white',
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s',
                border: '1px solid rgba(168,85,247,0.08)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RouteNode({ label, sub, active, done }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          margin: '0 auto 6px',
          background: active
            ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
            : done
            ? '#e8f5e9'
            : '#f5f5f5',
          border: active ? '2.5px solid #a855f7' : done ? '2.5px solid #66bb6a' : '2.5px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          boxShadow: active ? '0 4px 14px rgba(168,85,247,0.35)' : 'none',
        }}
      >
        {active ? '📍' : done ? '✅' : '🏠'}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#7c3aed' : done ? '#388e3c' : '#bbb' }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: '#bbb' }}>{sub}</div>
    </div>
  );
}

function RouteLine({ progress }) {
  return (
    <div style={{ flex: 1, position: 'relative', height: 4, margin: '0 4px', marginBottom: 28 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#eee',
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #66bb6a, #a855f7)',
          borderRadius: 2,
        }}
      />
    </div>
  );
}
