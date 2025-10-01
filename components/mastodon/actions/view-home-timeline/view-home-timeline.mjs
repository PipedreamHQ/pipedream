import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-view-home-timeline",
  name: "View Home Timeline",
  description: "View statuses from followed users. [See the docs here](https://docs.joinmastodon.org/methods/timelines/#home)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mastodon,
    max: {
      propDefinition: [
        mastodon,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const timeline = await this.mastodon.paginate(this.mastodon.viewHomeTimeline, {
      $,
    }, this.max);
    $.export("$summary", `Successfully retrieved ${timeline.length} item(s) from home timeline`);
    return timeline;
  },
};
