// ===== مكتب أبو محمد - الوظائف التفاعلية الموحدة =====
const OFFICE_PHONE_INTL = '966563259401';
const OFFICE_PHONE_TEL = '+966563259401';

const SERVICE_LABELS = {
  citizenship: 'خدمات استخراج الجنسية',
  visa: 'خدمات استخراج التأشيرات',
  marriage: 'خدمات معاملات الزواج',
  m: 'تصريح زواج عبر أبشر',
  other: 'خدمات أخرى'
};

function openWhatsApp(message) {
  const text = message || 'مرحباً، أرغب في الاستفسار عن خدمات مكتب أبو محمد.';
  window.open('https://wa.me/' + OFFICE_PHONE_INTL + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
}

function callOffice() { window.location.href = 'tel:' + OFFICE_PHONE_TEL; }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('mobile-nav-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', function () {
    const willOpen = !nav.classList.contains('mobile-nav-open');
    nav.classList.toggle('mobile-nav-open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth < 768) closeMenu();
  }));

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  }, { passive: true });
}

function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  const sync = () => btn.classList.toggle('show', window.scrollY > 300);
  window.addEventListener('scroll', sync, { passive: true });
  btn.addEventListener('click', scrollToTop);
  sync();
}

function goToConsultation(serviceValue) {
  const section = document.getElementById('consultation');
  const select = document.getElementById('service');
  if (select && serviceValue) select.value = serviceValue;
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleBlog(id, btn) {
  const p = document.getElementById('blog-text-' + id);
  if (!p) return;
  const label = btn ? btn.querySelector('span') : null;
  const expanded = p.classList.toggle('blog-expanded');
  p.classList.toggle('line-clamp-3', !expanded);
  if (label) label.textContent = expanded ? 'إخفاء' : 'اقرأ المزيد';
}

function expandAllBlogs() {
  document.querySelectorAll('[id^="blog-text-"]').forEach(p => {
    p.classList.add('blog-expanded');
    p.classList.remove('line-clamp-3');
  });
}

function submitConsultation(event) {
  event.preventDefault();
  const form = document.getElementById('consultation-form');
  if (!form) return;
  const val = id => (form.querySelector('#' + id)?.value || '').trim();
  const name = val('name'), phone = val('phone');
  if (!name || !phone) { alert('يرجى تعبئة الاسم ورقم الهاتف على الأقل.'); return; }
  const serviceVal = val('service');
  let message = 'طلب حجز استشارة مجانية:\nالاسم: ' + name + '\nرقم الهاتف: ' + phone + '\n';
  if (val('email')) message += 'البريد الإلكتروني: ' + val('email') + '\n';
  message += 'نوع الخدمة: ' + (SERVICE_LABELS[serviceVal] || 'غير محدد') + '\n';
  if (val('date')) message += 'التاريخ المفضل: ' + val('date') + '\n';
  if (val('time')) message += 'الوقت المفضل: ' + val('time') + '\n';
  if (val('notes')) message += 'ملاحظات: ' + val('notes') + '\n';
  openWhatsApp(message);
}

function contactAboutService(serviceValue) {
  openWhatsApp('مرحباً، أرغب في الاستفسار عن: ' + (SERVICE_LABELS[serviceValue] || 'خدماتكم'));
}

let currentTestimonial = 0;
function getTestimonialCount(){ return document.querySelectorAll('.testimonial-slide').length || 1; }
function showTestimonial(index){
  const slides=document.querySelectorAll('.testimonial-slide');
  const dots=document.querySelectorAll('[data-dot]');
  slides.forEach((slide,i)=>{ slide.classList.toggle('hidden',i!==index); slide.classList.toggle('block',i===index); });
  dots.forEach((dot,i)=>{ dot.classList.toggle('bg-green-primary',i===index); dot.classList.toggle('bg-gray-300',i!==index); });
  currentTestimonial=index;
}
function nextTestimonial(){ showTestimonial((currentTestimonial+1)%getTestimonialCount()); }
function prevTestimonial(){ showTestimonial((currentTestimonial-1+getTestimonialCount())%getTestimonialCount()); }
function goToTestimonial(index){ showTestimonial(index); }

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initScrollToTop();
});

// ===== الحركة التلقائية للتقييمات والأرقام =====
let testimonialTimer = null;
function startTestimonialAutoplay() {
  if (document.querySelectorAll('.testimonial-slide').length < 2) return;
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 5000);
  const box = document.querySelector('.testimonial-slide')?.parentElement;
  if (box) {
    box.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
    box.addEventListener('mouseleave', () => { clearInterval(testimonialTimer); testimonialTimer = setInterval(nextTestimonial, 5000); });
  }
}
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const animate = el => {
    if (el.dataset.counted === '1') return;
    el.dataset.counted = '1';
    const target = Number(el.dataset.counter || 0), suffix = el.dataset.suffix || '';
    const duration = 1500, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased).toLocaleString('ar-SA') + suffix;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString('ar-SA') + suffix;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } }), {threshold:.3});
    counters.forEach(c => io.observe(c));
  } else counters.forEach(animate);
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('.testimonial-slide').length) { showTestimonial(0); startTestimonialAutoplay(); }
  initCounters();
});
