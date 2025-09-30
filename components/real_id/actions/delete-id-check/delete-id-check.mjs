import app from "../../real_id.app.mjs";

export default {
  key: "real_id-delete-id-check",
  name: "Delete ID Check",
  description: "Permanently delete all data associated with a specific ID check. [See the documentation](https://getverdict.com/help/docs/api/checks#delete-id-check-data).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    checkId: {
      propDefinition: [
        app,
        "checkId",
      ],
    },
  },
  methods: {
    deleteIdCheck({
      checkId, ...args
    } = {}) {
      return this.app.delete({
        path: `/checks/${checkId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteIdCheck,
      checkId,
    } = this;

    const response = await deleteIdCheck({
      $,
      checkId,
    });
    $.export("$summary", `Successfully deleted ID check \`${response.check.id}\`.`);
    return response;
  },
};
