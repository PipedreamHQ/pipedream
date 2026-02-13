/**
 * Microsoft Graph subscription constants for SharePoint webhooks.
 * https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions
 */

/**
 * Maximum subscription lifetime for driveItem resources is 42,300 minutes (~29.4 days).
 * We use 30 days in milliseconds for simplicity.
 */
const WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

/**
 * Renewal interval at 95% of max lifetime to ensure renewal before expiration.
 * 30 days * 0.95 = 28.5 days = 2,462,400 seconds
 */
const WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS =
  (WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS * 0.95) / 1000;

const SHARING_LINK_TYPE_OPTIONS = [
  {
    label: "Create a read-only link to the DriveItem",
    value: "view",
  },
  {
    label: "Create a read-write link to the DriveItem",
    value: "edit",
  },
  {
    label: "Create an embeddable link to the DriveItem. Only available for files in OneDrive personal.",
    value: "embed",
  },
];

const SHARING_LINK_SCOPE_OPTIONS = [
  {
    label: "Anyone with the link has access, without needing to sign in",
    value: "anonymous",
  },
  {
    label: "Anyone signed into your organization can use the link. Only available in OneDrive for Business and SharePoint.",
    value: "organization",
  },
];

export {
  WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
  WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
  SHARING_LINK_TYPE_OPTIONS,
  SHARING_LINK_SCOPE_OPTIONS,
};
