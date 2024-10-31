import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-get-page-or-block-data",
  name: "Get Page Or Block Data",
  description: "Get the data for a page or block in Roam Research (access only to non ecrypted graphs). [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/eb8OVhaFC).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "The type of resource to get data for.",
      options: [
        "page",
        "block",
      ],
    },
    pageOrBlock: {
      type: "string",
      label: "Page Title Or Block UID",
      description: "The page title of the block uid to get data for. Page title example: `My Page` and Block UID example: `ideWWvTgI`.",
    },
  },
  async run({ $ }) {
    const {
      app,
      resourceType,
      pageOrBlock,
    } = this;

    const attribute = resourceType === "page"
      ? ":node/title"
      : ":block/uid";

    const response = await app.pull({
      $,
      data: {
        selector: `[${attribute} :block/string :block/order {:block/children ...}]`,
        eid: `[${attribute} "${pageOrBlock}"]`,
      },
    });

    if (!response.result) {
      $.export("$summary", `Failed to get data for ${resourceType}: \`${pageOrBlock}\`.`);
      return response;
    }

    $.export("$summary", `Succesfully got data for ${resourceType}: \`${pageOrBlock}\`.`);
    return response;
  },
};
