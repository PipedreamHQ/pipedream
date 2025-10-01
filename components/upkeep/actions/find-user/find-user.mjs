import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "upkeep-find-user",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find User",
  description: "Finds users according to props configured, if no prop configured returns all users, [See the docs](https://developers.onupkeep.com/#get-all-users)",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "If set, the result will only include user with that email.",
      optional: true,
    },
    accountType: { //no method to fetch account types
      type: "string",
      label: "Category",
      description: "If set, the result will only include user with that account type.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getUsers,
      resourceFnArgs: {
        $,
        params: {
          email: this.email,
          accountType: this.accountType,
        },
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} user${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
