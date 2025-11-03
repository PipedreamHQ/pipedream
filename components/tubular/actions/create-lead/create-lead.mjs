import app from "../../tubular.app.mjs";

export default {
  key: "tubular-create-lead",
  name: "Create Lead",
  description: "Create lead and return its ID. [See the documentation](https://developer.tubular.io/examples/#create-lead-and-return-its-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    lead: {
      propDefinition: [
        app,
        "lead",
      ],
    },
  },
  async run({ $ }) {
    const query = `
      mutation {
        addContact(input: {
          firstName: "${this.firstName}",
          lastName: "${this.lastName}",
          note: "${this.note}",
          lead: ${this.lead}
        }) {
          contact {
            id
          }
        }
      }
    `;

    const response = await this.app.post({
      $,
      data: {
        query,
      },
    });

    $.export("$summary", "Successfully created Lead with ID: " + response.data.addContact.contact.id);
    return response;
  },
};
