import common from "../../common/common-iam.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-iam-list-roles",
  name: "IAM - List Roles",
  description: toSingleLineString(`
    Lists the IAM roles in the account with their name and ARN, optionally only those under a path prefix.
    Use it to find the role ARN to pass to **Lambda - Create Function**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "roles": [{ "name": "lambda-basic-execution", "arn": "arn:aws:iam::123456789012:role/lambda-basic-execution" }] }\`.
    [See the documentation](https://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRoles.html)
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
    pathPrefix: {
      type: "string",
      label: "Path Prefix",
      description: "Only list roles whose path starts with this prefix, e.g. `/service-role/`. Leave empty to list all roles.",
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
        Roles, IsTruncated, Marker,
      } = await this.listRoles({
        PathPrefix: this.pathPrefix || undefined,
        Marker: token,
        MaxItems: 1000,
      });
      return {
        items: (Roles ?? []).map(({
          RoleName: name, Arn: arn,
        }) => ({
          name,
          arn,
        })),
        nextToken: IsTruncated
          ? Marker
          : undefined,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("role", result));
    return listResult("roles", result);
  },
};
