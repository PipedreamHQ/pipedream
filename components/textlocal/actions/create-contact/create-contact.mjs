import textlocal from "../../textlocal.app.mjs";

export default {
  key: "textlocal-create-contact",
  name: "Create Contact",
  description:
    "Create a new contact. [See the docs here](https://api.txtlocal.com/docs/contactmanagement/createcontacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    textlocal,
    number: {
      propDefinition: [
        textlocal,
        "number",
      ],
    },
    firstName: {
      propDefinition: [
        textlocal,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        textlocal,
        "lastName",
      ],
      optional: true,
    },
    custom1: {
      propDefinition: [
        textlocal,
        "custom1",
      ],
      optional: true,
    },
    custom2: {
      propDefinition: [
        textlocal,
        "custom2",
      ],
      optional: true,
    },
    custom3: {
      propDefinition: [
        textlocal,
        "custom3",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        textlocal,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      group_id: this.groupId,
      contacts: JSON.stringify([
        {
          number: this.number,
          first_name: this.firstName,
          last_name: this.lastName,
          custom1: this.custom1,
          custom2: this.custom2,
          custom3: this.custom3,
        },
      ]),
    };
    const response = await this.textlocal.createContact({
      $,
      params,
    });

    $.export("$summary", `Successfully created contact ${this.firstName}`);
    return response;
  },
};
