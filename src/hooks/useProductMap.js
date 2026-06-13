import { useState, useRef, useCallback } from 'react';

export function useProductMap() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const lastOffset = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);
  const isPinching = useRef(false);
  // ピンチ終了後しばらくclickを無視するためのフラグ
  const pinchEndTime = useRef(0);

  const clampScale = (s) => Math.min(Math.max(s, 0.5), 2.0);

  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastOffset.current = offsetRef.current;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    // ctrlKey=true → ピンチズーム（トラックパッド）またはCtrl+スクロール → 拡縮
    // ctrlKey=false → 2本指スクロール → 平行移動
    if (e.ctrlKey) {
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const prevScale = scaleRef.current;
      const newScale = clampScale(prevScale * factor);
      const { x: ox, y: oy } = offsetRef.current;
      setOffset({
        x: mouseX - (mouseX - ox) * (newScale / prevScale),
        y: mouseY - (mouseY - oy) * (newScale / prevScale),
      });
      setScale(newScale);
    } else {
      const { x: ox, y: oy } = offsetRef.current;
      setOffset({ x: ox - e.deltaX, y: oy - e.deltaY });
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1 && !isPinching.current) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffset.current = offsetRef.current;
    } else if (e.touches.length === 2) {
      isPinching.current = true;
      setIsDragging(false);
      dragStart.current = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && dragStart.current && !isPinching.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / lastTouchDist.current;

      const pinchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const pinchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const localX = pinchX - rect.left;
      const localY = pinchY - rect.top;

      const prevScale = scaleRef.current;
      const newScale = clampScale(prevScale * factor);
      const { x: ox, y: oy } = offsetRef.current;

      setOffset({
        x: localX - (localX - ox) * (newScale / prevScale),
        y: localY - (localY - oy) * (newScale / prevScale),
      });
      setScale(newScale);
      lastTouchDist.current = dist;
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      // 全指離れた → ピンチ終了
      if (isPinching.current) {
        pinchEndTime.current = Date.now();
        isPinching.current = false;
      }
      setIsDragging(false);
      dragStart.current = null;
      lastTouchDist.current = null;
    } else if (e.touches.length === 1 && isPinching.current) {
      // 1本残った → ピンチ終了、ドラッグは再開しない
      lastTouchDist.current = null;
    }
  }, []);

  // ピンチ直後のクリックを無視すべきか判定
  const wasPinchRecently = useCallback(() => {
    return Date.now() - pinchEndTime.current < 300;
  }, []);

  const handleSliderZoom = useCallback((value, containerEl) => {
    const newScale = clampScale(parseFloat(value));
    const prevScale = scaleRef.current;
    if (!containerEl || prevScale === newScale) {
      setScale(newScale);
      return;
    }
    const rect = containerEl.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const { x: ox, y: oy } = offsetRef.current;
    setOffset({
      x: cx - (cx - ox) * (newScale / prevScale),
      y: cy - (cy - oy) * (newScale / prevScale),
    });
    setScale(newScale);
  }, []);

  const SCALE_MIN = 0.5;
  const SCALE_MAX = 2.0;

  const resetView = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setScale(1);
  }, []);

  return {
    offset,
    scale,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleSliderZoom,
    wasPinchRecently,
    resetView,
    SCALE_MIN,
    SCALE_MAX,
  };
}
