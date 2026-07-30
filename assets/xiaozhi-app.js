/**
 * 小织 — Novel Workstation Shared App Logic
 */

(function() {
  'use strict';

  // ===== Sidebar collapse persistence =====
  var shell = document.querySelector('.app-shell');
  var collapseBtn = document.querySelector('[data-dom-id="sidebar-collapse-btn"]');
  var SIDEBAR_KEY = 'xiaozhi_sidebar_collapsed';

  function applySidebarCollapse(state) {
    if (!shell) return;
    if (state) shell.classList.add('sidebar-collapsed');
    else shell.classList.remove('sidebar-collapsed');
    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', state ? 'false' : 'true');
  }

  var savedCollapsed = localStorage.getItem(SIDEBAR_KEY);
  applySidebarCollapse(savedCollapsed === '1');

  if (collapseBtn) {
    collapseBtn.addEventListener('click', function() {
      var willCollapse = !shell.classList.contains('sidebar-collapsed');
      applySidebarCollapse(willCollapse);
      localStorage.setItem(SIDEBAR_KEY, willCollapse ? '1' : '0');
    });
  }

  // ===== Mobile sidebar toggle =====
  var mobileBtn = document.querySelector('.mobile-menu-btn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.sidebar-overlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar on nav item click (mobile)
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  // ===== Theme toggle =====
  var themeToggleBtn = document.querySelector('[data-dom-id="theme-toggle-btn"]');
  var THEME_KEY = 'xiaozhi_theme';

  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', theme);
  }

  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      var isDark = document.documentElement.classList.contains('dark');
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // ===== Sync current work from works center =====
  function syncCurrentWork() {
    try {
      var works = JSON.parse(localStorage.getItem('xiaozhi_works')) || [];
      var currentId = localStorage.getItem('xiaozhi_current_work_id');
      var work = works.find(function(w){ return w.id === currentId; });

      // Update header badges
      document.querySelectorAll('[data-work-sync="badge"]').forEach(function(el) {
        if (work) {
          el.style.display = 'inline-flex';
          var strong = el.querySelector('strong');
          if (strong) strong.textContent = work.title;
        } else {
          el.style.display = 'none';
        }
      });

      // Update title inputs
      document.querySelectorAll('[data-work-sync="title"]').forEach(function(el) {
        el.textContent = work ? work.title : '未选择';
      });

      // Update home subtitle
      var homeSubtitle = document.getElementById('home-work-subtitle');
      if (homeSubtitle && work) {
        homeSubtitle.textContent = '《' + work.title + '》第24章 · 昨日新增 3,200 字';
      }
    } catch(e) {}
  }

  syncCurrentWork();
  window.addEventListener('storage', syncCurrentWork);

  // ===== Animate stat numbers on load =====
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-count]').forEach(function(el) {
      var target = parseInt(el.dataset.count);
      var current = 0;
      var step = Math.ceil(target / 30);
      var timer = setInterval(function() {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString();
      }, 20);
    });
  });

  // ===== Lucide icons init =====
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

})();
