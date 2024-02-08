import slite from "../../slite.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slite-fetch-sub-docs",
  name: "Fetch Sub-Documents",
  description: "Fetches a certain number of sub-documents related to a parent document in Slite. [See the documentation](https://slite.slite.page/p/obsom1-pf7s6tb/slite-api?backward=)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slite,
    parentId: {
      propDefinition: [
        slite,
        "parentId",
      ],
    },
    limit: {
      propDefinition: [
        slite,
        "limit",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const parentId = this.parentId;
    const limit = this.limit;

    const response = await this.slite.retrieveSubDocuments({
      parentId,
      limit,
    });

    $.export("$summary", `Successfully fetched ${response.length} sub-documents for parent ID ${parentId}`);
    return response;
  },
};
