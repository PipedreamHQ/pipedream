import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-contact",
  version: "0.0.1",
  type: "action",
  name: "Find Contact",
  description: "Finds contacts according to props configured, if no prop configured returns all contacts [See the docs here](https://api.salesflare.com/docs#operation/getContacts)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "integer[]",
      label: "Contact IDs",
      description: "Array of contact IDs",
      optional: true,
    },
    account: {
      propDefinition: [
        app,
        "accountIds",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of a contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of a contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of a contact.",
      optional: true,
    },
    tagName: {
      type: "string[]",
      label: "Tag Name",
      description: "Tag name to find contacts.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Any search string.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const items = [];
    const pairs = {
      phoneNumber: "phone_number",
      tagName: "tag_name",
    };
    const params = utils.extractProps(this, pairs);
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getContacts,
      resourceFnArgs: {
        $,
        params,
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} contact${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
