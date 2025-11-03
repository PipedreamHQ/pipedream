import app from "../../giantcampaign.app.mjs";

export default {
  name: "Add Tags to Subscriber",
  description: "Add tags to a new subscriber [See the documentation](https://giantcampaign.com/developers/#add-tags-to-subscriber).",
  key: "giantcampaign-add-tags-to-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    listUid: {
      propDefinition: [
        app,
        "listUid",
      ],
    },
    subscriberUid: {
      propDefinition: [
        app,
        "subscriberUid",
        (c) => ({
          listUid: c.listUid,
        }),
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },

  async run({ $ }) {
    console.log(this.tags);
    const res = await this.app.addTagsToSubscriber(
      this.subscriberUid,
      this.tags.join(","),
      $,
    );
    $.export("summary", `Tags added to "${this.subscriberUid}" subscriber.`);
    return res;
  },
};
