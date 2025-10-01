import laposta from "../../laposta.app.mjs";

export default {
  name: "Delete Relation",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "laposta-delete-relation",
  description: "Deletes a relation. [See docs here (Go to `Remove relationship`)](http://api.laposta.nl/doc/)",
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
  },
  async run({ $ }) {
    const response = await this.laposta.deleteRelation({
      $,
      relationId: this.relationId,
      params: {
        list_id: this.listId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully deleted relation with id ${response.member.member_id}`);
    }

    return response;
  },
};
