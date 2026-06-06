document.querySelectorAll('#yr').forEach(e => e.textContent = new Date().getFullYear());
const header = document.getElementById('header');
const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, {passive:true}); onScroll();
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
if (burger) burger.addEventListener('click', () => menu.classList.toggle('open'));
if (menu) menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
const io = new IntersectionObserver((es) => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);} }), {threshold:.12, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
const fine = matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches;
const cur = document.getElementById('cursor');
if (fine && cur){
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
  addEventListener('mousemove', e => {x=e.clientX;y=e.clientY;});
  (function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
  const bind = () => document.querySelectorAll('[data-cursor],a,button').forEach(el=>{
    if(el.dataset.cb) return; el.dataset.cb=1;
    el.addEventListener('mouseenter',()=>cur.classList.add('is-hover'));
    el.addEventListener('mouseleave',()=>cur.classList.remove('is-hover'));
  });
  bind();
  addEventListener('mouseleave',()=>cur.style.opacity='0'); addEventListener('mouseenter',()=>cur.style.opacity='1');
} else if (cur){ cur.style.display='none'; }
// contact form -> mailto (no backend needed)
const form = document.getElementById('cform');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const body = `Name: ${f.get('name')}%0D%0ACompany: ${f.get('company')}%0D%0AEmail: ${f.get('email')}%0D%0AService: ${f.get('service')}%0D%0ABudget: ${f.get('budget')}%0D%0A%0D%0A${f.get('message')}`;
    window.location.href = `mailto:creative@mframes.studio?subject=Project enquiry — ${f.get('name')||'M Frames'}&body=${body}`;
  });
}
// image lightbox — click a screenshot to view it large, arrows / swipe to move
(function(){
  const imgs = Array.from(document.querySelectorAll('.browser .scr img, .gallery .gphoto img'));
  if (!imgs.length) return;
  const cur = document.getElementById('cursor');
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML =
    '<div class="lb-count"></div>'+
    '<button class="lb-btn lb-close" aria-label="Close">\u2715</button>'+
    '<button class="lb-btn lb-prev" aria-label="Previous image">\u2039</button>'+
    '<button class="lb-btn lb-next" aria-label="Next image">\u203A</button>'+
    '<div class="lb-stage"><span class="lb-vf"><span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span></span><img alt=""><div class="lb-cap"></div></div>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('.lb-stage img');
  const lbCap = lb.querySelector('.lb-cap');
  const lbCount = lb.querySelector('.lb-count');
  const single = imgs.length < 2;
  if (single){ lb.querySelector('.lb-prev').style.display='none'; lb.querySelector('.lb-next').style.display='none'; }
  let i = 0;
  const show = (n) => {
    i = (n + imgs.length) % imgs.length;
    lbImg.src = imgs[i].currentSrc || imgs[i].src;
    lbImg.alt = imgs[i].alt || '';
    lbCap.textContent = imgs[i].alt || '';
    lbCount.textContent = single ? '' : (i+1) + ' / ' + imgs.length;
  };
  const open = (n) => { show(n); lb.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow=''; };
  imgs.forEach((img, n) => {
    img.addEventListener('click', () => open(n));
    if (cur){
      img.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
      img.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
    }
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(i-1); });
  lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(i+1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (!single && e.key === 'ArrowRight') show(i+1);
    else if (!single && e.key === 'ArrowLeft') show(i-1);
  });
  // touch swipe
  let sx = 0;
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', (e) => {
    if (single) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (dx > 50) show(i-1); else if (dx < -50) show(i+1);
  }, {passive:true});
})();

/* hero video sound toggle */
(function(){
  const btn = document.getElementById('soundBtn');
  const v = document.querySelector('.hero-video');
  if(!btn || !v) return;
  btn.addEventListener('click', () => {
    v.muted = !v.muted;
    btn.classList.toggle('is-muted', v.muted);
    btn.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video');
    if(!v.muted){ const p = v.play(); if(p && p.catch) p.catch(()=>{}); }
  });
})();
