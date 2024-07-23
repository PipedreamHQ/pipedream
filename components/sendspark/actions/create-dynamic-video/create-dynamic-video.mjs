import sendspark from "../../sendspark.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendspark-create-dynamic-video",
  name: "Create Dynamic Video",
  description: "Creates a new dynamic video campaign. [See the documentation](https://help.sendspark.com/en/articles/9051823-api-automatically-create-dynamic-videos-via-api-integration)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendspark,
    name: {
      propDefinition: [
        sendspark,
        "name",
      ],
    },
    workspaceId: {
      propDefinition: [
        sendspark,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendspark.createDynamicVideoCampaign({
      workspaceId: this.workspaceId,
      name: this.name,
    });

    $.export("$summary", `Successfully created dynamic video campaign with name ${this.name}`);
    return response;
  },
};
