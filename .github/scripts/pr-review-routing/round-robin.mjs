const DECISIVE_STATES = new Set([
  "APPROVED",
  "CHANGES_REQUESTED",
  "DISMISSED",
]);

const sameLogin = (a, b) => a?.toLowerCase() === b?.toLowerCase();

export function isReviewer(login, reviewers) {
  return reviewers.some((reviewer) => sameLogin(reviewer, login));
}

// Stateless: sequential PR numbers spread evenly, and re-runs pick the same person.
export function pickReviewer(prNumber, author, reviewers) {
  const pool = reviewers.filter((reviewer) => !sameLogin(reviewer, author));

  if (pool.length === 0) {
    return null;
  }

  return pool[prNumber % pool.length];
}

export function lastCodeOwnerReviewer(reviews, author, reviewers) {
  const review = reviews.findLast(({ user }) => {
    if (!user || sameLogin(user.login, author)) {
      return false;
    }

    return isReviewer(user.login, reviewers);
  });

  return review?.user.login ?? null;
}

export function changesRequestedBy(reviews) {
  const latestByUser = new Map();

  for (const review of reviews) {
    // GitHub returns `user: null` for reviews by deleted accounts.
    if (review.user && DECISIVE_STATES.has(review.state)) {
      latestByUser.set(review.user.login, review);
    }
  }

  const outstanding = [...latestByUser.values()]
    .filter((review) => review.state === "CHANGES_REQUESTED")
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));

  return outstanding.at(-1)?.user.login ?? null;
}
