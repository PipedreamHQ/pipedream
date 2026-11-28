import { createHash } from "crypto";

/**
 * Adds the LogBrew dashboard link to an issue
 * @param {object} issue - An issue from the LogBrew API
 * @param {string} dashboardUrl - The LogBrew dashboard base URL
 * @returns {object} The issue with a `url` field
 */
function withIssueUrl(issue, dashboardUrl) {
  return {
    ...issue,
    url: `${dashboardUrl}/dashboard/issues/${encodeURIComponent(issue.id)}`,
  };
}

/**
 * Builds a fixed-length event ID from its parts
 * @param {...(string|number)} parts - The values that identify the event
 * @returns {string} A 64-character SHA-256 hex digest
 */
function hashId(...parts) {
  return createHash("sha256").update(parts.join(":"))
    .digest("hex");
}

export default {
  withIssueUrl,
  hashId,
};
