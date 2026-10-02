import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-get-bundle",
  name: "Get Bundle",
  description: "Get a bundle (mission) with its account and video status."
    + " Use **List Bundles** to find bundle IDs."
    + " [See the documentation](https://developers.tokportal.com/bundles/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.tokportal.getBundle({
      $,
      bundleId: this.bundleId,
    });
    const bundle = response?.data ?? response;
    $.export("$summary", `Retrieved bundle ${bundle?.id ?? this.bundleId} (${bundle?.status ?? "unknown status"})`);
    return bundle;
  },
};
