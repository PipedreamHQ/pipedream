import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-view-hashtag-timeline",
  name: "View Hashtag Timeline",
  description: "View public statuses containing the given hashtag. [See the docs here](https://docs.joinmastodon.org/methods/timelines/#tag)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mastodon,
    hashtag: {
      type: "string",
      label: "Hashtag",
      description: "The name of the hashtag (not including the # symbol)",
    },
    any: {
      type: "string[]",
      label: "Any",
      description: "Return statuses that contain ANY of these additional tags",
      optional: true,
    },
    all: {
      type: "string[]",
      label: "All",
      description: "Return statuses that contain ALL of these additional tags",
      optional: true,
    },
    none: {
      type: "string[]",
      label: "None",
      description: "Return statuses that contain NONE of these additional tags",
      optional: true,
    },
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
      any: this.any,
      all: this.all,
      none: this.none,
      local: this.local,
      remote: this.remote,
      only_media: this.onlyMedia,
    };
    const timeline = await this.mastodon.paginate(this.mastodon.viewHashtagTimeline, {
      $,
      hashtag: this.hashtag,
      params,
    }, this.max);
    $.export("$summary", `Successfully retrieved ${timeline.length} item(s) from hashtag timeline`);
    return timeline;
  },
};
