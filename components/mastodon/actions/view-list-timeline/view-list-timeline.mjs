import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-view-list-timeline",
  name: "View List Timeline",
  description: "View statuses in the given list timeline. [See the docs here](https://docs.joinmastodon.org/methods/timelines/#list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mastodon,
    list: {
      propDefinition: [
        mastodon,
        "list",
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
    const timeline = await this.mastodon.paginate(this.mastodon.viewListTimeline, {
      $,
      listId: this.list,
    }, this.max);
    $.export("$summary", `Successfully retrieved ${timeline.length} item(s) from list timeline`);
    return timeline;
  },
};
