// Runs with secrets on fork PRs: only make API calls, never check out or execute PR code.
import { readFileSync } from "node:fs";

import { createGitHub } from "./github.mjs";
import { setPrStatus } from "./board.mjs";
import { createNotifier } from "./notify.mjs";
import {
  pickReviewer,
  isReviewer,
  lastCodeOwnerReviewer,
  changesRequestedBy,
} from "./round-robin.mjs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const config = readJson(new URL("../../pr-review-routing.json", import.meta.url));
const { board, reviewers, slackChannel } = config;

function isPlaceholder(value) {
  return !value || String(value).startsWith("TODO");
}

function isConfigured() {
  return board.projectNumber > 0
    && reviewers.length > 0
    && !reviewers.some(isPlaceholder)
    && !isPlaceholder(slackChannel);
}

function toPr(raw, owner, repo) {
  return {
    owner,
    repo,
    number: raw.number,
    title: raw.title,
    url: raw.html_url,
    author: raw.user.login,
  };
}

function prLink(pr) {
  return `<${pr.url}|#${pr.number} ${pr.title}>`;
}

async function markReady({ gh, notifier }, pr, reviewer, isRereview) {
  const action = isRereview ? "Re-review requested" : "Review requested";

  console.log(`#${pr.number} → ${board.statuses.ready} (reviewer: ${reviewer}, re-review: ${isRereview})`);

  await setPrStatus(gh, board, pr, "ready");

  const reviewerMention = await notifier.mention(reviewer);

  await notifier.slackChannel(
    slackChannel,
    `${reviewerMention} ${action}: ${prLink(pr)} by @${pr.author}`,
  );

  const subject = `[${pr.repo}] ${action}: #${pr.number} ${pr.title}`;
  const body = [
    `Hi ${reviewer},`,
    "",
    `${pr.author} is ready for your ${isRereview ? "re-" : ""}review:`,
    pr.title,
    pr.url,
  ].join("\n");

  await notifier.email(reviewer, subject, body);
}

async function onReviewRequested(ctx, pr, event) {
  // Other automation (CodeRabbit, Dependabot, ...) is ignored.
  if (event.sender?.type === "Bot") {
    console.log("Requested by a bot, skipping.");
    return;
  }

  const reviewer = event.requested_reviewer?.login;

  if (!isReviewer(reviewer, reviewers)) {
    console.log("Requested reviewer is not a code owner, skipping.");
    return;
  }

  const reviews = await ctx.gh.listReviews(pr);
  const isRereview = reviews.some((review) => review.user?.login === reviewer);

  await markReady(ctx, pr, reviewer, isRereview);
}

async function onReadyForReview(ctx, pr, event) {
  const requested = event.pull_request.requested_reviewers
    .map((user) => user.login)
    .filter((login) => isReviewer(login, reviewers));

  // On "opened", GitHub also fires review_requested for these, and that run handles them.
  if (event.action === "opened" && requested.length > 0) {
    console.log(`Code owner already requested (${requested.join(", ")}), skipping.`);
    return;
  }

  if (requested.length > 0) {
    await markReady(ctx, pr, requested[0], false);
    return;
  }

  const reviews = await ctx.gh.listReviews(pr);
  const previous = lastCodeOwnerReviewer(reviews, pr.author, reviewers);
  const reviewer = previous ?? pickReviewer(pr.number, pr.author, reviewers);

  if (!reviewer) {
    console.log("No eligible reviewer, skipping.");
    return;
  }

  // The request fires review_requested, and that run moves the card and notifies.
  await ctx.gh.requestReviewer(pr, reviewer);
  console.log(`Requested ${reviewer} (${previous ? "previous reviewer" : "round-robin"}).`);
}

async function handlePrEvent(ctx, event) {
  const raw = event.pull_request;

  if (raw.draft || raw.state !== "open") {
    console.log("Draft or closed PR, skipping.");
    return;
  }

  const pr = toPr(raw, event.repository.owner.login, event.repository.name);

  if (event.action === "review_requested") {
    await onReviewRequested(ctx, pr, event);
  } else {
    await onReadyForReview(ctx, pr, event);
  }
}

// The payload can come from a fork, so only the PR number is trusted.
async function handleReview(ctx, payload) {
  const { gh, notifier } = ctx;
  const number = Number(payload.number);

  if (!Number.isInteger(number) || number <= 0) {
    throw new Error("Invalid PR number in review payload");
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const raw = await gh.getPull({ owner, repo, number });

  if (raw.state !== "open") {
    console.log("PR is closed, skipping.");
    return;
  }

  const pr = toPr(raw, owner, repo);
  const reviews = await gh.listReviews(pr);
  const reviewer = changesRequestedBy(reviews);

  if (!reviewer) {
    console.log("No outstanding CHANGES_REQUESTED review, skipping.");
    return;
  }

  console.log(`#${number} → ${board.statuses.changes} (reviewer: ${reviewer})`);

  await setPrStatus(gh, board, pr, "changes");

  const authorMention = await notifier.mention(pr.author);
  const reviewerMention = await notifier.mention(reviewer);

  await notifier.slackChannel(
    slackChannel,
    `${authorMention} ${reviewerMention} requested changes on ${prLink(pr)}. `
      + `When it's ready, click "Re-request review" next to ${reviewer} on the PR.`,
  );
}

async function main() {
  if (!isConfigured()) {
    console.log("pr-review-routing.json still has placeholders, nothing to do.");
    return;
  }

  const ctx = {
    gh: createGitHub(process.env.GH_TOKEN),
    notifier: createNotifier(),
  };

  const mode = process.env.MODE;

  if (mode === "pr") {
    await handlePrEvent(ctx, readJson(process.env.GITHUB_EVENT_PATH));
  } else if (mode === "review") {
    await handleReview(ctx, readJson(process.env.REVIEW_EVENT_FILE));
  } else {
    throw new Error(`Unknown MODE "${mode}"`);
  }
}

await main();
