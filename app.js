const BASE_URL = "https://rentry.co/";

const form = document.querySelector("#code-form");
const input = document.querySelector("#code-input");
const preview = document.querySelector("#preview");
const errorEl = document.querySelector("#error");
const copyButton = document.querySelector("#copy-button");

function normalizeCode(raw) {
  let code = raw.trim();
  // 사용자가 전체 URL이나 슬래시를 붙여 넣어도 코드만 추출
  code = code.replace(/^https?:\/\//i, "");
  code = code.replace(/^(www\.)?rentry\.(co|org)\//i, "");
  code = code.replace(/^\/+/, "");
  code = code.replace(/\/+$/, "");
  return code;
}

function buildUrl(code) {
  return BASE_URL + encodeURIComponent(code);
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function updatePreview() {
  const code = normalizeCode(input.value);
  if (!code) {
    preview.textContent = "";
    return;
  }
  preview.textContent = buildUrl(code);
}

input.addEventListener("input", () => {
  clearError();
  updatePreview();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = normalizeCode(input.value);

  if (!code) {
    showError("코드를 입력해 주세요.");
    input.focus();
    return;
  }

  clearError();
  window.open(buildUrl(code), "_blank", "noopener");
});

copyButton.addEventListener("click", async () => {
  const code = normalizeCode(input.value);
  if (!code) {
    showError("코드를 입력해 주세요.");
    input.focus();
    return;
  }

  clearError();
  const url = buildUrl(code);

  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("no clipboard");
    await navigator.clipboard.writeText(url);
  } catch {
    const field = document.createElement("textarea");
    field.value = url;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  const original = copyButton.textContent;
  copyButton.textContent = "복사됨!";
  window.setTimeout(() => {
    copyButton.textContent = original;
  }, 1200);
});

// 시작 시 URL의 ?code= 파라미터가 있으면 자동 채움
const params = new URLSearchParams(window.location.search);
const initialCode = params.get("code");
if (initialCode) {
  input.value = initialCode;
  updatePreview();
}

input.focus();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
