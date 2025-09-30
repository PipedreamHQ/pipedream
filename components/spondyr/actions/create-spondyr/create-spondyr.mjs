import spondyr from "../../spondyr.app.mjs";

export default {
  key: "spondyr-create-spondyr",
  name: "Create Spondyr",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Generate and optionally deliver correspondence. [See the docs here](https://client.spondyr.io/#/Public/Public/Documentation?Section=send-api)",
  type: "action",
  props: {
    spondyr,
    transactionType: {
      propDefinition: [
        spondyr,
        "transactionType",
      ],
    },
    eventType: {
      propDefinition: [
        spondyr,
        "eventType",
        (c) => ({
          transactionType: c.transactionType,
        }),
      ],
    },
    isGenerateOnly: {
      type: "boolean",
      label: "Is Generate Only",
      description: "Set this flag to true to pause/defer delivery until a followup call is made via the Deliver API. This is useful for scenarios where you wish to view/preview the generated correspondence and validate things before allowing the correspondence to be delivered.",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "It should contain your application's specific data, which should be in the same format as you defined for the `Transaction Type`",
    },
  },
  async run({ $ }) {
    const {
      eventType,
      isGenerateOnly,
      data,
    } = this;

    const response = await this.spondyr.createSpondyr({
      $,
      EventType: eventType,
      IsGenerateOnly: isGenerateOnly,
      Data: data,
    });
    $.export("$summary", `Spondyr Successfully created with id ${response.ReferenceID}!`);
    return response;
  },
};
