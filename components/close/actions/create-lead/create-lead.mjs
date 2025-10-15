import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "close-create-lead",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Lead",
  description: "Creates a lead. [See the documentation](https://developer.close.com/resources/leads/#create-a-new-lead)",
  props: {
    close,
    name: {
      label: "Name",
      description: "Name of the lead",
      type: "string",
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
    const response = await this.close.createLead({
      data: {
        name: this.name,
        url: this.url,
        status_id: this.statusId,
        contacts: utils.parseArray(this.contacts),
        addresses: utils.parseArray(this.addresses),
        ...moreFields,
      },
    });
    $.export("$summary", "Lead has been created.");
    return response.data;
  },
};
