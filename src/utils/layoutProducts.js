const CARD_W = 148;
const CARD_H = 160; // 画像110 + テキスト50

// 重複しない最小センター間距離
const MIN_DIST_X = CARD_W + 24;  // 172px
const MIN_DIST_Y = CARD_H + 24;  // 184px

// セル内のランダムジッター幅（±JITTER px）
// CELL = MIN_DIST + 2*JITTER を保てば隣接セル同士は絶対に重ならない
const JITTER = 32;
const CELL_W = MIN_DIST_X + JITTER * 2; // 236px
const CELL_H = MIN_DIST_Y + JITTER * 2; // 248px

// 升目レイアウト（scale < 0.75 のとき使用）
export function computeGridLayout(products) {
  const COLS = 12;
  const GW = CARD_W + 24 + 8;  // 180px（グリッドは隙間固定）
  const GH = CARD_H + 24 + 8;  // 192px
  return products.map((product, i) => ({
    ...product,
    x: (i % COLS) * GW + CARD_W / 2 + 16,
    y: Math.floor(i / COLS) * GH + CARD_H / 2 + 16,
  }));
}

// ジッタード・グリッド配置（ランダム＋重複ゼロ保証）
//
// アルゴリズム:
//   1. n商品を収める COLS×ROWS のグリッドを作る
//   2. グリッドセルの位置リストをシャッフル（商品の並び順をランダムに）
//   3. 各セルの中心に ±JITTER のランダムオフセットを加える
//   → 隣接セル間距離 = CELL_W/H ≥ MIN_DIST_X/Y が保たれるため重複しない
export function computeLayout(products) {
  const n = products.length;

  // グリッド列数はほぼ正方形になるよう決定
  const COLS = Math.ceil(Math.sqrt(n * 1.15));
  const ROWS = Math.ceil(n / COLS);

  // グリッドセル座標リストを生成
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells.push({
        cx: col * CELL_W + CELL_W / 2,
        cy: row * CELL_H + CELL_H / 2,
      });
    }
  }

  // Fisher-Yatesシャッフル
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // 各商品をセルに割り当て、セル中心に ±JITTER のランダムずれを加える
  const result = products.map((product, i) => {
    const { cx, cy } = cells[i];
    const x = cx + (Math.random() * 2 - 1) * JITTER;
    const y = cy + (Math.random() * 2 - 1) * JITTER;
    return { ...product, x, y };
  });

  const canvasW = COLS * CELL_W + CARD_W;
  const canvasH = ROWS * CELL_H + CARD_H;

  return { products: result, canvasW, canvasH };
}
