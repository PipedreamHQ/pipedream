import passslot from "../../passslot.app.mjs";

export default {
  key: "passslot-delete-pass",
  name: "Delete Pass",
  description: "Deletes a specified pass from PassSlot. [See the documentation](https://www.passslot.com/developer/api/resources/deletePass)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    passslot,
    passTypeIdentifier: {
      propDefinition: [
        passslot,
        "passTypeIdentifier",
      ],
    },
    passSerialNumber: {
      propDefinition: [
        passslot,
        "passSerialNumber",
        (c) => ({
          passTypeIdentifier: c.passTypeIdentifier,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.passslot.deletePass({
      $,
      passTypeIdentifier: this.passTypeIdentifier,
      passSerialNumber: this.passSerialNumber,
    });

    $.export("$summary", `Successfully deleted pass with serial number: ${this.passSerialNumber}`);

    return response;
  },
};
