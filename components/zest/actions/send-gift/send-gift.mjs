import app from "../../zest.app.mjs";

export default {
  key: "zest-send-gift",
  name: "Send Gift",
  description: "Creates a gift within a specified campaign in Zest. [See the documentation](https://gifts.zest.co/admin/integrations/documentation#operation/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the recipient",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "A personalized note to include with the gift",
      optional: true,
    },
    deliveryMethod: {
      type: "string",
      label: "Delivery Method",
      description: "The delivery method for the gift",
      optional: true,
      options: [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Unique Links",
          value: "unique_links",
        },
      ],
    },
  },
  methods: {
    sendGift(args = {}) {
      return this.app.post({
        path: "/gift",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const  {
      sendGift,
      ...data
    } = this;

    const response = await sendGift({
      $,
      data,
    });

    $.export("$summary", `Successfully created a gift with ID ${response.id}`);
    return response;
  },
};
