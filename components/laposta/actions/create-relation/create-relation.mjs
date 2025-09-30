import laposta from "../../laposta.app.mjs";

export default {
  name: "Create Relation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "laposta-create-relation",
  description: "Creates a relation. [See docs here (Go to `Add relationship`)](http://api.laposta.nl/doc/)",
  type: "action",
  props: {
    laposta,
    listId: {
      propDefinition: [
        laposta,
        "listId",
      ],
    },
    email: {
      label: "Email",
      description: "The e-mail address of the contact to be added",
      type: "string",
    },
    ip: {
      label: "IP",
      description: "The IP address from which the relation is registered. Default `0.0.0.0`",
      type: "string",
      default: "0.0.0.0",
      optional: true,
    },
    customFields: {
      label: "Custom Fields",
      description: "The values ​​of the additional fields created. E.g. `{\"name\": \"Lucas Caresia\", \"dateofbirth\": \"1999-11-05\"}`",
      type: "string",
    },
  },
  async run({ $ }) {
    this.customFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.this.customFields;

    const response = await this.laposta.createRelation({
      $,
      data: {
        list_id: this.listId,
        email: this.email,
        ip: this.ip,
        custom_fields: {
          ...this.customFields,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created relation with id ${response.member.member_id}`);
    }

    return response;
  },
};
