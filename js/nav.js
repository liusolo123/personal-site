/**
 * nav.js — 顶部导航栏交互逻辑
 *
 * 职责:
 *   - 滚动显影 (data-scrolled)
 *   - 当前章节高亮 (IntersectionObserver)
 *   - 移动端汉堡菜单开关
 */

(function () {
  'use strict';

  const NAV = document.getElementById('nav');
  const MENU = document.getElementById('nav-menu');
  const HAMBURGER = document.getElementById('nav-hamburger');
  const OVERLAY = document.getElementById('nav-overlay');
  const NAV_LINKS = document.querySelectorAll('.nav__link');

  let menuOpen = false;

  // ── 1. 滚动显影 ──
  function initScrollShadow() {
    if (!NAV) return;

    function onScroll() {
      const scrolled = window.scrollY > 10;
      NAV.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始检查
  }

  // ── 2. 章节高亮 ──
  function initActiveSection() {
    if (!NAV_LINKS.length) return;

    const sectionIds = [];
    NAV_LINKS.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var el = document.getElementById(href.slice(1));
        if (el) sectionIds.push({ id: href.slice(1), link: link });
      }
    });

    if (!sectionIds.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          // 移除所有 active
          NAV_LINKS.forEach(function (l) {
            l.classList.remove('nav__link--active');
          });

          // 激活匹配的链接
          var match = sectionIds.find(function (s) {
            return s.id === entry.target.id;
          });
          if (match && match.link) {
            match.link.classList.add('nav__link--active');
          }
        });
      },
      {
        rootMargin: '-' + (NAV ? NAV.offsetHeight : 60) + 'px 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  // ── 3. 移动端菜单 ──

  function openMenu() {
    if (!MENU || !HAMBURGER) return;
    menuOpen = true;
    MENU.classList.add('nav__menu--open');
    HAMBURGER.classList.add('nav__hamburger--open');
    HAMBURGER.setAttribute('aria-expanded', 'true');
    if (OVERLAY) OVERLAY.classList.add('nav__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!MENU || !HAMBURGER) return;
    menuOpen = false;
    MENU.classList.remove('nav__menu--open');
    HAMBURGER.classList.remove('nav__hamburger--open');
    HAMBURGER.setAttribute('aria-expanded', 'false');
    if (OVERLAY) OVERLAY.classList.remove('nav__overlay--visible');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function initMobileMenu() {
    if (!HAMBURGER || !MENU) return;

    HAMBURGER.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // 点击 overlay 关闭
    if (OVERLAY) {
      OVERLAY.addEventListener('click', closeMenu);
    }

    // 点击导航链接后关闭菜单
    MENU.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (menuOpen) closeMenu();
      });
    });

    // Escape 键关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
        if (HAMBURGER) HAMBURGER.focus();
      }
    });

    // 点击页面其他区域关闭 (桌面端菜单之外的点击)
    document.addEventListener('click', function (e) {
      if (!menuOpen) return;
      if (MENU.contains(e.target)) return;
      if (HAMBURGER.contains(e.target)) return;
      closeMenu();
    });
  }

  // ── 4. 窗口 resize 时关闭菜单 ──
  function initResizeHandler() {
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth >= 1024 && menuOpen) {
          closeMenu();
        }
      }, 200);
    });
  }

  // ── 启动 ──
  function boot() {
    initScrollShadow();
    initActiveSection();
    initMobileMenu();
    initResizeHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
