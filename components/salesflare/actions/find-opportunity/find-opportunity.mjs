import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-opportunity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Opportunity",
  description: "Finds opportunities according to props configured, if no prop configured returns all opportunities [See the docs here](https://api.salesflare.com/docs#operation/getOpportunities)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
    owner: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    account: {
      propDefinition: [
        app,
        "accountIds",
      ],
      type: "integer",
      label: "Account ID",
      description: "Account ID",
    },
    assignee: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Assignee",
      description: "Assignee",
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    minValue: {
      type: "integer",
      label: "Min Value",
      description: "Min value, min `0`",
      optional: true,
    },
    maxValue: {
      type: "integer",
      label: "Max Value",
      description: "Max value",
      optional: true,
    },
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Is closed",
      optional: true,
    },
    done: {
      type: "boolean",
      label: "Done",
      description: "Is done",
      optional: true,
    },
    details: {
      propDefinition: [
        app,
        "details",
      ],
    },
  },
  async run ({ $ }) {
    const items = [];
    const pairs = {
      minValue: "min_value",
      maxValue: "max_value",
    };
    const params = utils.extractProps(this, pairs);
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getOpportunities,
      resourceFnArgs: {
        $,
        params,
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} opporunit${items.length != 1 ? "ies" : "y"} has been found.`);
    return items;
  },
};
