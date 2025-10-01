import laposta from "../../laposta.app.mjs";

export default {
  name: "Update Relation",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "laposta-update-relation",
  description: "Updates a relation. [See docs here (Go to `Change relationship`)](http://api.laposta.nl/doc/)",
  type: "action",
  props: {
    laposta,
    listId: {
      propDefinition: [
        laposta,
        "listId",
      ],
    },
    relationId: {
      propDefinition: [
        laposta,
        "relationId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    email: {
      label: "Email",
      description: "The e-mail address of the contact to be updated",
      type: "string",
      optional: true,
    },
    customFields: {
      label: "Custom Fields",
      description: "The values ​​of the additional fields updated. E.g. `{\"name\": \"Lucas Caresia\", \"dateofbirth\": \"1999-11-05\"}`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    this.customFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.this.customFields;

    const response = await this.laposta.updateRelation({
      $,
      relationId: this.relationId,
      data: {
        list_id: this.listId,
        email: this.email,
        custom_fields: {
          ...this.customFields,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated relation with id ${response.member.member_id}`);
    }

    return response;
  },
};
