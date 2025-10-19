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
    const moreFields = {};
    for (let key in this.moreFields) {
      moreFields[key] = utils.parseObject(this.moreFields[key]);
    }
    const response = await this.close.updateLead({
      leadId: this.lead,
      data: {
const response = await this.close.updateLead({
  leadId: this.lead,
  data: {
    ...(this.name && { name: this.name }),
    ...(this.url && { url: this.url }),
    ...(this.statusId && { status_id: this.statusId }),
    ...(this.contacts && { contacts: utils.parseArray(this.contacts) }),
    ...(this.addresses && { addresses: utils.parseArray(this.addresses) }),
    ...moreFields,
  },
});
        ...moreFields,
      },
    });
    $.export("$summary", "Lead has been created.");
    return response.data;
  },
};
