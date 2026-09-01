/**
 * lightbox.js — 大图查看器
 *
 * 职责: 大图查看 + 左右切换 + 键盘导航
 * 暴露: Lightbox.open(photos, index)
 */

const Lightbox = (() => {
  let photos = [];
  let currentIndex = 0;
  let el = null;
  let isOpen = false;

  /**
   * 打开 Lightbox
   * @param {Array}  photoList - 照片数组 (已筛选的)
   * @param {number} index     - 当前索引
   */
  function open(photoList, index = 0) {
    photos = photoList;
    currentIndex = Math.max(0, Math.min(index, photos.length - 1));

    if (!el) createDOM();
    render();
    document.body.style.overflow = 'hidden';
    el.classList.add('lightbox--open');
    isOpen = true;
  }

  function close() {
    if (!el) return;
    el.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    isOpen = false;
  }

  function next() {
    if (!photos.length) return;
    currentIndex = (currentIndex + 1) % photos.length;
    render();
  }

  function prev() {
    if (!photos.length) return;
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    render();
  }

  // ── DOM 创建 ──

  function createDOM() {
    el = document.createElement('div');
    el.className = 'lightbox';
    el.innerHTML = `
      <button class="lightbox__close" aria-label="关闭">&times;</button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="上一张">&#8249;</button>
      <button class="lightbox__nav lightbox__nav--next" aria-label="下一张">&#8250;</button>
      <div class="lightbox__content">
        <div class="lightbox__image-wrap">
          <img class="lightbox__image" src="" alt="" />
        </div>
        <div class="lightbox__info">
          <div class="lightbox__title"></div>
          <div class="lightbox__category"></div>
          <div class="lightbox__counter"></div>
        </div>
      </div>
      <div class="lightbox__hint">← 键盘方向键切换  ·  ESC 关闭</div>
    `;

    // 事件绑定
    el.querySelector('.lightbox__close').addEventListener('click', close);
    el.querySelector('.lightbox__nav--prev').addEventListener('click', prev);
    el.querySelector('.lightbox__nav--next').addEventListener('click', next);

    // 点击背景关闭
    el.addEventListener('click', (e) => {
      if (e.target === el) close();
    });

    // 键盘导航
    document.addEventListener('keydown', onKeyDown);

    document.body.appendChild(el);
  }

  function render() {
    if (!el || !photos.length) return;

    const photo = photos[currentIndex];

    // 更新图片
    const img = el.querySelector('.lightbox__image');
    img.src = photo.full;
    img.alt = photo.title;

    // 更新信息
    el.querySelector('.lightbox__title').textContent = photo.title;
    el.querySelector('.lightbox__category').textContent = photo.category || '';
    el.querySelector('.lightbox__counter').textContent =
      `${currentIndex + 1} / ${photos.length}`;
  }

  // ── 键盘事件 ──

  function onKeyDown(e) {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        prev();
        break;
      case 'ArrowRight':
        next();
        break;
    }
  }

  return { open };
})();
