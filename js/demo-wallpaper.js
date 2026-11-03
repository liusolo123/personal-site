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
    const photos = collection.filter(photo => (photo.category || '其他') !== '朋友');
    const grid = document.getElementById('wallpaper-photos');
    const summary = document.getElementById('wallpaper-photo-summary');
    const count = document.getElementById('photo-count');

    if (!photos.length) {
      showStatus(grid, '摄影作品正在整理中。');
      summary.textContent = '';
      count.textContent = '';
      return;
    }

    const categories = new Map();
    photos.forEach(photo => {
      const category = photo.category || '其他';
      categories.set(category, (categories.get(category) || 0) + 1);
    });
    summary.textContent = `全部 ${photos.length} 幅 · ${[...categories].map(([category, total]) => `${category} ${total}`).join(' · ')}`;
    count.textContent = `· ${photos.length} 幅照片`;

    const coverPhoto = photos.find(photo => photo.id === 'photo_048') || photos[0];
    const featuredPhoto = document.getElementById('featured-photo');
    featuredPhoto.src = coverPhoto.full || coverPhoto.thumbnail;
    featuredPhoto.alt = `${coverPhoto.title} · ${coverPhoto.category || '其他'}`;

    const figures = photos.map(photo => {
      const figure = element('figure', 'photo-work');
      const image = element('img');
      image.src = photo.thumbnail;
      image.alt = `${photo.title} · ${photo.category || '其他'}`;
      image.width = photo.width;
      image.height = photo.height;
      image.loading = 'lazy';
      image.decoding = 'async';
      const caption = element('figcaption');
      caption.append(
        element('span', 'photo-work__title', photo.title),
        element('span', 'photo-work__category', photo.category || '其他')
      );
      figure.append(image, caption);
      return figure;
    });
    grid.replaceChildren(...figures);
  }

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
