const DRAFTS_KEY = "invoice-generator:drafts";
const ACTIVE_DRAFT_KEY = "invoice-generator:active-draft-id";

const hasWindow = () => typeof window !== "undefined";

const readJson = (key, fallback) => {
  if (!hasWindow()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const createDraftId = () => {
  const stamp = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `draft-${stamp}-${randomPart}`;
};

export const loadInvoiceDrafts = () => readJson(DRAFTS_KEY, []);

export const saveInvoiceDrafts = (drafts) => {
  writeJson(DRAFTS_KEY, drafts);
};

export const loadActiveDraftId = () => readJson(ACTIVE_DRAFT_KEY, "");

export const saveActiveDraftId = (draftId) => {
  writeJson(ACTIVE_DRAFT_KEY, draftId || "");
};

export const upsertInvoiceDraft = (drafts, draft) => {
  const nextDrafts = drafts.filter((item) => item.id !== draft.id);
  return [draft, ...nextDrafts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const deleteInvoiceDraft = (drafts, draftId) => {
  return drafts.filter((draft) => draft.id !== draftId);
};

export const getDraftDisplayLabel = (draft) => {
  return draft?.label || draft?.data?.invoiceNumber || "Untitled invoice";
};

export const getDraftUpdatedLabel = (draft) => {
  if (!draft?.updatedAt) {
    return "Just now";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(draft.updatedAt));
};