// language
const root = document.documentElement;
function setLang(l){
  root.setAttribute('data-lang', l);
  document.querySelectorAll('.lang-toggle button').forEach(b => b.classList.toggle('active', b.dataset.set === l));
  document.querySelectorAll('[data-ph-ru]').forEach(el => { el.placeholder = el.getAttribute('data-ph-' + l) });
  try { localStorage.setItem('zubov_lang', l) } catch(e){}
}
document.querySelectorAll('.lang-toggle button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.set)));
setLang((() => { try { return localStorage.getItem('zubov_lang') || 'ru' } catch(e){ return 'ru' } })());

// nav scrolled
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive:true });

// liquid glass — specular highlight follows the pointer
const navIn = document.querySelector('.nav-in');
if(navIn){
  navIn.addEventListener('pointermove', (e) => {
    const r = navIn.getBoundingClientRect();
    navIn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    navIn.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
}

// reveal (scroll-position based — robust across preview/print)
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms' });
function revealCheck(){
  const vh = innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll('.reveal:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if(r.top < vh * 0.9 && r.bottom > 0) el.classList.add('in');
  });
}
addEventListener('scroll', revealCheck, { passive:true });
addEventListener('resize', revealCheck);
revealCheck();
requestAnimationFrame(revealCheck);
// backstop: guarantee content is visible even if transitions are throttled (preview/print)
setTimeout(() => document.querySelectorAll('.reveal').forEach(e => { e.classList.add('in'); e.style.transition = 'none'; e.style.opacity = '1'; e.style.transform = 'none'; }), 1100);

// form
const formA = document.getElementById('form-a');
formA.addEventListener('submit', (e) => {
  e.preventDefault();
  if(!formA.checkValidity()){ formA.reportValidity(); return; }
  const fd = new FormData(formA);
  const subj = encodeURIComponent('Заявка с сайта — ' + (fd.get('name') || ''));
  const body = encodeURIComponent((fd.get('msg') || '') + '\n\n' + (fd.get('name') || '') + ' · ' + (fd.get('email') || ''));
  window.location.href = 'mailto:hakuz0r@gmail.com?subject=' + subj + '&body=' + body;
  formA.style.display = 'none';
  document.getElementById('ok-a').classList.add('show');
});
