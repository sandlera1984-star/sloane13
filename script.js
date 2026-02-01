const STORAGE_KEYS = {
  profile: "sloanex_profile",
  banner: "sloanex_banner",
  images: "sloanex_images",
  videos: "sloanex_videos",
};

const navButtons = document.querySelectorAll(".nav-button");
const sections = document.querySelectorAll(".page-section");
const termsOverlay = document.getElementById("terms-overlay");
const termsScroll = document.getElementById("terms-scroll");
const agreeBtn = document.getElementById("agree-btn");
const adultBtn = document.getElementById("adult-btn");
const signupBtn = document.getElementById("signup-btn");
const constructionBubble = document.getElementById("construction-bubble");
const expandOverlay = document.getElementById("expand-overlay");
const expandMedia = document.getElementById("expand-media");
const collapseBtn = document.getElementById("collapse-btn");
const imagesGrid = document.getElementById("images-grid");
const videosGrid = document.getElementById("videos-grid");
const profileCircle = document.getElementById("profile-circle");
const bannerBox = document.getElementById("banner-box");
const sidebarButtons = document.querySelectorAll(".sidebar-button");
const sidebarBack = document.getElementById("sidebar-back");
const exclusivePanels = document.querySelectorAll(".exclusive-panel");
const supportForm = document.getElementById("support-form");
const supportSubmit = document.getElementById("support-submit");
const adminLock = document.getElementById("admin-lock");
const adminContent = document.getElementById("admin-content");
const adminSubmit = document.getElementById("admin-submit");
const adminCodeInput = document.getElementById("admin-code");
const adminError = document.getElementById("admin-error");
const adminGallery = document.getElementById("admin-gallery");
const deleteConfirm = document.getElementById("delete-confirm");
const deleteYes = document.getElementById("delete-yes");
const deleteNo = document.getElementById("delete-no");

let pendingDelete = null;

const state = {
  profile: null,
  banner: null,
  images: [],
  videos: [],
};

const loadState = () => {
  state.profile = localStorage.getItem(STORAGE_KEYS.profile);
  state.banner = localStorage.getItem(STORAGE_KEYS.banner);
  state.images = JSON.parse(localStorage.getItem(STORAGE_KEYS.images) || "[]");
  state.videos = JSON.parse(localStorage.getItem(STORAGE_KEYS.videos) || "[]");
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEYS.profile, state.profile || "");
  localStorage.setItem(STORAGE_KEYS.banner, state.banner || "");
  localStorage.setItem(STORAGE_KEYS.images, JSON.stringify(state.images));
  localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(state.videos));
};

const setActiveSection = (targetId) => {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === targetId);
  });

  if (targetId === "exclusive-section") {
    document
      .querySelectorAll("#exclusive-section button")
      .forEach((button) => button.classList.remove("clicked"));
  }
};

const setClickedState = (button) => {
  button.classList.add("clicked");
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.target);
    setClickedState(button);
  });
});

const enableTermsButtons = () => {
  agreeBtn.disabled = false;
  adultBtn.disabled = false;
  agreeBtn.classList.remove("hidden");
  adultBtn.classList.remove("hidden");
};

termsScroll.addEventListener("scroll", () => {
  if (termsScroll.scrollTop + termsScroll.clientHeight >= termsScroll.scrollHeight - 4) {
    enableTermsButtons();
  }
});

const termsState = { agree: false, adult: false };

const updateTerms = () => {
  if (termsState.agree && termsState.adult) {
    termsOverlay.classList.add("hidden");
  }
};

agreeBtn.addEventListener("click", () => {
  termsState.agree = true;
  setClickedState(agreeBtn);
  updateTerms();
});

adultBtn.addEventListener("click", () => {
  termsState.adult = true;
  setClickedState(adultBtn);
  updateTerms();
});

signupBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  constructionBubble.classList.remove("hidden");
});

const hideConstruction = () => {
  if (!constructionBubble.classList.contains("hidden")) {
    constructionBubble.classList.add("hidden");
  }
};

document.addEventListener("click", () => {
  hideConstruction();
});

constructionBubble.addEventListener("click", (event) => {
  event.stopPropagation();
  hideConstruction();
});

const setProfileImage = () => {
  if (state.profile) {
    profileCircle.innerHTML = `<img src="${state.profile}" alt="Profile" />`;
  }
};

const setBannerImage = () => {
  if (state.banner) {
    bannerBox.innerHTML = `<img src="${state.banner}" alt="Banner" />`;
  }
};

const renderExclusiveContent = () => {
  imagesGrid.innerHTML = "";
  videosGrid.innerHTML = "";

  state.images.forEach((image) => {
    const card = document.createElement("div");
    card.className = "content-card";
    card.innerHTML = `<img src="${image.src}" alt="Uploaded image" />`;
    card.addEventListener("click", () => expandContent(image, "image"));
    imagesGrid.appendChild(card);
  });

  state.videos.forEach((video) => {
    const card = document.createElement("div");
    card.className = "content-card";
    const videoEl = document.createElement("video");
    videoEl.src = video.src;
    videoEl.controls = true;
    videoEl.addEventListener("click", (event) => {
      event.stopPropagation();
      expandContent(video, "video");
    });
    card.appendChild(videoEl);
    card.addEventListener("click", () => expandContent(video, "video"));
    videosGrid.appendChild(card);
  });
};

const renderAdminGallery = () => {
  adminGallery.innerHTML = "";

  const allItems = [
    ...state.images.map((item) => ({ ...item, kind: "image" })),
    ...state.videos.map((item) => ({ ...item, kind: "video" })),
  ];

  allItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "content-card";

    if (item.kind === "image") {
      card.innerHTML = `<img src="${item.src}" alt="Uploaded image" />`;
    } else {
      const videoEl = document.createElement("video");
      videoEl.src = item.src;
      videoEl.controls = true;
      card.appendChild(videoEl);

      const playBtn = document.createElement("button");
      playBtn.textContent = "Play";
      playBtn.className = "action-button";
      playBtn.addEventListener("click", () => {
        setClickedState(playBtn);
        videoEl.play();
      });
      card.appendChild(playBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-button";
    deleteBtn.addEventListener("click", () => {
      setClickedState(deleteBtn);
      pendingDelete = item;
      deleteConfirm.classList.remove("hidden");
      deleteYes.checked = false;
      deleteNo.checked = false;
    });

    card.appendChild(deleteBtn);
    adminGallery.appendChild(card);
  });
};

const expandContent = (item, type) => {
  expandMedia.innerHTML = "";
  const mediaEl = document.createElement(type === "image" ? "img" : "video");
  mediaEl.src = item.src;
  if (type === "video") {
    mediaEl.controls = true;
  }
  expandMedia.appendChild(mediaEl);
  expandOverlay.classList.remove("hidden");
};

collapseBtn.addEventListener("click", () => {
  setClickedState(collapseBtn);
  expandOverlay.classList.add("hidden");
  expandMedia.innerHTML = "";
});

expandOverlay.addEventListener("click", (event) => {
  if (event.target === expandOverlay) {
    expandOverlay.classList.add("hidden");
    expandMedia.innerHTML = "";
  }
});

sidebarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setClickedState(button);
    const target = button.dataset.subpage;
    if (!target) {
      return;
    }
    exclusivePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });

    const isExclusiveView = target === "exclusive-view";
    sidebarBack.classList.toggle("hidden", isExclusiveView);
  });
});

sidebarBack.addEventListener("click", () => {
  setClickedState(sidebarBack);
  exclusivePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === "exclusive-view");
  });
  sidebarBack.classList.add("hidden");
});

const updateSupportButton = () => {
  const name = document.getElementById("support-name").value.trim();
  const email = document.getElementById("support-email").value.trim();
  const description = document.getElementById("support-description").value.trim();
  supportSubmit.disabled = !(name && email && description);
};

const enforceWordLimit = () => {
  const descriptionField = document.getElementById("support-description");
  const words = descriptionField.value.trim().split(/\s+/).filter(Boolean);
  if (words.length > 200) {
    descriptionField.value = words.slice(0, 200).join(" ");
  }
};

supportForm.addEventListener("input", () => {
  enforceWordLimit();
  updateSupportButton();
});

supportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  supportSubmit.disabled = true;
  setClickedState(supportSubmit);

  const payload = {
    name: document.getElementById("support-name").value.trim(),
    email: document.getElementById("support-email").value.trim(),
    description: document.getElementById("support-description").value.trim(),
  };

  try {
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send support request");
    }

    supportForm.reset();
    updateSupportButton();
    exclusivePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === "exclusive-view");
    });
    sidebarBack.classList.add("hidden");
  } catch (error) {
    supportSubmit.disabled = false;
  }
});

const adminUnlocked = () => sessionStorage.getItem("adminUnlocked") === "true";

const unlockAdmin = () => {
  sessionStorage.setItem("adminUnlocked", "true");
  adminLock.classList.add("hidden");
  adminContent.classList.remove("hidden");
};

adminSubmit.addEventListener("click", async () => {
  setClickedState(adminSubmit);
  const code = adminCodeInput.value.trim();
  adminError.textContent = "";

  try {
    const response = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Invalid code");
    }

    unlockAdmin();
  } catch (error) {
    adminError.textContent = "Invalid code. Try again.";
  }
});

const resetProgress = (card) => {
  const progress = card.querySelector(".progress");
  const bar = card.querySelector(".progress-bar");
  const fill = card.querySelector(".progress-fill");
  const label = card.querySelector(".progress-label");
  const time = card.querySelector(".progress-time");

  progress.classList.remove("complete");
  fill.style.width = "0%";
  label.textContent = "0%";
  label.style.color = "inherit";
  time.textContent = "0s";

  return { progress, fill, label, time };
};

const updateProgress = (fill, label, percent) => {
  const value = Math.min(100, Math.round(percent));
  fill.style.width = `${value}%`;
  label.textContent = `${value}%`;
};

const markComplete = (progress, label) => {
  progress.classList.add("complete");
  label.textContent = "Complete";
  label.style.color = "#2ecc71";
};

const handleFileUpload = (file, card, type) => {
  const { progress, fill, label, time } = resetProgress(card);
  let seconds = 0;
  const timer = setInterval(() => {
    seconds += 1;
    time.textContent = `${seconds}s`;
  }, 1000);

  const reader = new FileReader();
  reader.onprogress = (event) => {
    if (event.lengthComputable) {
      updateProgress(fill, label, (event.loaded / event.total) * 100);
    }
  };

  reader.onload = () => {
    clearInterval(timer);
    updateProgress(fill, label, 100);
    markComplete(progress, label);
    const src = reader.result;
    if (type === "profile") {
      state.profile = src;
      setProfileImage();
    } else if (type === "banner") {
      state.banner = src;
      setBannerImage();
    } else if (type === "images") {
      state.images.push({ id: Date.now(), src });
    } else if (type === "videos") {
      state.videos.push({ id: Date.now(), src });
    }
    saveState();
    renderExclusiveContent();
    renderAdminGallery();
  };

  reader.readAsDataURL(file);
};

const setupUploadCards = () => {
  document.querySelectorAll(".upload-card").forEach((card) => {
    const dropZone = card.querySelector(".drop-zone");
    const input = card.querySelector(".file-input");
    const type = card.dataset.upload;

    dropZone.addEventListener("click", () => input.click());
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("active");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("active"));
    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("active");
      const files = Array.from(event.dataTransfer.files);
      files.forEach((file) => handleFileUpload(file, card, type));
    });

    input.addEventListener("change", () => {
      const files = Array.from(input.files);
      files.forEach((file) => handleFileUpload(file, card, type));
      input.value = "";
    });
  });
};

const handleDelete = () => {
  if (!pendingDelete) {
    return;
  }
  if (deleteYes.checked) {
    if (pendingDelete.kind === "image") {
      state.images = state.images.filter((item) => item.id !== pendingDelete.id);
    } else {
      state.videos = state.videos.filter((item) => item.id !== pendingDelete.id);
    }
    saveState();
    renderExclusiveContent();
    renderAdminGallery();
  }
  pendingDelete = null;
  deleteConfirm.classList.add("hidden");
  deleteYes.checked = false;
  deleteNo.checked = false;
};

deleteYes.addEventListener("change", handleDelete);

deleteNo.addEventListener("change", () => {
  pendingDelete = null;
  deleteConfirm.classList.add("hidden");
  deleteYes.checked = false;
  deleteNo.checked = false;
});

const init = () => {
  loadState();
  setProfileImage();
  setBannerImage();
  renderExclusiveContent();
  renderAdminGallery();
  setupUploadCards();

  if (adminUnlocked()) {
    unlockAdmin();
  }
};

init();
