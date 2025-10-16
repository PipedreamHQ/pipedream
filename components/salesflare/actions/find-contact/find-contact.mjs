import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    tagName: {
      type: "string[]",
      label: "Tag Name",
      description: "Tag name to find contacts.",
      optional: true,
    },
    search: {
      propDefinition: [
        app,
        "search",
      ],
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
