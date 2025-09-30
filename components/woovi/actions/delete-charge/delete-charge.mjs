import woovi from "../../woovi.app.mjs";

export default {
  key: "woovi-delete-charge",
  name: "Delete Charge",
  description: "Removes a specific charge from the system. [See the documentation](https://developers.woovi.com/en/api#tag/charge/paths/~1api~1v1~1charge~1%7Bid%7D/delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woovi,
    chargeId: {
      propDefinition: [
        woovi,
        "chargeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.woovi.deleteCharge({
      chargeId: this.chargeId,
      $,
    });

    if (response?.status === "OK") {
      $.export("$summary", `Successfully deleted charge with ID ${this.chargeId}.`);
    }

    return response;
  },
};
