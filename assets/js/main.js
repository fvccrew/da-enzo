/* ============================================
   DA ENZO — MAIN.JS UNIQUE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- NAV SCROLL --- */
    const nav = document.querySelector('.nav');
    if (nav) {
        const check = () => nav.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', check);
        check();
    }

    /* --- NAV MOBILE --- */
    const burger = document.querySelector('.nav-burger');
    const links = document.querySelector('.nav-links');
    if (burger && links) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            burger.classList.remove('open');
            links.classList.remove('open');
        }));
    }

    /* --- SCROLL REVEAL --- */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.12 });
        reveals.forEach(el => obs.observe(el));
    }

    /* --- STAGGER CARDS --- */
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    staggerGroups.forEach(group => {
        const cards = group.children;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    Array.from(cards).forEach((c, i) => {
                        c.style.opacity = '0';
                        c.style.transform = 'translateY(20px)';
                        c.style.transition = `opacity .5s ease ${i * .1}s, transform .5s cubic-bezier(.22,1,.36,1) ${i * .1}s`;
                        requestAnimationFrame(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; });
                    });
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        obs.observe(group);
    });

    /* --- MENU ITEM STAGGER --- */
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const idx = Array.from(menuItems).indexOf(e.target) % 6;
                    e.target.style.transition = `opacity .45s ease ${idx * .06}s, transform .45s ease ${idx * .06}s`;
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateX(0)';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        menuItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-12px)';
            obs.observe(el);
        });
    }

    /* --- FILTER BUTTONS (carte + galerie) --- */
    document.querySelectorAll('[data-filter-group]').forEach(group => {
        const btns = group.querySelectorAll('.filter-btn');
        const targetSel = group.dataset.filterGroup;
        const items = document.querySelectorAll(targetSel);
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.dataset.filter;
                items.forEach((item, i) => {
                    const tag = item.dataset.tag || item.dataset.category;
                    if (f === 'all' || tag === f) {
                        item.classList.remove('hidden', 'filtered-out');
                        item.style.opacity = '0'; item.style.transform = 'scale(.97)';
                        setTimeout(() => {
                            item.style.transition = 'opacity .4s ease, transform .4s ease';
                            item.style.opacity = '1'; item.style.transform = 'scale(1)';
                        }, i * 40);
                    } else {
                        item.classList.add(item.classList.contains('menu-cat') ? 'hidden' : 'filtered-out');
                    }
                });
            });
        });
    });

    /* --- HERO PARALLAX --- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            heroBg.style.transform = `translateY(${window.scrollY * .25}px)`;
        });
    }

    /* --- INTRO PAGE (index.html) --- */
    const intro = document.querySelector('.intro');
    if (intro) {
        // Grain
        const grain = document.getElementById('grainCanvas');
        if (grain) {
            const ctx = grain.getContext('2d');
            const resize = () => { grain.width = window.innerWidth; grain.height = window.innerHeight; };
            resize(); window.addEventListener('resize', resize);
            let f = 0;
            (function loop() {
                f++;
                if (f % 4 === 0) {
                    const d = ctx.createImageData(grain.width, grain.height);
                    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 255; }
                    ctx.putImageData(d, 0, 0);
                }
                requestAnimationFrame(loop);
            })();
        }

        // Tagline lettre par lettre
        const tag = document.querySelector('.intro-tag');
        if (tag) {
            const spans = tag.querySelectorAll('span');
            spans.forEach((s, i) => {
                const base = 2200;
                s.style.animationDelay = `${base + i * 35}ms`;
            });
        }

        // Parallax logo sur souris
        const logo = document.querySelector('.intro-logo');
        if (logo) {
            document.addEventListener('mousemove', e => {
                const x = (e.clientX / window.innerWidth - .5) * 10;
                const y = (e.clientY / window.innerHeight - .5) * 10;
                logo.style.transform = `translate(${x}px, ${y}px)`;
            });
        }

        // Bouton entrer
        const enterBtn = document.querySelector('.intro-enter');
        if (enterBtn) {
            enterBtn.addEventListener('click', e => {
                e.preventDefault();
                intro.classList.add('leaving');
                setTimeout(() => { window.location.href = enterBtn.getAttribute('href'); }, 900);
            });
        }
    }

    /* --- FORMULAIRE CONTACT --- */
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        const dateInput = document.getElementById('date');
        if (dateInput) { const t = new Date().toISOString().split('T')[0]; dateInput.min = t; dateInput.value = t; }

        submitBtn.addEventListener('click', () => {
            const fields = ['nom','email','telephone','date'].map(id => document.getElementById(id));
            const empty = fields.filter(f => !f.value.trim());
            if (empty.length) {
                empty.forEach(f => { f.style.borderColor = '#8b3a3a'; setTimeout(() => f.style.borderColor = '', 2000); });
                return;
            }
            submitBtn.textContent = 'Envoi…'; submitBtn.style.opacity = '.5'; submitBtn.style.pointerEvents = 'none';
            const form = document.getElementById('resaForm');
            const success = document.getElementById('resaSuccess');
            setTimeout(() => {
                form.style.transition = 'opacity .4s, transform .4s';
                form.style.opacity = '0'; form.style.transform = 'translateY(-15px)';
                setTimeout(() => {
                    form.style.display = 'none';
                    success.style.display = 'block'; success.style.opacity = '0'; success.style.transform = 'translateY(15px)';
                    setTimeout(() => { success.style.transition = 'opacity .4s, transform .4s'; success.style.opacity = '1'; success.style.transform = 'translateY(0)'; }, 30);
                }, 400);
            }, 1000);
        });
    }

    /* --- SMOOTH ANCHORS --- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
});
