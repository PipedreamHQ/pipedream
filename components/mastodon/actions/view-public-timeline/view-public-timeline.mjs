import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-view-public-timeline",
  name: "View Public Timeline",
  description: "View public statuses. [See the docs here](https://docs.joinmastodon.org/methods/timelines/#public)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mastodon,
    local: {
      propDefinition: [
        mastodon,
        "local",
      ],
    },
    remote: {
      propDefinition: [
        mastodon,
        "remote",
      ],
    },
    onlyMedia: {
      propDefinition: [
        mastodon,
        "onlyMedia",
      ],
    },
    max: {
      propDefinition: [
        mastodon,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      local: this.local,
      remote: this.remote,
      only_media: this.onlyMedia,
    };
    const timeline = await this.mastodon.paginate(this.mastodon.viewPublicTimeline, {
      $,
      params,
    }, this.max);
    $.export("$summary", `Successfully retrieved ${timeline.length} item(s) from public timeline`);
    return timeline;
  },
};
