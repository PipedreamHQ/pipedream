import app from "../../aws.app.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";

export default {
  key: "aws-redshift-list-workgroups",
  name: "Redshift - List Workgroups",
  description: "Lists the Amazon Redshift Serverless workgroups in a region with their name and status. Use it to find the `workgroupName` for **Redshift - List Databases**, **Redshift - List Schemas**, **Redshift - List Tables**, **Redshift - Query Database** and the other Redshift actions. Check `truncated` first: when it is `true`, call again with `nextToken` set to the returned `nextToken`. Example result: `{ \"truncated\": false, \"nextToken\": null, \"count\": 1, \"workgroups\": [{ \"name\": \"default-workgroup\", \"status\": \"AVAILABLE\" }] }`. [See the documentation](https://docs.aws.amazon.com/redshift-serverless/latest/APIReference/API_ListWorkgroups.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    maxItems: {
      propDefinition: [
        app,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        app,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        workgroups, nextToken,
      } = await this.app.listWorkgroups(this.region, {
        nextToken: token,
      });
      return {
        items: (workgroups ?? []).map(({
          workgroupName: name, status,
        }) => ({
          name,
          status,
        })),
        nextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("workgroup", result));
    return listResult("workgroups", result);
  },
};
