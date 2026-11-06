import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-list-bundles",
  name: "List Bundles",
  description: "List the bundles (missions) of the workspace with optional filters (status, bundle type, platform, external reference)."
    + " Returns bundle objects; pass an ID to **Get Bundle** or **Publish Bundle**."
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
    status: {
      propDefinition: [
        tokportal,
        "bundleStatus",
      ],
      optional: true,
    },
    bundleType: {
      propDefinition: [
        tokportal,
        "bundleType",
      ],
      optional: true,
    },
    platform: {
      propDefinition: [
        tokportal,
        "platform",
      ],
      optional: true,
    },
    externalRef: {
      propDefinition: [
        tokportal,
        "externalRef",
      ],
      description: "Only return bundles created with this exact `external_ref`.",
      optional: true,
    },
    accountStatus: {
      type: "string",
      label: "Account Status",
      description: "Filter by the status of the bundle's account listing, e.g. `configured`, `published`, `in_review`, `finalized`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        tokportal,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const bundles = [];
    const items = this.tokportal.paginate({
      $,
      fn: this.tokportal.listBundles,
      maxResults: this.maxResults,
      params: {
        status: this.status,
        bundle_type: this.bundleType,
        platform: this.platform,
        external_ref: this.externalRef,
        account_status: this.accountStatus,
      },
    });
    for await (const item of items) {
      bundles.push(item);
    }
    $.export("$summary", `Retrieved ${bundles.length} bundle${bundles.length === 1
      ? ""
      : "s"}`);
    return bundles;
  },
};
