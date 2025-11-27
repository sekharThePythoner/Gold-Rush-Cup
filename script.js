// ELEMENTS
const introOverlay = document.getElementById("intro-overlay");
const pageWrapper = document.getElementById("page-wrapper");

const enterBtn = document.getElementById("enter-site");
const heroRegisterBtn = document.getElementById("hero-register");
const audioToggleBtn = document.getElementById("audio-toggle");
const bgAudio = document.getElementById("bg-audio");

const popup = document.getElementById("tournament-popup");
const popupClose = document.getElementById("popup-close");
const popupRegister = document.getElementById("popup-register");
const popupDetails = document.getElementById("popup-details");

const form = document.getElementById("form");
const submitBtn = form.querySelector('button[type="submit"]');

// HELPERS
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// TAP TO CONTINUE
enterBtn.addEventListener("click", async () => {
  introOverlay.style.display = "none";
  pageWrapper.classList.remove("hidden");

  // Try to play audio (may fail if browser blocks, no issue)
  try {
    await bgAudio.play();
    audioToggleBtn.textContent = "🔊 Music On";
  } catch (err) {
    audioToggleBtn.textContent = "🔈 Music Off";
  }

  // Show tournament popup once
  popup.classList.remove("hidden");
});

// AUDIO TOGGLE
audioToggleBtn.addEventListener("click", async () => {
  if (bgAudio.paused) {
    try {
      await bgAudio.play();
      audioToggleBtn.textContent = "🔊 Music On";
    } catch (err) {
      console.log("Audio play blocked:", err);
    }
  } else {
    bgAudio.pause();
    audioToggleBtn.textContent = "🔈 Music Off";
  }
});

// HERO REGISTER BUTTON
heroRegisterBtn.addEventListener("click", () => {
  scrollToSection("registration");
});

// POPUP BUTTONS
popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
});

popupRegister.addEventListener("click", () => {
  popup.classList.add("hidden");
  scrollToSection("registration");
});

popupDetails.addEventListener("click", () => {
  popup.classList.add("hidden");
  scrollToSection("tournament-details");
});

// FORM SUBMIT (WEB3FORMS + VALIDATION)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // BASIC VALIDATIONS
  const humanInput = document.getElementById("human-answer");
  const upiTxnInput = document.getElementById("upi_txn");
  const whatsappInput = document.getElementById("captain_whatsapp");

  // human check: 6 + 3 = 9
  if (!humanInput || Number(humanInput.value) !== 9) {
    alert("Human check failed. 6 + 3 = 9 likh bhai 🤝");
    humanInput && humanInput.focus();
    return;
  }

  // UPI txn basic check
  if (!upiTxnInput.value || upiTxnInput.value.trim().length < 6) {
    alert("Please enter a valid UPI Transaction ID / UTR number.");
    upiTxnInput.focus();
    return;
  }

  // WhatsApp basic check
  if (!whatsappInput.value || whatsappInput.value.replace(/\D/g, "").length < 10) {
    alert("Please enter a valid WhatsApp number.");
    whatsappInput.focus();
    return;
  }

  // check all required checkboxes
  const checkNames = [
    "agree_rules",
    "agree_fairplay",
    "agree_prize",
    "agree_final",
    "agree_whatsapp"
  ];
  for (const name of checkNames) {
    const checkbox = form.querySelector(`input[name="${name}"]`);
    if (!checkbox || !checkbox.checked) {
      alert("Please agree to all rules & conditions before registering.");
      checkbox && checkbox.focus();
      return;
    }
  }

  // BUILD FORM DATA
  const formData = new FormData(form);
  // Append Web3Forms access key
  formData.append("access_key", "8ce4ed4b-a572-4294-ab5d-ff948d2f7fe5");
  // Optional: subject & from_name for email
  formData.append("subject", "New Duo Registration - GOLD RUSH DUO CUP S1");
  formData.append("from_name", "Gold Rush Cup Website");

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Check WhatsApp near match time for Room ID & Password.");
      form.reset();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
