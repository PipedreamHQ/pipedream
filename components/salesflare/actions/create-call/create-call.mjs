import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-create-call",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Call",
  description: "Create a call. [See the docs here](https://api.salesflare.com/docs#operation/postCalls)",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "Call date. It should be in ISO format. e.g. `2019-08-24T14:15:22Z`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the call. It should be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    participants: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "integer[]",
      label: "Participants",
      description: "Participants of the call.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of call. Max `200` characters.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the call.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes",
      optional: true,
    },
  },
  async run ({ $ }) {
    const pairs = {
      endDate: "end_date",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createCall({
      $,
      data,
    });
    $.export("$summary", `Call (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
