import adrapid from "../../adrapid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adrapid-get-banner",
  name: "Get Banner",
  description: "Retrieves a specified banner. This action should be used after a 'create-banner' action to ensure that the banner is fully processed and ready for use. [See the documentation](https://docs.adrapid.com/api/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adrapid,
    bannerId: {
      propDefinition: [
        adrapid,
        "bannerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adrapid.retrieveBanner({
      bannerId: this.bannerId,
    });

    $.export("$summary", `Successfully retrieved banner: ${response.id}`);
    return response;
  },
};
