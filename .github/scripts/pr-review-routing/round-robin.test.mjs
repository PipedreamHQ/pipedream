// Run: node --test .github/scripts/pr-review-routing/
import test from "node:test";
import assert from "node:assert/strict";
import {
  pickReviewer, lastCodeOwnerReviewer, changesRequestedBy,
} from "./round-robin.mjs";

const reviewers = [
  "alice",
  "bob",
  "carol",
  "dave",
];

test("pickReviewer is deterministic and rotates", () => {
  assert.equal(pickReviewer(100, "zed", reviewers), "alice");
  assert.equal(pickReviewer(101, "zed", reviewers), "bob");
  assert.equal(pickReviewer(103, "zed", reviewers), "dave");
  assert.equal(pickReviewer(103, "zed", reviewers), pickReviewer(103, "zed", reviewers));
});

test("pickReviewer never picks the author (case-insensitive)", () => {
  for (let n = 0; n < 50; n++) assert.notEqual(pickReviewer(n, "Bob", reviewers), "bob");
});

test("pickReviewer spreads evenly", () => {
  const counts = {};
  for (let n = 0; n < 400; n++) {
    const r = pickReviewer(n, "zed", reviewers);
    counts[r] = (counts[r] ?? 0) + 1;
  }
  assert.deepEqual(Object.values(counts), [
    100,
    100,
    100,
    100,
  ]);
});

test("pickReviewer returns null when the author is the only reviewer", () => {
  assert.equal(pickReviewer(1, "alice", [
    "alice",
  ]), null);
});

const review = (login, state, submitted_at) => ({
  user: {
    login,
  },
  state,
  submitted_at,
});

test("lastCodeOwnerReviewer ignores non-owners and the author", () => {
  const reviews = [
    review("carol", "COMMENTED", "2026-01-01T00:00:00Z"),
    review("outsider", "CHANGES_REQUESTED", "2026-01-02T00:00:00Z"),
    review("zed", "COMMENTED", "2026-01-03T00:00:00Z"),
  ];
  assert.equal(lastCodeOwnerReviewer(reviews, "zed", reviewers), "carol");
  assert.equal(lastCodeOwnerReviewer([], "zed", reviewers), null);
});

test("changesRequestedBy uses each reviewer's latest decisive review", () => {
  assert.equal(changesRequestedBy([
    review("bob", "CHANGES_REQUESTED", "2026-01-01T00:00:00Z"),
    review("bob", "COMMENTED", "2026-01-02T00:00:00Z"),
  ]), "bob");
  assert.equal(changesRequestedBy([
    review("bob", "CHANGES_REQUESTED", "2026-01-01T00:00:00Z"),
    review("bob", "APPROVED", "2026-01-02T00:00:00Z"),
  ]), null);
  assert.equal(changesRequestedBy([
    review("bob", "CHANGES_REQUESTED", "2026-01-01T00:00:00Z"),
    review("carol", "CHANGES_REQUESTED", "2026-01-03T00:00:00Z"),
  ]), "carol");
});
