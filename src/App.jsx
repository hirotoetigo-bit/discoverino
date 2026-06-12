import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProductMap } from './components/ProductMap';
import { DetailPanel } from './components/DetailPanel';
import { StoreDetailPanel } from './components/StoreDetailPanel';
import { StoreBanner } from './components/StoreBanner';
import { DeliveryStory } from './components/DeliveryStory';
import { Onboarding } from './components/Onboarding';

const FONT_STACK = "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif";

export default function App() {
  const [showOnboarding] = useState(() => !localStorage.getItem('discoverino_onboarding'));
  const [onboardingDone, setOnboardingDone] = useState(!showOnboarding);

  const [userInterests, setUserInterests] = useState(() => {
    const stored = localStorage.getItem('discoverino_interests');
    return stored ? JSON.parse(stored) : [];
  });

  const [activePage, setActivePage] = useState('explore');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [budget, setBudget] = useState(25000);
  const [searchQuery, setSearchQuery] = useState('');

  // 店舗モード用状態
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeFavorites, setStoreFavorites] = useState(new Set());

  const handleOnboardingComplete = (interests, mood) => {
    localStorage.setItem('discoverino_onboarding', 'complete');
    localStorage.setItem('discoverino_interests', JSON.stringify(interests));
    localStorage.setItem('discoverino_mood', mood);
    setUserInterests(interests);
    setOnboardingDone(true);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleStoreFavorite = (id) => {
    setStoreFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleReset = () => {
    localStorage.removeItem('discoverino_onboarding');
    localStorage.removeItem('discoverino_interests');
    localStorage.removeItem('discoverino_mood');
    setFavorites(new Set());
    setStoreFavorites(new Set());
    setSelectedProduct(null);
    setSelectedStore(null);
    setSearchQuery('');
    setBudget(25000);
    window.location.reload();
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    if (page !== 'explore' && page !== 'store') {
      setSelectedProduct(null);
      setSelectedStore(null);
    }
    if (page === 'explore') setSelectedStore(null);
    if (page === 'store') setSelectedProduct(null);
  };

  // 店舗に「入店」→探索モードに切り替え（その店舗の商品を表示）
  const handleEnterStore = (store) => {
    setSelectedStore(null);
    setActivePage('explore');
    setSearchQuery(store.name);
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    setSelectedProduct(null);
  };

  if (!onboardingDone) {
    return (
      <div style={{ fontFamily: FONT_STACK }}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const isMapPage = activePage === 'explore' || activePage === 'store';

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      fontFamily: FONT_STACK, overflow: 'hidden',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f5f0ff 40%, #ede9fe 70%, #f0f7ff 100%)',
    }}>
      <Sidebar
        activePage={activePage}
        favoritesCount={favorites.size}
        onNavigate={handleNavigate}
        onReset={handleReset}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header
          activePage={activePage}
          searchQuery={searchQuery}
          budget={budget}
          onSearch={setSearchQuery}
          onNavigate={handleNavigate}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {activePage === 'delivery' ? (
            <DeliveryStory />
          ) : isMapPage ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <ProductMap
                activePage={activePage}
                selectedProduct={selectedProduct}
                favorites={favorites}
                onSelectProduct={setSelectedProduct}
                onToggleFavorite={toggleFavorite}
                budget={budget}
                onBudgetChange={setBudget}
                searchQuery={searchQuery}
                selectedStore={selectedStore}
                storeFavorites={storeFavorites}
                onSelectStore={handleSelectStore}
                onToggleStoreFavorite={toggleStoreFavorite}
                onEnterStore={handleEnterStore}
              />
              {activePage === 'explore' && <StoreBanner onEnterStore={handleEnterStore} />}
            </div>
          ) : (
            <PlaceholderPage page={activePage} />
          )}

          {/* 商品詳細パネル */}
          {selectedProduct && activePage === 'explore' && (
            <DetailPanel
              product={selectedProduct}
              favorites={favorites}
              userInterests={userInterests}
              onToggleFavorite={toggleFavorite}
              onClose={() => setSelectedProduct(null)}
            />
          )}

          {/* 店舗詳細パネル */}
          {selectedStore && activePage === 'store' && (
            <StoreDetailPanel
              store={selectedStore}
              isFavorite={storeFavorites.has(selectedStore.id)}
              onToggleFavorite={toggleStoreFavorite}
              onClose={() => setSelectedStore(null)}
              onEnter={handleEnterStore}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ page }) {
  const labels = {
    favorite: { emoji: '❤️', title: 'お気に入り', desc: '気になった商品がここに集まります' },
    history: { emoji: '🕐', title: '閲覧履歴', desc: '最近見た商品の履歴です' },
    recommend: { emoji: '✨', title: 'おすすめ', desc: 'あなたへのパーソナライズされたおすすめ' },
    collection: { emoji: '📦', title: 'コレクション', desc: 'まとめたコレクションを管理できます' },
    gift: { emoji: '🎁', title: 'ギフト', desc: '大切な人へのギフトを選ぼう' },
  };
  const info = labels[page] || { emoji: '🗺️', title: page, desc: '準備中です' };
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontSize: 64 }}>{info.emoji}</span>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>{info.title}</div>
      <div style={{ fontSize: 14, color: '#888' }}>{info.desc}</div>
      <div style={{ fontSize: 12, color: '#b794f4', background: 'rgba(168,85,247,0.07)', borderRadius: 20, padding: '6px 16px' }}>
        Coming Soon
      </div>
    </div>
  );
}
