import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-bounces",
  name: "Delete Bounces",
  description: "Allows you to delete all emails on your bounces list. [See the docs here](https://docs.sendgrid.com/api-reference/bounces-api/delete-bounces)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    deleteAll: {
      propDefinition: [
        common.props.sendgrid,
        "deleteAll",
      ],
      description: "This parameter allows you to delete every email in your bounce list. This can not be used with the `emails` parameter.",
    },
    emails: {
      propDefinition: [
        common.props.sendgrid,
        "bouncedEmails",
      ],
    },
  },
  async run({ $ }) {
    if (this.deleteAll && this.emails) {
      throw new Error("Must provide only one of `deleteAll` or `emails` parameters.");
    }
    const resp = await this.sendgrid.deleteBounces(this.deleteAll, this.emails);
    $.export("$summary", "Successfully deleted bounces");
    return resp;
  },
};
