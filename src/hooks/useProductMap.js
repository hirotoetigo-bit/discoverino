import { useState, useRef, useCallback } from 'react';

export function useProductMap() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const lastOffset = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);

  const clampScale = (s) => Math.min(Math.max(s, 0.5), 2.0);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastOffset.current = offset;
  }, [offset]);

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

  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const prevScale = scaleRef.current;
    const newScale = clampScale(prevScale * factor);
    const { x: ox, y: oy } = offsetRef.current;
    // マウス位置を基点にoffsetを補正
    setOffset({
      x: mouseX - (mouseX - ox) * (newScale / prevScale),
      y: mouseY - (mouseY - oy) * (newScale / prevScale),
    });
    setScale(newScale);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffset.current = offset;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, [offset]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / lastTouchDist.current;
      setScale((s) => clampScale(s * factor));
      lastTouchDist.current = dist;
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    lastTouchDist.current = null;
  }, []);

  const handleSliderZoom = useCallback((value) => {
    setScale(clampScale(parseFloat(value)));
  }, []);

  // スライダー範囲も 0.5〜2.0 に合わせるため外部に公開
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
    resetView,
    SCALE_MIN,
    SCALE_MAX,
  };
}
