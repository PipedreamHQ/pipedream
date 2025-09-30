import sendy from "../../sendy.app.mjs";

export default {
  key: "sendy-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Removes a subscriber from a specified list. [See the documentation](https://sendy.co/api?app_path=https://sendy.email/dev2#unsubscribe)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendy,
    brandId: {
      propDefinition: [
        sendy,
        "brandId",
      ],
    },
    listId: {
      propDefinition: [
        sendy,
        "listId",
        ({ brandId }) => ({
          brandId,
        }),
      ],
    },
    email: {
      propDefinition: [
        sendy,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendy.removeSubscriber({
      $,
      data: {
        list: this.listId,
        email: this.email,
        boolean: true,
      },
    });

    $.export("$summary", response != 1
      ? response
      : `Successfully unsubscribed email: ${this.email} from list: ${this.listId}`);
    return response;
  },
};
