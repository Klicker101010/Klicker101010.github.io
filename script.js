document.addEventListener('DOMContentLoaded', () => {
  // Фиксируем хедер и отступ для body
  const header = document.querySelector('header.header');
  if (header) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    header.style.zIndex = '1000';

    const updateBodyPadding = () => {
      const height = header.offsetHeight;
      document.body.style.paddingTop = height + 'px';
    };

    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);
  }

  // Плавное появление элементов с классами fade-in-top
  const fadeElements = [
    ...document.querySelectorAll(
      'h1, h2, h3, .card, .portfolio-card, .about-cards-background > div, .education-card, .portfolio-card, .welcome-text > *'
    ),
  ];

  fadeElements.forEach(el => {
    el.classList.add('fade-in-top');
  });

  fadeElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 150 * i);
  });

  // Скролл в начало при обновлении страницы
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // Плавный скролл по кнопке "Узнать больше"
  const btn = document.querySelector('.welcome-section button');
  const aboutSection = document.querySelector('.about-section');

  if (btn && aboutSection) {
    btn.addEventListener('click', e => {
      e.preventDefault();
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Меню-бургер
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('show');
      mobileMenu.setAttribute('aria-hidden', String(expanded));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('show');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

 
  // Сохраняем позицию скролла при переходах по портфолио
  document.querySelectorAll('.portfolio-buttons a').forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('scrollToPortfolio', 'true');
      const portfolioSection = document.getElementById('projects');
      if (portfolioSection) {
        const top = portfolioSection.getBoundingClientRect().top + window.pageYOffset;
        sessionStorage.setItem('portfolioScrollTop', top);
      }
    });
  });

  // При загрузке страницы скроллим к портфолио, если нужно
  if (sessionStorage.getItem('scrollToPortfolio') === 'true') {
    const scrollTop = parseInt(sessionStorage.getItem('portfolioScrollTop'), 10);
    if (!isNaN(scrollTop)) {
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    }
    sessionStorage.removeItem('scrollToPortfolio');
    sessionStorage.removeItem('portfolioScrollTop');
  }
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Сохраняем позицию скролла, если клик по ссылкам портфолио
  document.querySelectorAll('.portfolio-buttons a').forEach(link => {
    link.addEventListener('click', () => {
      // Сохраняем в sessionStorage флаг и позицию скролла блока Портфолио
      sessionStorage.setItem('scrollToPortfolio', 'true');
      const portfolioSection = document.getElementById('projects');
      if (portfolioSection) {
        const top = portfolioSection.getBoundingClientRect().top + window.pageYOffset;
        sessionStorage.setItem('portfolioScrollTop', top);
      }
    });
  });

  // При загрузке страницы проверяем, нужно ли скроллить к блоку Портфолио
  if (sessionStorage.getItem('scrollToPortfolio') === 'true') {
    const scrollTop = parseInt(sessionStorage.getItem('portfolioScrollTop'), 10);
    if (!isNaN(scrollTop)) {
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    }
    // Очищаем флаг, чтобы скролл к портфолио не происходил при перезагрузке
    sessionStorage.removeItem('scrollToPortfolio');
    sessionStorage.removeItem('portfolioScrollTop');
  }
});

