import aweberApp from "../../aweber.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aweber-update-subscriber",
  name: "Update Subscriber",
  description: "Update the information for the specified subscriber by email. [See the docs here](https://api.aweber.com/#tag/Subscribers/paths/~1accounts~1{accountId}~1lists~1{listId}~1subscribers/patch).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        aweberApp,
        "email",
        ({
          accountId, listId,
        }) => ({
          accountId,
          listId,
        }),
      ],
    },
    name: {
      propDefinition: [
        aweberApp,
        "subscriberName",
      ],
    },
    tags: {
      propDefinition: [
        aweberApp,
        "subscriberTags",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Miscellaneous notes about the subscriber",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      listId,
      email,
      name,
      notes,
    } = this;

    const tags = utils.parse(this.tags);

    const response = await this.aweberApp.updateSubscriber({
      $,
      accountId,
      listId,
      email,
      data: {
        email,
        name,
        tags: {
          add: tags,
        },
        misc_notes: notes,
      },
    });

    $.export("$summary", `Successfully updated subscriber with email ${email}.`);

    return response;
  },
};
