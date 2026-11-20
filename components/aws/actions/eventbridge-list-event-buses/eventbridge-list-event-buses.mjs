import common from "../../common/common-eventbridge.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-eventbridge-list-event-buses",
  name: "EventBridge - List Event Buses",
  description: toSingleLineString(`
    Lists the EventBridge event buses in a region, optionally only those whose name starts with a prefix.
    Use it to find the \`eventBusName\` for **EventBridge - Send Event**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "eventBuses": [{ "name": "default", "arn": "arn:aws:events:us-east-1:123456789012:event-bus/default" }] }\`.
    [See the documentation](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_ListEventBuses.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws: common.props.aws,
    region: common.props.region,
    namePrefix: {
      type: "string",
      label: "Name Prefix",
      description: "Only list event buses whose name starts with this prefix, e.g. `orders-`. Leave empty to list all event buses.",
      optional: true,
    },
    maxItems: {
      propDefinition: [
        common.props.aws,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        common.props.aws,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        EventBuses, NextToken,
      } = await this.eventBridgeListEventBuses({
        NamePrefix: this.namePrefix || undefined,
        NextToken: token,
        Limit: 100,
      });
      return {
        items: (EventBuses ?? []).map(({
          Name: name, Arn: arn,
        }) => ({
          name,
          arn,
        })),
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("event bus", result, "event buses"));
    return listResult("eventBuses", result);
  },
};
