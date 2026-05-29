(function () {
  'use strict';

  var activeLevel = 'all';
  var activeTag = 'all';

  function applyFilters() {
    var items = document.querySelectorAll('.js-learnItem');
    var visible = 0;

    items.forEach(function (item) {
      var level = item.getAttribute('data-level') || '';
      var tags = item.getAttribute('data-tags') || '';

      var levelMatch = activeLevel === 'all' || level === activeLevel;
      var tagMatch = activeTag === 'all' || tags.indexOf(activeTag) !== -1;

      if (levelMatch && tagMatch) {
        item.hidden = false;
        visible++;
      } else {
        item.hidden = true;
      }
    });

    var empty = document.querySelector('.js-learnEmpty');
    if (empty) {
      empty.hidden = visible > 0;
    }
  }

  function setActive(filterType, value, btn) {
    var group = btn.closest('.LearnBoard-filterGroup');
    if (group) {
      group.querySelectorAll('.js-learnFilter').forEach(function (b) {
        b.classList.remove('LearnBoard-filterBtn--active');
      });
    }
    btn.classList.add('LearnBoard-filterBtn--active');

    if (filterType === 'level') {
      activeLevel = value;
    } else if (filterType === 'tag') {
      activeTag = value;
    }

    applyFilters();
  }

  function reset() {
    activeLevel = 'all';
    activeTag = 'all';
    document.querySelectorAll('.js-learnFilter').forEach(function (btn) {
      var val = btn.getAttribute('data-value');
      btn.classList.toggle('LearnBoard-filterBtn--active', val === 'all');
    });
    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-learnFilter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActive(
          btn.getAttribute('data-filter'),
          btn.getAttribute('data-value'),
          btn
        );
      });
    });

    var resetBtn = document.querySelector('.js-learnReset');
    if (resetBtn) {
      resetBtn.addEventListener('click', reset);
    }

    applyFilters();
  });
})();
