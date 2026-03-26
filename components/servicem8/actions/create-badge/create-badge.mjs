import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-badge",
  name: "Create Badge",
  description: "Create a badge. [See the documentation](https://developer.servicem8.com/reference/createbadges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    name: {
      type: "string",
      label: "Name",
      description:
        "Display name (required by API; max 50 characters). Examples: Warranty, VIP, Take Payment Facilities.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      optional: true,
      description:
        "Badge image / `file_name`. Search loads [assets](https://developer.servicem8.com/reference/listassets); value uses asset **code** when present, else **name**. Paste a custom value if needed.",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._badgeFileNameOptionsFromAssets({
          $: $ ?? this,
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createBadge({
      $,
      data: {
        name: this.name,
        file_name: this.fileName,
      },
    });
    $.export("$summary", `Created Badge${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
