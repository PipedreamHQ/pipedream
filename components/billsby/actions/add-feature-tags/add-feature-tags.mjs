import billsby from "../../billsby.app.mjs";

export default {
  key: "billsby-add-feature-tags",
  name: "Add Feature Tags",
  description: "Add feature tags to a subscription. [See the documentation](https://support.billsby.com/reference/post-subscription-tags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    billsby,
    subscriptionIds: {
      propDefinition: [
        billsby,
        "subscriptionIds",
      ],
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "The names of the tags to add to the subscription",
    },
  },
  async run({ $ }) {
    const response = await this.billsby.addFeatureTags({
      $,
      data: {
        subscriptionUniqueIds: this.subscriptionIds,
        tagNames: this.tagNames,
      },
    });
    $.export("$summary", "Successfully added feature tags to subscription");
    return response;
  },
};
