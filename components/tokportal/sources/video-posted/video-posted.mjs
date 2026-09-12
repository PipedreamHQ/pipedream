import common from "../common/base.mjs";

export default {
  ...common,
  key: "tokportal-video-posted",
  name: "New Video Posted (Instant)",
  description: "Emit new event when a video posted by the account manager passes final review (`video.finalized`)."
    + " The payload includes the `platform_url` of the live post. Enable **Include In-Review Events** to also emit"
    + " `video.in_review` as soon as the manager submits the posted URL, before review."
    + " [See the documentation](https://developers.tokportal.com/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    includeInReview: {
      type: "boolean",
      label: "Include In-Review Events",
      description: "Also emit `video.in_review` events (manager submitted the posted URL, awaiting review). Defaults to `false`.",
      optional: true,
      default: false,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.includeInReview
        ? [
          "video.in_review",
          "video.finalized",
        ]
        : [
          "video.finalized",
        ];
    },
    getDescription() {
      return "Pipedream source: New Video Posted";
    },
    getSummary(body) {
      const data = body?.data ?? {};
      return `Video ${body.type === "video.in_review"
        ? "in review"
        : "posted"}: bundle ${data.bundle_id ?? "unknown"} #${data.position ?? "?"}`;
    },
  },
};
