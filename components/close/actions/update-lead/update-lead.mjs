import close from "../../close.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "close-update-lead",
  version: "0.0.1",
  name: "Update Lead",
  description: "Updates a lead, [See the docs](https://developer.close.com/resources/leads/#update-an-existing-lead)",
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
      label: "Contacts",
      description: "Please provide an object array e.g., \n\
        [\n { \n\
          \"name\": \"Gob\",\n\
          \"title\": \"Sr. Vice President\",\n\
          \"emails\": [ { \"type\": \"office\", \"email\": \"gob@example.com\" } ],\n\
          \"phones\": [ { \"type\": \"office\", \"phone\": \"8004445555\" } ] \n\
        }\n]",
      type: "string[]",
      optional: true,
    },
    addresses: {
      label: "Addresses",
      description: "Please provide an object array e.g.,\n\
      [\n {\n\
          \"label\": \"business\",\n\
          \"address_1\": \"747 Howard St\",\n\
          \"address_2\": \"Room 3\",\n\
          \"city\": \"San Francisco\",\n\
          \"state\": \"CA\",\n\
          \"zipcode\": \"94103\",\n\
          \"country\":\"US\",\n\
        }\n]",
      type: "string[]",
      optional: true,
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
    if (this.contacts) data.contacts = utils.parseObject(this.contacts);
    if (this.addresses) data.addresses = utils.parseObject(this.addresses);
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
