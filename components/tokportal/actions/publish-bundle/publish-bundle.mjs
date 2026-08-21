import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-publish-bundle",
  name: "Publish Bundle",
  description: "Publish a fully configured bundle to the account managers marketplace so a manager can pick it up."
    + " Configure the account (and videos, if any) first; the API answers 409 with the list of blockers when the bundle is not ready."
    + " Use **Create Bundle** to create the bundle and **List Bundles** to find its ID."
    + " [See the documentation](https://developers.tokportal.com/publish-unpublish/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tokportal,
    bundleId: {
      propDefinition: [
        tokportal,
        "bundleId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tokportal.publishBundle({
      $,
      bundleId: this.bundleId,
    });
    const bundle = response?.data ?? response;
    $.export("$summary", `Published bundle ${bundle?.id ?? this.bundleId}`);
    return response;
  },
};
