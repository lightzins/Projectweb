document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });

  const quoteForm = document.getElementById('quoteForm');
  const formInputView = document.getElementById('formInputView');
  const formSummaryView = document.getElementById('formSummaryView');
  const btnNewProposal = document.getElementById('btnNewProposal');
  const submitBtn = document.getElementById('submitBtn');
  const btnLabel = document.getElementById('btnLabel');

  if (quoteForm && formInputView && formSummaryView) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value;
      const contact = document.getElementById('clientContact').value;
      const projectType = document.getElementById('projectType').value;
      const details = document.getElementById('projectDetails').value || 'Não informado';

      const originalText = btnLabel.innerText;
      btnLabel.innerText = 'Registrando proposta...';
      submitBtn.style.opacity = '0.75';
      submitBtn.disabled = true;

      setTimeout(() => {
        const proposalData = {
          id: Date.now(),
          date: new Date().toLocaleString('pt-BR'),
          name,
          contact,
          projectType,
          details,
          status: 'Nova'
        };

        const existing = JSON.parse(localStorage.getItem('pw_proposals') || '[]');
        existing.unshift(proposalData);
        localStorage.setItem('pw_proposals', JSON.stringify(existing));

        document.getElementById('summaryName').innerText = name;
        document.getElementById('summaryContact').innerText = contact;
        document.getElementById('summaryType').innerText = projectType;
        document.getElementById('summaryDetails').innerText = details;

        formInputView.style.display = 'none';
        formSummaryView.style.display = 'block';

        btnLabel.innerText = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        quoteForm.reset();
      }, 700);
    });

    if (btnNewProposal) {
      btnNewProposal.addEventListener('click', () => {
        formSummaryView.style.display = 'none';
        formInputView.style.display = 'block';
      });
    }
  }

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(12, 14, 18, 0.96)';
    }
  });

  const canvas = document.getElementById('interactiveFluidCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5
    };

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    const fluidBlobs = [
      { x: width * 0.5, y: height * 0.5, r: 280, color1: 'rgba(184, 240, 27, 0.45)', color2: 'rgba(130, 210, 15, 0.15)', factor: 0.08, offsetX: 0, offsetY: 0 },
      { x: width * 0.35, y: height * 0.6, r: 230, color1: 'rgba(230, 255, 80, 0.35)', color2: 'rgba(184, 240, 27, 0.1)', factor: 0.05, offsetX: -160, offsetY: 70 },
      { x: width * 0.65, y: height * 0.45, r: 250, color1: 'rgba(100, 220, 40, 0.35)', color2: 'rgba(50, 150, 20, 0.1)', factor: 0.06, offsetX: 170, offsetY: -60 },
      { x: width * 0.5, y: height * 0.7, r: 320, color1: 'rgba(184, 240, 27, 0.25)', color2: 'rgba(20, 50, 10, 0.1)', factor: 0.04, offsetX: 30, offsetY: 130 }
    ];

    let time = 0;

    function drawFluidScene() {
      time += 0.025;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      fluidBlobs.forEach((blob, idx) => {
        const waveX = Math.sin(time + idx * 1.8) * 45;
        const waveY = Math.cos(time * 0.8 + idx) * 40;

        const targetX = mouse.x + blob.offsetX + waveX;
        const targetY = mouse.y + blob.offsetY + waveY;

        blob.x += (targetX - blob.x) * blob.factor;
        blob.y += (targetY - blob.y) * blob.factor;

        const radial = ctx.createRadialGradient(blob.x - blob.r * 0.2, blob.y - blob.r * 0.2, blob.r * 0.05, blob.x, blob.y, blob.r);
        radial.addColorStop(0, '#ffffff');
        radial.addColorStop(0.25, blob.color1);
        radial.addColorStop(0.65, blob.color2);
        radial.addColorStop(1, 'rgba(8, 10, 14, 0)');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawFluidScene);
    }

    drawFluidScene();

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const heroThreshold = 350;
      if (scrollPos > heroThreshold) {
        canvas.style.opacity = '0.95';
      } else {
        const ratio = Math.max(0, scrollPos / heroThreshold);
        canvas.style.opacity = (ratio * 0.95).toString();
      }
    });
  }

  const cards3D = document.querySelectorAll('.pillar-card, .solution-box, .method-card, .review-box, .floating-impact-card, .flux-stat-card');
  cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
});
