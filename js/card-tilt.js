/**
 * card-tilt.js — 卡片 3D 倾斜效果
 *
 * 鼠标悬停时根据鼠标位置动态计算 tiltX/tiltY，
 * 配合 CSS perspective + transform 产生 3D 翻转质感。
 *
 * 暴露: CardTilt.bindAll(selector)
 */

const CardTilt = (() => {
  const MAX_TILT = 8;       // 最大倾斜角度 (deg)
  const PERSPECTIVE = 800;  // 透视距离 (px)

  /**
   * 绑定所有匹配元素
   * @param {string} selector - CSS 选择器
   */
  function bindAll(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card) => bind(card));
  }

  /**
   * 绑定单个元素
   * @param {HTMLElement} card
   */
  function bind(card) {
    // 避免重复绑定
    if (card.dataset.tiltBound === 'true') return;
    card.dataset.tiltBound = 'true';

    card.addEventListener('mousemove', (e) => onMouseMove(card, e));
    card.addEventListener('mouseleave', () => onMouseLeave(card));
  }

  function onMouseMove(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;   // 鼠标在卡片内的 X
    const y = e.clientY - rect.top;    // 鼠标在卡片内的 Y

    // 计算比例: -0.5 到 0.5
    const xRatio = x / rect.width - 0.5;
    const yRatio = y / rect.height - 0.5;

    const tiltY = xRatio * MAX_TILT;   // 左右倾斜
    const tiltX = -yRatio * MAX_TILT;  // 上下倾斜

    // 应用 transform 到画框
    const frame = card.querySelector('.photo-card__frame');
    if (frame) {
      frame.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // 动态调整光泽位置
    const glare = card.querySelector('.photo-card__glare');
    if (glare) {
      const glareX = xRatio * 100 + 50;
      const glareY = yRatio * 100 + 50;
      glare.style.background = `radial-gradient(
        circle at ${glareX}% ${glareY}%,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 60%
      )`;
    }
  }

  function onMouseLeave(card) {
    const frame = card.querySelector('.photo-card__frame');
    if (frame) {
      frame.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
      frame.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      // 过渡结束后清除 transition，避免后续 mousemove 延迟
      frame.addEventListener('transitionend', function handler() {
        frame.style.transition = '';
        frame.removeEventListener('transitionend', handler);
      });
    }
  }

  // 在 Gallery 重新渲染后需要重新绑定，提供解绑辅助
  function unbindAll(selector) {
    document.querySelectorAll(selector).forEach((card) => {
      card.dataset.tiltBound = 'false';
      card.replaceWith(card.cloneNode(true)); // 粗暴但有效
    });
  }

  return { bindAll, bind, unbindAll };
})();
