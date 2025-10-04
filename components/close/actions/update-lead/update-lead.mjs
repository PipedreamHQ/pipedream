import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "close-update-lead",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Lead",
  description: "Updates a lead. [See the documentation](https://developer.close.com/resources/leads/#update-an-existing-lead)",
  props: {
    close,
    lead: {
      propDefinition: [
        close,
        "lead",
      ],
    },
    name: {
      label: "Name",
      description: "Name of the lead",
      type: "string",
      optional: true,
    },
    url: {
      label: "Url",
      description: "Url",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "Description of the lead",
      type: "string",
      optional: true,
    },
    statusId: {
      propDefinition: [
        close,
        "statusId",
      ],
    },
    contacts: {
      propDefinition: [
        close,
        "contacts",
      ],
    },
    addresses: {
      propDefinition: [
        close,
        "addresses",
      ],
    },
    moreFields: {
      propDefinition: [
        close,
        "moreFields",
      ],
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.name) data.name = this.name;
    if (this.url) data.url = this.url;
    if (this.statusId) data.status_id = this.statusId;
    if (this.contacts) data.contacts = utils.parseArray(this.contacts);
    if (this.addresses) data.addresses = utils.parseArray(this.addresses);
    const moreFields = {};
    for (let key in this.moreFields) {
      moreFields[key] = utils.parseObject(this.moreFields[key]);
    }
    const response = await this.close.updateLead({
      leadId: this.lead,
      data: {
        ...data,
        ...moreFields,
      },
    });
    $.export("$summary", "Lead has been created.");
    return response.data;
  },
};
