/* Cyber Design — shared interactions (all pages) — performance-tuned */
(function(){
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav scroll state + progress bar (cheap: reads scrollY only, no layout reads)
  var nav = document.getElementById('nav');
  var sbar = document.getElementById('sbar');
  var docEl = document.documentElement;
  var ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY;
      if(nav) nav.classList.toggle('scrolled', y > 20);
      if(sbar){ var h = docEl.scrollHeight - window.innerHeight; sbar.style.width = (h>0 ? (y/h*100) : 0) + '%'; }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // mobile menu
  var ham = document.getElementById('ham'), mob = document.getElementById('mob');
  if(ham && mob){
    ham.addEventListener('click', function(){ ham.classList.toggle('act'); mob.classList.toggle('open'); });
    mob.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ ham.classList.remove('act'); mob.classList.remove('open'); }); });
  }

  // duplicate marquee for seamless loop
  var mq = document.getElementById('mq');
  if(mq) mq.innerHTML += mq.innerHTML;

  // build hero sparkline if present
  var spark = document.getElementById('spark');
  if(spark){
    [34,46,40,58,52,70,64,82,76,90,86,100].forEach(function(h,i){
      var b = document.createElement('i'); b.style.height = h+'%'; b.style.animationDelay = (0.6+i*0.06)+'s'; spark.appendChild(b);
    });
  }

  // cursor spotlight + magnetic buttons + svc glow (fine pointer only, desktop)
  var spot = document.getElementById('spot');
  if(!RM && window.matchMedia('(pointer:fine)').matches && window.innerWidth > 980){
    if(spot){
      window.addEventListener('mousemove', function(e){ spot.style.opacity='1'; spot.style.left=e.clientX+'px'; spot.style.top=e.clientY+'px'; }, {passive:true});
    }
    document.querySelectorAll('.svc,.svc-ov-card').forEach(function(c){
      c.addEventListener('mousemove', function(e){ var r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); }, {passive:true});
    });
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){ var r=el.getBoundingClientRect(); var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; el.style.transform='translate('+x*0.22+'px,'+y*0.3+'px)'; }, {passive:true});
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  // animated counter
  function count(el){
    var t = +el.getAttribute('data-count'), pre = el.getAttribute('data-prefix')||'', num = el.querySelector('.num'), s=null, d=1600;
    if(!num) return;
    if(RM){ num.textContent = pre + t.toLocaleString(); return; }
    function step(ts){ if(!s)s=ts; var p=Math.min((ts-s)/d,1), e=1-Math.pow(1-p,3); num.textContent = pre + Math.round(t*e).toLocaleString(); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  // reveal + counters via IntersectionObserver (no forced reflow / no scroll thrashing)
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:0, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rev').forEach(function(el){ io.observe(el); });

    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ count(en.target); cio.unobserve(en.target); } });
    }, {threshold:0.4});
    document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });
  } else {
    document.querySelectorAll('.rev').forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  }
})();
