/**
 * main.js — 应用入口
 *
 * 职责:
 *   - 初始化各模块
 *   - 滚动淡入动画
 *   - 项目卡片加载
 */

(function () {
  'use strict';

  // ── 滚动淡入动画 ──
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });
  }

  // ── 加载项目卡片 ──
  async function initProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
      const resp = await fetch('data/projects.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const projects = await resp.json();

      grid.innerHTML = projects
        .map(
          (p, i) => `
        <a href="project.html?id=${encodeURIComponent(p.id)}" class="project-card fade-in fade-in--delay-${Math.min(i + 1, 5)}">
          <div class="project-card__number">No.${String(i + 1).padStart(3, '0')}</div>
          <h3 class="project-card__title">${escapeHTML(p.title)}</h3>
          <p class="project-card__desc">${escapeHTML(p.description)}</p>
          <div class="project-card__tags">
            ${(p.tags || []).map((t) => `<span class="project-card__tag">${escapeHTML(t)}</span>`).join('')}
          </div>
          <div class="project-card__rule"></div>
        </a>
      `
        )
        .join('');

      // 触发淡入
      requestAnimationFrame(() => {
        grid.querySelectorAll('.fade-in').forEach((el) => {
          el.classList.add('visible');
        });
      });
    } catch (err) {
      console.error('main: 加载项目数据失败', err);
      grid.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);padding:2rem;">项目数据加载失败</p>';
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── 启动 ──
  function boot() {
    initScrollReveal();
    initProjects();

    // 初始化画廊 (如果页面有画廊元素)
    if (document.getElementById('gallery-grid')) {
      Gallery.init('gallery-grid', 'gallery-filters');
    }
  }

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
