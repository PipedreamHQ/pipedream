import dexatel from "../../dexatel.app.mjs";

export default {
  key: "dexatel-create-contact",
  name: "Create Contact",
  description: "Allows creation of a new contact on the user's Dexatel account.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dexatel,
    audienceId: {
      propDefinition: [
        dexatel,
        "audienceId",
      ],
    },
    firstName: {
      propDefinition: [
        dexatel,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        dexatel,
        "lastName",
      ],
    },
    number: {
      propDefinition: [
        dexatel,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dexatel.createContact({
      $,
      audienceId: this.audienceId,
      data: {
        data: {
          first_name: this.firstName,
          last_name: this.lastName,
          number: this.number,
        },
      },
    });
    $.export("$summary", `Successfully created contact ${this.firstName} with number ${this.number}`);
    return response;
  },
};
