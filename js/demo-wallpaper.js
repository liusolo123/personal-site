/* Full-viewport wallpaper demo: wallpaper rotation, real content, entrance reveals. */
(() => {
  'use strict';

  // Demo wallpaper list. The first entry must match the CSS default in css/demo-wallpaper.css.
  const WALLPAPERS = [
    'photos/full/photo_053.jpg',
    'photos/full/photo_071.jpg',
    'photos/full/photo_074.jpg'
  ];
  const WALLPAPER_STORAGE_KEY = 'demo-wallpaper-index';

  const wallpaperLayer = document.getElementById('wallpaper-image');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  const PHOTO_CATEGORIES = ['全部', '风光', '城市', '人文', '学校', '其他'];
  const viewer = document.getElementById('wallpaper-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const viewerStatus = document.getElementById('viewer-status');
  const previousButton = document.getElementById('viewer-prev');
  const nextButton = document.getElementById('viewer-next');
  const closeButton = document.getElementById('viewer-close');
  let photos = [];
  let currentCategory = '全部';
  let visiblePhotos = [];
  let viewerPhotos = [];
  let viewerIndex = 0;
  let openingButton = null;
  let savedScroll = 0;
  let savedOverflow = '';

  function readStoredWallpaperIndex() {
    try {
      const stored = window.sessionStorage.getItem(WALLPAPER_STORAGE_KEY);
      if (stored === null || stored === '') return null;
      const index = Number(stored);
      return Number.isInteger(index) ? index : null;
    } catch (error) {
      return null;
    }
  }

  function writeStoredWallpaperIndex(index) {
    try {
      window.sessionStorage.setItem(WALLPAPER_STORAGE_KEY, String(index));
    } catch (error) {
      /* Storage can be unavailable; the default wallpaper still works. */
    }
  }

  function nextWallpaperIndex(stored) {
    if (!WALLPAPERS.length) return null;
    if (stored === null) return 0;
    const size = WALLPAPERS.length;
    return ((stored + 1) % size + size) % size;
  }

  function preloadWallpaper(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = () => reject(new Error(`壁纸加载失败：${src}`));
      image.src = src;
    });
  }

  async function rotateWallpaper() {
    if (!wallpaperLayer || !WALLPAPERS.length) {
      document.documentElement.dataset.wallpaperReady = 'fallback';
      return;
    }

    const stored = readStoredWallpaperIndex();
    const index = nextWallpaperIndex(stored);
    const candidate = WALLPAPERS[index];

    try {
      await preloadWallpaper(candidate);
      wallpaperLayer.style.backgroundImage = `url("${candidate}")`;
      wallpaperLayer.dataset.wallpaper = candidate;
      writeStoredWallpaperIndex(index);
      document.documentElement.dataset.wallpaperReady = 'ready';
    } catch (error) {
      // Keep the local default wallpaper when a candidate cannot load.
      console.warn(error.message);
      document.documentElement.dataset.wallpaperReady = 'fallback';
    }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  async function readCollection(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error(`${path}: expected a collection`);
    return data;
  }

  function showStatus(container, message) {
    container.replaceChildren(element('p', 'status', message));
  }

  function renderProjects(projects) {
    const container = document.getElementById('wallpaper-projects');
    const count = document.getElementById('project-count');

    if (!projects.length) {
      showStatus(container, '项目作品正在整理中。');
      count.textContent = '';
      return;
    }

    const entries = projects.map(project => {
      const link = element('a', 'project-entry');
      link.href = `project.html?id=${encodeURIComponent(project.id)}`;
      const body = element('div', 'project-entry__body');
      body.append(
        element('p', 'project-entry__description', project.description),
        element('p', 'project-entry__tags', (project.tags || []).join(' · '))
      );
      const arrow = element('span', 'project-entry__arrow', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      link.append(element('h3', '', project.title), body, arrow);
      return link;
    });
    container.replaceChildren(...entries);

    const featured = projects[0];
    const cover = document.getElementById('featured-project-cover');
    cover.href = `project.html?id=${encodeURIComponent(featured.id)}`;
    cover.setAttribute('aria-label', `了解 ${featured.title}`);
    document.getElementById('featured-project-kind').textContent = (featured.tags || [])[0] || '项目作品';
    const name = featured.title.replace(/\s*小程序$/, '');
    document.getElementById('featured-project-title').textContent = name;
    const lines = name.includes(' ') ? name.split(/\s+/) : [name];
    document.getElementById('featured-project-name').replaceChildren(...lines.map(line => element('span', '', line)));
    count.textContent = `· ${projects.length} 个项目`;
  }

  function renderPhotos(collection) {
    photos = collection.filter(photo => (photo.category || '其他') !== '朋友');
    const grid = document.getElementById('wallpaper-photos');
    const filters = document.getElementById('wallpaper-photo-filters');
    const summary = document.getElementById('wallpaper-photo-summary');
    const count = document.getElementById('photo-count');

    if (!photos.length) {
      filters.hidden = true;
      showStatus(grid, '摄影作品正在整理中。');
      summary.textContent = '';
      count.textContent = '';
      return;
    }

    const coverPhoto = photos.find(photo => photo.id === 'photo_048') || photos[0];
    const featuredPhoto = document.getElementById('featured-photo');
    featuredPhoto.src = coverPhoto.full || coverPhoto.thumbnail;
    featuredPhoto.alt = `${coverPhoto.title} · ${coverPhoto.category || '其他'}`;
    count.textContent = `· ${photos.length} 幅照片`;

    renderFilters();
    renderPhotoGrid();
  }

  function photoCollection(category) {
    if (category === '全部') return photos;
    return photos.filter(photo => (photo.category || '其他') === category);
  }

  function renderFilters() {
    const container = document.getElementById('wallpaper-photo-filters');
    const buttons = PHOTO_CATEGORIES.map(category => {
      const button = element('button', 'photo-filter');
      button.type = 'button';
      button.dataset.category = category;
      button.setAttribute('aria-pressed', String(category === currentCategory));
      button.setAttribute('aria-controls', 'wallpaper-photos');
      button.append(category, element('span', 'photo-filter__count', String(photoCollection(category).length)));
      button.addEventListener('click', () => {
        if (currentCategory === category) return;
        currentCategory = category;
        container.querySelectorAll('button').forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        renderPhotoGrid();
      });
      return button;
    });
    container.replaceChildren(...buttons);
    container.hidden = false;
  }

  function renderPhotoGrid() {
    const container = document.getElementById('wallpaper-photos');
    visiblePhotos = photoCollection(currentCategory);
    document.getElementById('wallpaper-photo-summary').textContent = `${currentCategory} · ${visiblePhotos.length} 幅作品`;

    if (!visiblePhotos.length) {
      showStatus(container, `「${currentCategory}」分类暂时没有作品，可以浏览其他分类。`);
      return;
    }

    const figures = visiblePhotos.map((photo, index) => {
      const figure = element('figure', 'photo-work');
      figure.dataset.photoId = photo.id;
      const button = element('button', 'photo-work__open');
      button.type = 'button';
      button.setAttribute('aria-label', `查看 ${photo.title} 的大图`);
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'wallpaper-viewer');
      const image = element('img');
      image.src = photo.thumbnail;
      image.alt = `${photo.title} · ${photo.category || '其他'}`;
      image.width = photo.width;
      image.height = photo.height;
      image.loading = 'lazy';
      image.decoding = 'async';
      button.append(image);
      button.addEventListener('click', () => openViewer(index, button));
      const caption = element('figcaption');
      caption.append(
        element('span', 'photo-work__title', photo.title),
        element('span', 'photo-work__category', photo.category || '其他')
      );
      figure.append(button, caption);
      return figure;
    });
    container.replaceChildren(...figures);
  }

  function renderViewer() {
    const photo = viewerPhotos[viewerIndex];
    viewerStatus.hidden = true;
    viewerStatus.textContent = '';
    viewerImage.src = photo.full || photo.thumbnail;
    viewerImage.alt = `${photo.title} · ${photo.category || '其他'}`;
    document.getElementById('viewer-title').textContent = photo.title;
    document.getElementById('viewer-category').textContent = photo.category || '其他';
    document.getElementById('viewer-counter').textContent = `${viewerIndex + 1} / ${viewerPhotos.length}`;
    previousButton.disabled = viewerPhotos.length < 2;
    nextButton.disabled = viewerPhotos.length < 2;
  }

  function openViewer(index, button) {
    if (!viewer || !visiblePhotos.length) return;
    viewerPhotos = visiblePhotos;
    viewerIndex = index;
    openingButton = button;
    savedScroll = window.scrollY;
    savedOverflow = document.body.style.overflow;
    renderViewer();
    viewer.showModal();
    document.body.style.overflow = 'hidden';
    closeButton.focus({ preventScroll: true });
  }

  function moveViewer(direction) {
    if (viewerPhotos.length < 2) return;
    viewerIndex = (viewerIndex + direction + viewerPhotos.length) % viewerPhotos.length;
    renderViewer();
  }

  closeButton.addEventListener('click', () => viewer.close());
  previousButton.addEventListener('click', () => moveViewer(-1));
  nextButton.addEventListener('click', () => moveViewer(1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [closeButton, previousButton, nextButton].filter(button => !button.disabled);
      const direction = event.shiftKey ? -1 : 1;
      const index = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(index + direction + controls.length) % controls.length].focus();
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveViewer(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    if (openingButton && openingButton.isConnected) openingButton.focus({ preventScroll: true });
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
  });
  viewerImage.addEventListener('load', () => {
    if (!motionPreference.matches && viewer.open) {
      viewerImage.animate([{ opacity: .3, transform: 'scale(.99)' }, { opacity: 1, transform: 'scale(1)' }], {
        duration: 240,
        easing: 'cubic-bezier(.22, 1, .36, 1)'
      });
    }
  });
  viewerImage.addEventListener('error', () => {
    viewerStatus.textContent = '这张照片暂时无法加载，请尝试前后切换。';
    viewerStatus.hidden = false;
  });

  function observeReveals() {
    const targets = document.querySelectorAll('.reveal');
    if (motionPreference.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(target => observer.observe(target));
  }

  async function init() {
    rotateWallpaper();
    observeReveals();

    await Promise.all([
      readCollection('data/projects.json').then(renderProjects).catch(error => {
        console.error('Wallpaper demo projects:', error);
        showStatus(document.getElementById('wallpaper-projects'), '暂时无法载入项目，请稍后刷新。');
      }),
      readCollection('data/photos.json').then(renderPhotos).catch(error => {
        console.error('Wallpaper demo photography:', error);
        showStatus(document.getElementById('wallpaper-photos'), '暂时无法载入摄影作品，请稍后刷新。');
      })
    ]);

    document.documentElement.dataset.wallpaperPage = 'ready';
  }

  init();
})();
