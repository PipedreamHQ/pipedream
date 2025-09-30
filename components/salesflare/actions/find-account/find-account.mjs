import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "salesflare-find-account",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      propDefinition: [
        app,
        "details",
      ],
    },
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
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
