import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "salesflare-find-account",
  version: "0.0.1",
  name: "Find Account",
  description: "Finds accounts according to props configured, if no prop configured returns all accounts, [See the docs](https://api.salesflare.com/docs#operation/getAccounts)",
  props: {
    app,
    accountIds: {
      propDefinition: [
        app,
        "accountIds",
      ],
    },
    details: {
      type: "boolean",
      label: "Details",
      description: "Returns more detailed results, defaults to `true`",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Any search string.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Account name.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const items = [];
    const pairs = {
      accountIds: "id",
    };
    const params = utils.extractProps(this, pairs);
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getAccounts,
      resourceFnArgs: {
        $,
        params,
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} account${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
