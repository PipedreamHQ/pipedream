import aweberApp from "../../aweber.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aweber-add-subscriber",
  name: "Add Subscriber",
  description: "Add subscribers to the specified account and list. [See the docs here](https://api.aweber.com/#tag/Subscribers/paths/~1accounts~1{accountId}~1lists~1{listId}~1subscribers/post).",
  type: "action",
  version: "0.0.1",
  props: {
    aweberApp,
    accountId: {
      propDefinition: [
        aweberApp,
        "accountId",
      ],
    },
    listId: {
      propDefinition: [
        aweberApp,
        "listId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The subscriber's name",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "This field is used to apply a list of tags to a Subscriber. With Campaigns, you can trigger a series of messages based on what Tags have been applied to your subscribers.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      listId,
      email,
      name,
    } = this;

    const tags = utils.parse(this.tags);

    await this.aweberApp.addSubscriber({
      $,
      accountId,
      listId,
      data: {
        email,
        name,
        tags,
      },
    });

    $.export("$summary", `Successfully added subscriber with email ${email}.`);
  },
};
