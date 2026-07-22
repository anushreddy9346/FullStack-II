// ---------- Platform rules (same as before) ----------
const LIMITS = {
  twitter: 280,
  instagram: 2200,
  linkedin: 3000
};

// ---------- Element references ----------
const platformSelect = document.getElementById("platform");
const textArea = document.getElementById("postText");
const counter = document.getElementById("counter");
const submitBtn = document.getElementById("submitBtn");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const saveStatus = document.getElementById("saveStatus");
const draftList = document.getElementById("draftList");
const emptyHint = document.getElementById("emptyHint");

// ---------- Draft storage ----------
// Drafts are kept in localStorage under this key, as a JSON array.
// localStorage persists in the browser even after the page/tab is closed,
// which is what makes this a real "save" and not just in-memory state.
const STORAGE_KEY = "postComposerDrafts";

function getDrafts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveDraftsToStorage(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// ---------- Character limit + validation (same logic as before) ----------
function applyLimit() {
  const platform = platformSelect.value;
  const limit = LIMITS[platform];
  textArea.setAttribute("maxlength", limit);

  if (textArea.value.length > limit) {
    textArea.value = textArea.value.slice(0, limit);
  }
}

function updateCounterAndButton() {
  const platform = platformSelect.value;
  const limit = LIMITS[platform];
  const length = textArea.value.length;

  counter.textContent = length + " / " + limit + " characters";
  counter.className = "counter";

  if (length >= limit) {
    counter.classList.add("warn");
    counter.textContent += " — limit reached";
  } else if (length >= limit * 0.9) {
    counter.classList.add("warn");
    counter.textContent += " — almost at the limit";
  } else {
    counter.classList.add("ok");
  }

  submitBtn.disabled = length === 0;
  saveDraftBtn.disabled = length === 0;
}

function refresh() {
  applyLimit();
  updateCounterAndButton();
}

// ---------- Simulated backend call ----------
// In a real app this would be a fetch() to a server (e.g. POST /api/drafts).
// Here we fake that network round-trip with a delay, so the UI shows a
// realistic "Saving..." -> "Saved" flow instead of updating instantly.
function simulateBackendSave(draft) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id: draft.id });
    }, 700); // pretend the server takes 700ms to respond
  });
}

// ---------- Draft actions ----------
function handleSaveDraft() {
  const draft = {
    id: Date.now().toString(),       // simple unique id
    platform: platformSelect.value,
    text: textArea.value,
    savedAt: new Date().toLocaleString()
  };

  saveDraftBtn.disabled = true;
  saveStatus.textContent = "Saving draft...";
  saveStatus.className = "save-status";

  simulateBackendSave(draft).then((response) => {
    if (response.success) {
      const drafts = getDrafts();
      drafts.unshift(draft); // newest first
      saveDraftsToStorage(drafts);
      renderDrafts();

      saveStatus.textContent = "Draft saved.";
      saveStatus.classList.add("success");
    }
    updateCounterAndButton(); // re-enables the button if text is still valid
    setTimeout(() => {
      saveStatus.textContent = "";
    }, 2000);
  });
}

function handleLoadDraft(id) {
  const drafts = getDrafts();
  const draft = drafts.find((d) => d.id === id);
  if (!draft) return;

  platformSelect.value = draft.platform;
  textArea.value = draft.text;
  refresh();
}

function handleDeleteDraft(id) {
  const drafts = getDrafts().filter((d) => d.id !== id);
  saveDraftsToStorage(drafts);
  renderDrafts();
}

// ---------- Rendering the draft list ----------
function renderDrafts() {
  const drafts = getDrafts();
  draftList.innerHTML = "";

  if (drafts.length === 0) {
    draftList.appendChild(emptyHint);
    return;
  }

  drafts.forEach((draft) => {
    const card = document.createElement("div");
    card.className = "draft-card";

    const preview =
      draft.text.length > 80 ? draft.text.slice(0, 80) + "..." : draft.text;

    card.innerHTML = `
      <div class="draft-meta">
        <span class="draft-platform">${draft.platform}</span>
        <span>${draft.savedAt}</span>
      </div>
      <div class="draft-preview">${preview || "(empty draft)"}</div>
      <div class="draft-actions">
        <button class="load-btn" data-id="${draft.id}">Load</button>
        <button class="delete-btn" data-id="${draft.id}">Delete</button>
      </div>
    `;

    draftList.appendChild(card);
  });

  // Attach listeners after rendering, since these buttons are
  // created dynamically and don't exist in the original HTML.
  draftList.querySelectorAll(".load-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleLoadDraft(btn.dataset.id));
  });

  draftList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleDeleteDraft(btn.dataset.id));
  });
}

// ---------- Event listeners ----------
textArea.addEventListener("input", updateCounterAndButton);
platformSelect.addEventListener("change", refresh);
saveDraftBtn.addEventListener("click", handleSaveDraft);

submitBtn.addEventListener("click", function () {
  alert("Post submitted for " + platformSelect.value + "!");
  textArea.value = "";
  refresh();
});

// ---------- Initial load ----------
refresh();
renderDrafts();