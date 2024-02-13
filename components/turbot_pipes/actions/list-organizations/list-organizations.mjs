import turbotPipes from "../../turbot_pipes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "turbot_pipes-list-organizations",
  name: "List Organizations",
  description: "List all organizations in Turbot Pipes. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/orgs/operation/org_list)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    turbotPipes,
  },
  async run({ $ }) {
    const organizations = await this.turbotPipes.paginate(this.turbotPipes.listOrganizations);
    $.export("$summary", "Successfully listed organizations");
    return organizations;
  },
};
