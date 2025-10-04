import listmonk from "../../listmonk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "listmonk-create-subscriber",
  name: "Create Subscriber",
  description: "Create a new subscriber in Listmonk. [See the documentation](https://listmonk.app/docs/apis/subscribers/#post-apisubscribers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    listmonk,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the subscriber to create.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber to create.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the new subscriber.",
      options: constants.STATUS_OPTIONS,
    },
    listIds: {
      propDefinition: [
        listmonk,
        "listIds",
      ],
      optional: true,
    },
    preconfirmSubscription: {
      type: "boolean",
      label: "Preconfirm Subscription",
      description: "If `true`, marks subscription as `confirmed` and no-optin e-mails are sent for double opt-in lists.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.listmonk.createSubscriber({
      data: {
        email: this.email,
        name: this.name,
        status: this.status,
        lists: this.listIds,
        preconfirm_subscriptions: this.preconfirmSubscription,
      },
      $,
    });

    if (data?.id) {
      $.export("$summary", `Successfully created subscriber with ID ${data.id}.`);
    }

    return data;
  },
};
