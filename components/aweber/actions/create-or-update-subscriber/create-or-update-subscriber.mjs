import aweberApp from "../../aweber.app.mjs";

export default {
  key: "aweber-create-or-update-subscriber",
  name: "Create Or Update Subscriber",
  description: "Create subscriber if the subscriber email is not existing or update the information for the specified subscriber by email. [See the docs here](https://api.aweber.com/#tag/Subscribers/paths/~1accounts~1{accountId}~1lists~1{listId}~1subscribers/patch).",
  type: "action",
  version: "0.0.4",
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
      optional: true,
    },
    tags: {
      propDefinition: [
        aweberApp,
        "subscriberTags",
      ],
      optional: true,

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
      tags,
      notes,
    } = this;

    const subscribers = await this.aweberApp.getSubscribersForAccount({
      accountId,
      params: {
        "ws.op": "findSubscribers",
        email,
      },
    });

    let requestFn = subscribers?.entries?.length
      ? this.aweberApp.updateSubscriber
      : this.aweberApp.addSubscriber;

    const response = await requestFn({
      $,
      accountId,
      listId,
      email,
      data: {
        email,
        name,
        tags,
        notes,
      },
    });

    $.export("$summary", `Successfully created/updated subscriber with email ${email}.`);

    return response;
  },
};
