// Salt's Card model requires action_id to match /\A[a-z0-9_-]{1,40}\z/ — this
// turns a human button label into a valid, stable id, with the button's
// position appended so two identically-labelled buttons never collide.
export function actionIdFor(label, index) {
  const slug = String(label)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
  return `${slug || "button"}-${index}`;
}
