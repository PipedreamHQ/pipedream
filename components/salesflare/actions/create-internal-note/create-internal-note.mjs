import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-create-internal-note",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Internal Note",
  description: "Create an internal note. [See the docs here](https://api.salesflare.com/docs#tag/Internal-Notes)",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
      optional: false,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Internal note body",
    },
    mentions: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Mentions",
      type: "integer[]",
      description: "Mentions to team members",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date. Must be in ISO format. e.g. `2022-11-17T08:07:00Z`",
      optional: true,
    },
  },
  async run ({ $ }) {
    const data = utils.extractProps(this, {});
    const resp = await this.app.createInternalNote({
      $,
      data,
    });
    $.export("$summary", `Internal Note (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
