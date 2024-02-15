import mobygames from "../../mobygames.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mobygames-list-platforms",
  name: "List Platforms",
  description: "List all platforms available for filtering games via the MobyGames API. [See the documentation](https://www.mobygames.com/info/api/#platforms)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mobygames,
  },
  async run({ $ }) {
    const response = await this.mobygames.getPlatforms();
    $.export("$summary", "Successfully retrieved platforms list");
    return response.map((platform) => ({
      label: platform.platform_name,
      value: platform.platform_id.toString(),
    }));
  },
};
