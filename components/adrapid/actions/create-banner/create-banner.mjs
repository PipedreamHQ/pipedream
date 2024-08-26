import adrapid from "../../adrapid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adrapid-create-banner",
  name: "Create Banner",
  description: "Generates a new banner using provided data. This action can create different types of banners, such as animated HTML5, image, or video banners. [See the documentation](https://docs.adrapid.com/api/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adrapid,
    bannerData: {
      propDefinition: [
        adrapid,
        "bannerData",
      ],
    },
    bannerSettings: {
      propDefinition: [
        adrapid,
        "bannerSettings",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adrapid.createBanner({
      bannerData: this.bannerData,
      bannerSettings: this.bannerSettings,
    });

    $.export("$summary", `Banner created successfully with ID: ${response.id}`);
    return response;
  },
};
