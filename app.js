/* Cyber Design — shared interactions (all pages) */
(function(){
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav scroll state + progress bar
  var nav = document.getElementById('nav');
  var sbar = document.getElementById('sbar');
  function onScroll(){
    var y = window.scrollY;
    if(nav) nav.classList.toggle('scrolled', y > 20);
    if(sbar){ var h = document.documentElement.scrollHeight - window.innerHeight; sbar.style.width = (h>0 ? (y/h*100) : 0) + '%'; }
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

  // cursor spotlight + magnetic buttons + svc glow (fine pointer only)
  var spot = document.getElementById('spot');
  if(!RM && window.matchMedia('(pointer:fine)').matches){
    if(spot){
      window.addEventListener('mousemove', function(e){ spot.style.opacity='1'; spot.style.left=e.clientX+'px'; spot.style.top=e.clientY+'px'; });
    }
    document.querySelectorAll('.svc,.svc-ov-card').forEach(function(c){
      c.addEventListener('mousemove', function(e){ var r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); });
    });
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){ var r=el.getBoundingClientRect(); var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; el.style.transform='translate('+x*0.22+'px,'+y*0.3+'px)'; });
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

  // robust scroll-based reveal + counter trigger
  var revEls = [].slice.call(document.querySelectorAll('.rev'));
  var countEls = [].slice.call(document.querySelectorAll('[data-count]'));
  var ticking = false;
  function check(){
    ticking = false;
    var vh = window.innerHeight;
    revEls = revEls.filter(function(el){ var r=el.getBoundingClientRect(); if(r.top<vh*0.9 && r.bottom>0){ el.classList.add('in'); return false; } return true; });
    countEls = countEls.filter(function(el){ var r=el.getBoundingClientRect(); if(r.top<vh*0.85 && r.bottom>0){ count(el); return false; } return true; });
  }
  function onScrollReveal(){ if(!ticking){ ticking=true; requestAnimationFrame(check); } }
  window.addEventListener('scroll', onScrollReveal, {passive:true});
  window.addEventListener('resize', onScrollReveal, {passive:true});
  window.addEventListener('load', check);
  check();
})();
