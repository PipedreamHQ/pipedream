import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-blocks",
  name: "Delete Blocks",
  description: "Allows you to delete all email addresses on your blocks list. [See the docs here](https://docs.sendgrid.com/api-reference/blocks-api/delete-blocks)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    deleteAll: {
      propDefinition: [
        common.props.sendgrid,
        "deleteAll",
      ],
    },
    emails: {
      propDefinition: [
        common.props.sendgrid,
        "emails",
      ],
    },
  },
  async run({ $ }) {
    if (this.deleteAll && this.emails) {
      throw new Error("Must provide only one of `deleteAll` or `emails` parameters.");
    }
    const resp = await this.sendgrid.deleteBlocks(this.deleteAll, this.emails);
    $.export("$summary", "Successfully deleted blocks");
    return resp;
  },
};
