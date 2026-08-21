import app from "../../ez_texting.app.mjs";

export default {
  key: "ez_texting-block-numbers",
  name: "Block Numbers",
  description: "Block outbound texts to one or more phone numbers, e.g. after a recipient opts out. [See the documentation](https://developers.eztexting.com/reference/blockoutboundtexts-1)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phoneNumbers: {
      propDefinition: [
        app,
        "phoneNumbers",
      ],
      description: "The phone numbers to block outbound texts to, e.g. `5551234567`.",
    },
  },
  async run({ $ }) {
    const { phoneNumbers } = this;

    const response = await this.app.blockNumbers({
      $,
      data: {
        phoneNumbers,
      },
    });

    $.export("$summary", `Successfully blocked ${phoneNumbers.length} number(s)`);

    return response;
  },
};
