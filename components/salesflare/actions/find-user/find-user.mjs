import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-user",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Users",
  description: "Finds users according to props configured, if no prop configured returns all users [See the docs here](https://api.salesflare.com/docs#operation/getUsers)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "integer[]",
      label: "User IDs",
      description: "User IDs",
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
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
  },
  async run ({ $ }) {
    const items = [];
    const params = utils.extractProps(this, {});
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getUsers,
      resourceFnArgs: {
        $,
        params,
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} user${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
