/**
 * gallery.js — 照片画廊模块
 *
 * 职责: 加载 photos.json, 分类筛选, 渲染网格
 * 暴露: Gallery.init()
 */

const Gallery = (() => {
  let photos = [];
  let currentCategory = '全部';
  let containerEl = null;
  let filterEl = null;

  const CATEGORIES = ['全部', '风光', '城市', '人文', '学校', '其他'];

  /**
   * 初始化画廊
   * @param {string} containerId - 网格容器 DOM id
   * @param {string} filterId   - 筛选按钮容器 DOM id
   */
  async function init(containerId, filterId) {
    containerEl = document.getElementById(containerId);
    filterEl = document.getElementById(filterId);

    if (!containerEl || !filterEl) {
      console.warn('Gallery: 找不到容器元素');
      return;
    }

    renderFilters();
    showLoading();
    await fetchPhotos();
    renderGrid();
  }

  // ── 加载数据 ──

  async function fetchPhotos() {
    try {
      const resp = await fetch('data/photos.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      photos = await resp.json();
      // 隐藏「朋友」分类
      photos = photos.filter((p) => (p.category || '其他') !== '朋友');
    } catch (err) {
      console.error('Gallery: 加载照片数据失败', err);
      photos = [];
    }
  }

  // ── 渲染筛选按钮 ──

  function renderFilters() {
    // 统计每个分类的数量
    const counts = {};
    CATEGORIES.forEach((cat) => (counts[cat] = 0));

    // 先尝试加载数据统计 (异步后会在 renderGrid 时更新)
    filterEl.innerHTML = CATEGORIES.map((cat) => {
      return `
        <button class="gallery__filter-btn${
          cat === currentCategory ? ' gallery__filter-btn--active' : ''
        }" data-category="${cat}">
          ${cat}<span class="gallery__filter-count" data-count-cat="${cat}"></span>
        </button>
      `;
    }).join('');

    // 绑定事件
    filterEl.querySelectorAll('.gallery__filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        updateFilterUI();
        renderGrid();
      });
    });
  }

  function updateFilterUI() {
    filterEl.querySelectorAll('.gallery__filter-btn').forEach((btn) => {
      btn.classList.toggle(
        'gallery__filter-btn--active',
        btn.dataset.category === currentCategory
      );
    });
  }

  function updateFilterCounts() {
    const counts = {};
    CATEGORIES.forEach((cat) => (counts[cat] = 0));
    photos.forEach((p) => {
      const cat = p.category || '其他';
      if (counts[cat] !== undefined) counts[cat]++;
    });
    // 全部 = 总数
    counts['全部'] = photos.length;

    filterEl.querySelectorAll('.gallery__filter-count').forEach((el) => {
      const cat = el.dataset.countCat;
      el.textContent = counts[cat] || 0;
    });
  }

  // ── 渲染网格 ──

  function renderGrid() {
    if (!photos.length) {
      containerEl.innerHTML =
        '<div class="gallery__empty">暂无照片数据。请运行 scripts/build-photos.py 生成。</div>';
      return;
    }

    updateFilterCounts();

    const filtered =
      currentCategory === '全部'
        ? photos
        : photos.filter((p) => (p.category || '其他') === currentCategory);

    if (!filtered.length) {
      containerEl.innerHTML =
        `<div class="gallery__empty">「${currentCategory}」分类暂无照片。在 data/photos.json 中为照片分配此分类。</div>`;
      return;
    }

    containerEl.innerHTML = filtered
      .map(
        (photo, idx) => `
      <div class="photo-card fade-in" data-photo-index="${idx}" data-photo-id="${photo.id}">
        <div class="photo-card__frame">
          <div class="photo-card__image-wrap">
            <img
              class="photo-card__image"
              src="${photo.thumbnail}"
              alt="${photo.title}"
              loading="lazy"
            />
            <div class="photo-card__overlay">
              <div class="photo-card__overlay-icon">+</div>
            </div>
            <div class="photo-card__glare"></div>
          </div>
          <div class="photo-card__info">
            <div class="photo-card__title">${escapeHTML(photo.title)}</div>
            <div class="photo-card__category">${escapeHTML(photo.category)}</div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // 绑定点击事件 → Lightbox
    containerEl.querySelectorAll('.photo-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.photoIndex);
        Lightbox.open(filtered, idx);
      });
    });

    // 触发淡入动画
    requestAnimationFrame(() => {
      containerEl.querySelectorAll('.fade-in').forEach((el) => {
        el.classList.add('visible');
      });
    });

    // 初始化 3D 倾斜
    if (typeof CardTilt !== 'undefined') {
      CardTilt.bindAll('.photo-card');
    }
  }

  // ── 工具 ──

  function showLoading() {
    containerEl.innerHTML =
      '<div class="gallery__loading">作品载入中…</div>';
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── 公共 API ──

  return { init };
})();
