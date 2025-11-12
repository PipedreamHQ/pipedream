import adrapid from "../../adrapid.app.mjs";

export default {
  key: "adrapid-get-banner",
  name: "Get Banner",
  description: "Retrieves a specified banner. This action should be used after a 'create-banner' action to ensure that the banner is fully processed and ready for use. [See the documentation](https://docs.adrapid.com/api/overview)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.adrapid.getBanner({
      $,
      bannerId: this.bannerId,
    });

    $.export("$summary", `Successfully retrieved banner: ${response.id}`);
    return response;
  },
};
