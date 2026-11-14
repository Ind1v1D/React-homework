// Reviews "API". The data lives in localStorage, but every call is async like
// a real server, so components only reach it through TanStack Query hooks.
const KEY = "cinerate_reviews";
const LATENCY = 200;

const wait = () => new Promise((resolve) => setTimeout(resolve, LATENCY));

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    throw new Error("Could not save. Browser storage is unavailable.");
  }
}

export async function fetchReviews(movieId) {
  await wait();
  return readAll()[movieId] || [];
}

export async function createReview(movieId, review) {
  await wait();
  const all = readAll();
  const created = { ...review, id: Date.now(), date: new Date().toISOString() };
  all[movieId] = [created, ...(all[movieId] || [])];
  writeAll(all);
  return created;
}

export async function deleteReview(movieId, reviewId) {
  await wait();
  const all = readAll();
  all[movieId] = (all[movieId] || []).filter((r) => r.id !== reviewId);
  writeAll(all);
}
