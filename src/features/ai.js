export function AImode(){
    const aiInput = document.querySelector('#aiInput');
    const sendAi = document.querySelector('#sendAi');
    const conversation = document.querySelector('#conversation');

    function sendAiMessage() {
      const value = aiInput.value.trim();
      if (!value) return;

      conversation.insertAdjacentHTML('beforeend', `
        <div class="msg user"><div class="msg-avatar user">ÁB</div><div class="bubble"></div></div>
      `);
      conversation.lastElementChild.querySelector('.bubble').textContent = value;
      aiInput.value = '';

      setTimeout(() => {
        conversation.insertAdjacentHTML('beforeend', `
          <div class="msg"><div class="msg-avatar ai">✦</div><div class="bubble">Good direction. I would shortlist <strong style="color:var(--text1)">Annihilation</strong>, <strong style="color:var(--text1)">Moon</strong> and <strong style="color:var(--text1)">Coherence</strong>. Based on your taste, the safest pick tonight is <strong style="color:var(--text1)">Annihilation</strong>: atmospheric, strange, visual and under 2 hours.</div></div>
        `);
        conversation.scrollTop = conversation.scrollHeight;
      }, 520);

      conversation.scrollTop = conversation.scrollHeight;
    }

    sendAi.addEventListener('click', sendAiMessage);
    aiInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') sendAiMessage();
    });
}