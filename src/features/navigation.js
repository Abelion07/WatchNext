export function Navigation (){
    const pages = [...document.querySelectorAll('.page')];
    const navLinks = [...document.querySelectorAll('.nav-link')];

    function showPage(id) {
      pages.forEach(page => page.classList.toggle('active', page.id === id));
      navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.addEventListener('click', event => {
      const pageTrigger = event.target.closest('[data-page]');
      if (pageTrigger) showPage(pageTrigger.dataset.page);

      const filter = event.target.closest('.filter');
      if (filter) filter.classList.toggle('on');

      const suggestion = event.target.closest('.suggestion');
      if (suggestion) {
        document.querySelector('#aiInput').value = suggestion.textContent.trim();
        sendAiMessage();
      }
    });
}