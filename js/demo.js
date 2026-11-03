/* Data and visual foundation for the independent exhibition demo. */
(() => {
  'use strict';

  const selectedPhotoIds = ['photo_071', 'photo_048', 'photo_064', 'photo_053', 'photo_074', 'photo_043', 'photo_003', 'photo_068'];

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
    container.replaceChildren(element('p', 'content-status', message));
  }

  function renderProjects(projects) {
    const container = document.getElementById('demo-projects');
    if (!projects.length) {
      showStatus(container, '项目作品正在整理中。');
      return;
    }

    const entries = projects.map(project => {
      const link = element('a', 'project-entry');
      link.href = `project.html?id=${encodeURIComponent(project.id)}`;
      const heading = element('h3', '', project.title);
      const body = element('div', 'project-entry__body');
      body.append(
        element('p', 'project-entry__description', project.description),
        element('p', 'project-entry__tags', (project.tags || []).join(' · '))
      );
      const arrow = element('span', 'project-entry__arrow', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      link.append(heading, body, arrow);
      return link;
    });
    container.replaceChildren(...entries);

    const featured = projects[0];
    const cover = document.getElementById('featured-project-cover');
    cover.href = `project.html?id=${encodeURIComponent(featured.id)}`;
    cover.setAttribute('aria-label', `了解${featured.title}`);
    document.getElementById('featured-project-kind').textContent = (featured.tags || [])[0] || '项目作品';
    document.getElementById('featured-project-title').textContent = featured.title;
    const name = featured.title.replace(/\s*小程序$/, '');
    const lines = name.includes(' ') ? name.split(/\s+/) : [name];
    document.getElementById('featured-project-name').replaceChildren(...lines.map(line => element('span', '', line)));
  }

  function renderPhotos(collection) {
    const photos = collection.filter(photo => (photo.category || '其他') !== '朋友');
    const selected = selectedPhotoIds.map(id => photos.find(photo => photo.id === id)).filter(Boolean);
    const display = selected.length ? selected : photos.slice(0, 8);
    const container = document.getElementById('demo-photos');

    if (!photos.length) {
      showStatus(container, '摄影作品正在整理中。');
      return;
    }

    const featured = photos.find(photo => photo.id === 'photo_071') || photos[0];
    const hero = document.getElementById('featured-photo');
    hero.src = featured.full || featured.thumbnail;
    hero.alt = `${featured.title} · ${featured.category || '其他'}`;

    const figures = display.map(photo => {
      const figure = element('figure', 'photo-work');
      figure.dataset.photoId = photo.id;
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
    container.replaceChildren(...figures);
    const categories = [...new Set(photos.map(photo => photo.category || '其他'))];
    document.getElementById('demo-photo-summary').textContent = `${categories.join(' / ')} · 选集 ${display.length} 幅，共 ${photos.length} 幅作品`;
  }

  async function init() {
    await Promise.all([
      readCollection('data/projects.json').then(renderProjects).catch(error => {
        console.error('Demo projects:', error);
        showStatus(document.getElementById('demo-projects'), '暂时无法载入项目，请稍后刷新。');
      }),
      readCollection('data/photos.json').then(renderPhotos).catch(error => {
        console.error('Demo photography:', error);
        showStatus(document.getElementById('demo-photos'), '暂时无法载入摄影作品，请稍后刷新。');
      })
    ]);
    document.documentElement.dataset.demoReady = 'true';
  }

  init();
})();
