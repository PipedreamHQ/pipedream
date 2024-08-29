import { SAMPLE_GITHUB_HEADERS } from "../common/constants.mjs";

export function getSampleWebhookEvent() {
  return {
    ...SAMPLE_GITHUB_HEADERS,
    id: 208045947,
    node_id: "MDU6TGFiZWwyMDgwNDU5NDc=",
    url: "https://api.github.com/repos/octocat/Hello-World/labels/enhancement",
    name: "enhancement",
    description: "New feature or request",
    color: "a2eeef",
    default: false,
  };
}

export function getSampleTimerEvent() {
  return {
    id: 208045947,
    node_id: "MDU6TGFiZWwyMDgwNDU5NDc=",
    url: "https://api.github.com/repos/octocat/Hello-World/labels/enhancement",
    name: "enhancement",
    description: "New feature or request",
    color: "a2eeef",
    default: false,
  };
}
