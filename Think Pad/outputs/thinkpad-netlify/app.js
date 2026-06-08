const STORAGE_KEY = "thinkpad.records.v1";

const elements = {
  todayLabel: document.querySelector("#today-label"),
  thoughtForm: document.querySelector("#thought-form"),
  bodyInput: document.querySelector("#thought-body-input"),
  recordList: document.querySelector("#record-list"),
  template: document.querySelector("#record-template"),
  emptyHint: document.querySelector("#empty-hint"),
  exportRecords: document.querySelector("#export-records"),
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatShortDate(isoOrDate) {
  const date = new Date(isoOrDate);
  return String(date.getMonth() + 1) + "/" + String(date.getDate()) + " (" + weekdays[date.getDay()] + ")";
}

function formatExportDateTime(iso) {
  const date = new Date(iso);
  return String(date.getFullYear()) + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

let records = loadRecords();

function loadRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((record) => record && record.iso && record.body)
      : [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function createRecord(body) {
  return {
    id: `${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2)}`,
    body,
    iso: new Date().toISOString(),
  };
}

function addRecord(body) {
  records.push(createRecord(body));
  saveRecords();
  render();
}

function formatDateTime(iso) {
  return formatExportDateTime(iso);
}

function getSortedRecords() {
  return records.slice().sort((a, b) => new Date(b.iso) - new Date(a.iso));
}

function render() {
  const sortedRecords = getSortedRecords();

  elements.emptyHint.hidden = sortedRecords.length > 0;
  elements.exportRecords.disabled = sortedRecords.length === 0;
  elements.recordList.replaceChildren();

  sortedRecords.forEach((record) => {
    const item = elements.template.content.firstElementChild.cloneNode(true);
    const body = item.querySelector("p");
    const recordDate = item.querySelector(".record-date");
    const copyButton = item.querySelector(".copy-record");
    const deleteButton = item.querySelector(".delete-record");

    body.textContent = record.body;
    recordDate.dateTime = record.iso;
    recordDate.textContent = formatShortDate(record.iso);
    copyButton.addEventListener("click", () => {
      copyRecord(record, copyButton);
    });
    deleteButton.addEventListener("click", () => {
      records = records.filter((savedRecord) => savedRecord.id !== record.id);
      saveRecords();
      render();
    });

    elements.recordList.append(item);
  });
}

async function copyRecord(record, button) {
  const text = [formatShortDate(record.iso), "", record.body].join("\n");

  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.hidden = true;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  button.textContent = "COPIED";
  window.setTimeout(() => {
    button.textContent = "COPY";
  }, 1200);
}

function getExportText() {
  const sortedRecords = getSortedRecords();
  return sortedRecords
    .map((record) => [formatExportDateTime(record.iso), "", record.body].join("\n"))
    .join("\n\n---\n\n");
}

elements.thoughtForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const body = elements.bodyInput.value.trim();
  if (!body) return;
  addRecord(body);
  elements.thoughtForm.reset();
  elements.bodyInput.focus();
});

async function exportRecords() {
  if (records.length === 0) return;

  const fileName = `thinkpad-${new Date().toISOString().slice(0, 10)}.txt`;
  const file = new File([getExportText()], fileName, { type: "text/plain;charset=utf-8" });

  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    await navigator.share({
      title: "ThinkPad records",
      files: [file],
    });
    return;
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

elements.exportRecords.addEventListener("click", () => {
  exportRecords().catch(() => {});
});

elements.todayLabel.textContent = formatShortDate(new Date());
render();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js");
}
