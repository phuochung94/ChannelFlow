(() => {
  function fit() {
    const width = 380, height = Math.ceil(document.body.offsetHeight);
    if (!height) return;
    const availableHeight = Math.min(560, Math.max(240, (screen.availHeight || 720) - 140));
    const availableWidth = Math.max(220, (screen.availWidth || 1024) - 32);
    const scale = Math.min(1, availableHeight / height, availableWidth / width);
    document.documentElement.style.setProperty('--popup-scale', scale);
    document.documentElement.style.width = (width * scale) + 'px';
    document.documentElement.style.height = (height * scale) + 'px';
  }
  fit();
  // Follow text wrapping, translated labels and platform-specific controls.
  new ResizeObserver(fit).observe(document.body);
  window.addEventListener('resize', fit);
})();
