import { useEffect, useRef, useMemo } from 'react';
import { products as rawProducts } from '../data/products';
import { stores } from '../data/stores';
import { ProductCard } from './ProductCard';
import { StoreMapCard } from './StoreMapCard';
import { useProductMap } from '../hooks/useProductMap';
import { computeLayout, computeGridLayout } from '../utils/layoutProducts';

// ページロード時に1回だけ計算
const { products: layoutProducts, canvasW: randomCanvasW, canvasH: randomCanvasH } = computeLayout(rawProducts);

// 店舗レイアウト（ジッタード・グリッド）
function buildStoreLayout(storeList) {
  const n = storeList.length;
  const CELL_W = 300, CELL_H = 300, JITTER = 50;
  const COLS = Math.ceil(Math.sqrt(n * 1.2));
  const ROWS = Math.ceil(n / COLS);
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ cx: c * CELL_W + CELL_W / 2, cy: r * CELL_H + CELL_H / 2 });
    }
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const canvasW = COLS * CELL_W + 188;
  const canvasH = ROWS * CELL_H + 170;
  return {
    stores: storeList.map((store, i) => ({
      ...store,
      x: cells[i].cx + (Math.random() * 2 - 1) * JITTER,
      y: cells[i].cy + (Math.random() * 2 - 1) * JITTER,
    })),
    canvasW,
    canvasH,
  };
}
const { stores: layoutStores, canvasW: storeCanvasW, canvasH: storeCanvasH } = buildStoreLayout(stores);

const GRID_THRESHOLD = 0.75;
const DETAIL_THRESHOLD = 2.0;

export function ProductMap({
  activePage,
  selectedProduct, favorites, onSelectProduct, onToggleFavorite,
  budget, onBudgetChange, searchQuery,
  selectedStore, storeFavorites, onSelectStore, onToggleStoreFavorite, onEnterStore,
  activeStoreFilter, onExitStore, isMobile,
}) {
  const containerRef = useRef(null);
  const controlBarRef = useRef(null);
  const {
    offset, scale, isDragging,
    handleMouseDown, handleMouseMove, handleMouseUp,
    handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd,
    handleSliderZoom,
    SCALE_MIN, SCALE_MAX,
  } = useProductMap();

  const isStoreMode = activePage === 'store';
  const isGridMode = !isStoreMode && scale < GRID_THRESHOLD;
  const isDetailMode = !isStoreMode && scale >= DETAIL_THRESHOLD;

  // 入店フィルター適用済みレイアウト（storeIdが変わった時だけ再計算）
  const filteredLayout = useMemo(() => {
    const storeId = activeStoreFilter?.id ?? null;
    const subset = storeId
      ? rawProducts.filter((p) => p.storeId === storeId)
      : rawProducts;
    const { products: pts, canvasW: cW, canvasH: cH } = computeLayout(subset);
    const grid = computeGridLayout(subset);
    const COLS = 12;
    const CELL_W = 180; const CELL_H = 192;
    return {
      random: pts,
      grid,
      canvasW: cW,
      canvasH: cH,
      gridCanvasW: COLS * CELL_W + 40,
      gridCanvasH: Math.ceil(subset.length / COLS) * CELL_H + 40,
    };
  }, [activeStoreFilter?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const products = isGridMode ? filteredLayout.grid : filteredLayout.random;

  const canvasW = isStoreMode ? storeCanvasW : isGridMode ? filteredLayout.gridCanvasW : filteredLayout.canvasW;
  const canvasH = isStoreMode ? storeCanvasH : isGridMode ? filteredLayout.gridCanvasH : filteredLayout.canvasH;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const bar = controlBarRef.current;
    if (!bar) return;
    const stop = (e) => e.stopPropagation();
    bar.addEventListener('touchstart', stop, { passive: true });
    bar.addEventListener('touchmove', stop, { passive: true });
    bar.addEventListener('touchend', stop, { passive: true });
    return () => {
      bar.removeEventListener('touchstart', stop);
      bar.removeEventListener('touchmove', stop);
      bar.removeEventListener('touchend', stop);
    };
  }, []);

  const isProductFaded = (product) => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const matchName = product.name.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchTag = (product.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchTag) return true;
    }
    return product.price > budget;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onSelectProduct(null);
          onSelectStore(null);
        }
      }}
      style={{
        flex: 1, overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
        touchAction: 'none',
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(236,176,255,0.25) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, rgba(196,181,253,0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(251,207,232,0.18) 0%, transparent 60%),
          radial-gradient(circle, rgba(168,85,247,0.06) 1.5px, transparent 1.5px)
        `,
        backgroundSize: 'auto, auto, auto, 32px 32px',
        backgroundColor: '#fdfaff',
      }}
    >
      {/* 入店中バナー */}
      {activeStoreFilter && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 60,
          background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)',
          padding: '10px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button
            onClick={onExitStore}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 20,
              color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px',
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ← 全商品に戻る
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
            {activeStoreFilter.name}
          </span>
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.6)',
            background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '2px 8px',
          }}>
            入店中
          </span>
        </div>
      )}

      {/* モードバッジ */}
      {isGridMode && (
        <div style={{
          position: 'absolute', top: activeStoreFilter ? 54 : 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, background: 'rgba(124,58,237,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700,
          color: '#fff', letterSpacing: '0.04em', pointerEvents: 'none',
        }}>▣ 一覧表示</div>
      )}
      {isDetailMode && (
        <div style={{
          position: 'absolute', top: activeStoreFilter ? 54 : 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, background: 'rgba(168,85,247,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700,
          color: '#fff', letterSpacing: '0.04em', pointerEvents: 'none',
        }}>✦ 詳細表示</div>
      )}

      {/* コントロールバー */}
      <div
        ref={controlBarRef}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: isMobile ? 16 : 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderRadius: 28,
          padding: isMobile ? '10px 16px' : '9px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 10 : 16,
          boxShadow: '0 4px 20px rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.1)',
          whiteSpace: 'nowrap',
          maxWidth: isMobile ? 'calc(100vw - 32px)' : 'none',
        }}>
        <span style={{ fontSize: isMobile ? 16 : 13, userSelect: 'none' }}>🔍</span>
        <input type="range" min={SCALE_MIN} max={SCALE_MAX} step="0.05" value={scale}
          onChange={(e) => handleSliderZoom(e.target.value, containerRef.current)}
          style={{ width: isMobile ? 68 : 100, accentColor: '#a855f7', cursor: 'pointer', height: isMobile ? 20 : undefined }} />
        <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, minWidth: isMobile ? 30 : 38 }}>
          {Math.round(scale * 100)}%
        </span>

        {!isStoreMode && (
          <>
            <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)' }} />
            <span style={{ fontSize: isMobile ? 16 : 13, userSelect: 'none' }}>💰</span>
            <input type="range" min="3000" max="80000" step="1000" value={budget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              style={{ width: isMobile ? 68 : 110, accentColor: '#ec4899', cursor: 'pointer', height: isMobile ? 20 : undefined }} />
            <span style={{ fontSize: 11, color: '#ec4899', fontWeight: 700, minWidth: isMobile ? 46 : 56 }}>
              ¥{Number(budget).toLocaleString()}まで
            </span>
          </>
        )}
      </div>

      {/* マップコンテンツ */}
      <div style={{
        position: 'absolute', width: canvasW, height: canvasH,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: '0 0',
      }}>
        {isStoreMode
          ? layoutStores.map((store) => (
              <StoreMapCard
                key={store.id}
                store={store}
                isSelected={selectedStore?.id === store.id}
                isFavorite={storeFavorites.has(store.id)}
                onSelect={onSelectStore}
                onEnter={onEnterStore}
                onToggleFavorite={onToggleStoreFavorite}
              />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                favorites={favorites}
                onSelect={onSelectProduct}
                onToggleFavorite={onToggleFavorite}
                isFaded={isProductFaded(product)}
                showDetail={isDetailMode}
              />
            ))
        }
      </div>
    </div>
  );
}
