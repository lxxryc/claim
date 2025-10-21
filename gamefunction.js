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
const importantNote = document.getElementById('importantNote');


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



const openDate = { year: 2025, month: 10, day: 28, hour: 19, minute: 30 };
const availabilityDuration = { hours: 0, minutes: 05, seconds: 20 }; 
const availabilityMode = "enable"; // 


const availableDuration =
  ((availabilityDuration.hours * 3600) +
  (availabilityDuration.minutes * 60) +
  availabilityDuration.seconds) * 1000;

function formatTime(ms) {
  if (ms <= 0) return "00d 00:00:00";
  const d = String(Math.floor(ms / 86400000)).padStart(2, '0'); // days
  const h = String(Math.floor((ms % 86400000) / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${d}d ${h}:${m}:${s}`;
}



if (availabilityMode.toLowerCase() === "disable") {
  countdownEl.textContent = "Unavailable.";
  disableInputs();
  importantNote.style.display = 'block';
  importantNote.innerHTML = "<strong style='color: darkorange;'>Important:</strong> Input is currently disabled.";
} else {
  const openTime = new Date(openDate.year, openDate.month - 1, openDate.day, openDate.hour, openDate.minute);
  const closeTime = new Date(openTime.getTime() + availableDuration);

  function updateState() {
    const now = new Date();

    if (now < openTime) {
    
      disableInputs();
      const diff = openTime - now;
      countdownEl.textContent = ` ${formatTime(diff)}`;
      importantNote.style.display = 'block';
      importantNote.innerHTML = "<strong style='color: darkorange;'>Important:</strong> Input becomes available after the set duration.";
    } else if (now >= openTime && now <= closeTime) {
     
      enableInputs();
      const diff = closeTime - now;
      countdownEl.textContent = `Available — ${formatTime(diff)}`;
      importantNote.style.display = 'none';
    } else {
     
      disableInputs();
      countdownEl.textContent = "Closed.";
      importantNote.style.display = 'block';
      importantNote.innerHTML = "<strong style='color: darkorange;'>Important:</strong> Stay tuned for updates.";
    }
  }

  updateState();
  setInterval(updateState, 1000);
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
