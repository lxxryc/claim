  const loadBtn = document.getElementById('loadBtn');
  const gcashBtn = document.getElementById('gcashBtn');
  const loadForm = document.getElementById('loadForm');
  const gcashForm = document.getElementById('gcashForm');
  const rewardTypeInput = document.getElementById('rewardType');
  const form = document.getElementById('entryForm');
  const bgVideo = document.getElementById('bgVideo');
  const bgImage = document.getElementById('bgImage');
  const popup = document.getElementById('submissionPopup');
  const closePopup = document.getElementById('closePopup');
  const countdownEl = document.getElementById('countdown');

  loadBtn.addEventListener('click', () => {
    loadBtn.classList.add('active');
    gcashBtn.classList.remove('active');
    loadForm.style.display = 'block';
    gcashForm.style.display = 'none';
    rewardTypeInput.value = 'Load';
    loadForm.querySelectorAll('input, select').forEach(el => el.required = true);
    gcashForm.querySelectorAll('input').forEach(el => el.required = false);
  });

  gcashBtn.addEventListener('click', () => {
    gcashBtn.classList.add('active');
    loadBtn.classList.remove('active');
    gcashForm.style.display = 'block';
    loadForm.style.display = 'none';
    rewardTypeInput.value = 'GCash';
    gcashForm.querySelectorAll('input').forEach(el => el.required = true);
    loadForm.querySelectorAll('input, select').forEach(el => el.required = false);
  });

  bgVideo.onerror = () => {
    bgVideo.style.display = 'none';
    bgImage.style.display = 'block';
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';

    const formData = new FormData(form);
    fetch("https://formspree.io/f/xanpvjav", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(resp => {
        if (resp.ok) {
          form.reset();
          popup.classList.add('show');
        } else {
          alert('Oops! Something went wrong.');
        }
      })
      .catch(() => alert('Error submitting form.'))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      });
  });

  closePopup.addEventListener('click', () => popup.classList.remove('show'));

  function allowOnlyNumbers(input) {
    input.addEventListener('input', () => input.value = input.value.replace(/\D/g, ''));
  }
  allowOnlyNumbers(document.getElementById('loadNumber'));
  allowOnlyNumbers(document.getElementById('gcashNumber'));

  const lockedInputs = document.querySelectorAll('input, select, button.reward-btn, button[type="submit"]');

  const openDate = { year: 2025, month: 10, day: 27, hour: 19, minute: 30 }; 
  const availabilityDuration = { hours: 1, minutes: 0, seconds: 0 }; 
  const availabilityMode = "enable";

  const availableDuration =
    ((availabilityDuration.hours * 3600) +
    (availabilityDuration.minutes * 60) +
    availabilityDuration.seconds) * 1000;

  function disableInputs() {
    lockedInputs.forEach(input => {
      if (input.tagName === 'BUTTON') input.setAttribute('disabled', 'disabled');
      else input.setAttribute('readonly', 'readonly');
    });
  }

  function enableInputs() {
    lockedInputs.forEach(input => {
      input.removeAttribute('disabled');
      input.removeAttribute('readonly');
    });
  }

  if (availabilityMode.toLowerCase() === "disable") {
    countdownEl.textContent = "Unavailable.";
    disableInputs();
  } else {
    const targetTime = new Date(openDate.year, openDate.month - 1, openDate.day, openDate.hour, openDate.minute);
    let mainCountdownInterval, availabilityInterval, availabilityEndTime;

    function updateCountdown() {
      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        startAvailability();
        clearInterval(mainCountdownInterval);
      } else {
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        countdownEl.textContent = `Available in: ${days}d ${hours}:${minutes}:${seconds}`;
        disableInputs();
      }
    }

    function startAvailability() {
      enableInputs();
      availabilityEndTime = new Date(new Date().getTime() + availableDuration);
      availabilityInterval = setInterval(updateAvailabilityCountdown, 1000);
      updateAvailabilityCountdown();
    }

    function updateAvailabilityCountdown() {
      const now = new Date();
      const diff = availabilityEndTime - now;

      if (diff <= 0) {
        endAvailability();
        clearInterval(availabilityInterval);
      } else {
        const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        countdownEl.textContent = `Available — ${hours}:${minutes}:${seconds}`;
      }
    }

    function endAvailability() {
      countdownEl.textContent = "See you next time.";
      disableInputs();
    }

    mainCountdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


  }

    if (window.innerWidth > 768) { 
    function preventDefault(e) { e.preventDefault(); }
    function disableScroll() {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    disableScroll();
  }

