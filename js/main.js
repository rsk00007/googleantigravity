// main.js

document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth scroll for anchor links ---
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.header');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if(this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Reveal with Intersection Observer ---
  const revealElements = document.querySelectorAll('.fade-in');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      // Add a slight delay for a cascading effect if multiple items enter at once
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  };

  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', 
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});
