import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-pull-many",
  name: "Pull Many",
  description: "Generic pull many for Roam Research pages. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/mdnjFsqoA).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    eids: {
      type: "string",
      label: "Entity IDs",
      description: "The entity IDs to pull. Eg. `[[:block/uid \"08-30-2022\"] [:block/uid \"08-31-2022\"]]`.",
    },
    selector: {
      type: "string",
      label: "Selector",
      description: "The selector to pull. Eg. `[:block/uid :node/title :block/string {:block/children [:block/uid :block/string]} {:block/refs [:node/title :block/string :block/uid]}]`.",
    },
  },
  async run({ $ }) {
    const {
      app,
      eids,
      selector,
    } = this;

    const response = await app.pullMany({
      $,
      data: {
        eids,
        selector,
      },
    });

    if (!response.result) {
      $.export("$summary", `Failed to pull many data for entity IDs: \`${eids}\`.`);
      return response;
    }

    $.export("$summary", "Successfully ran pull many.");
    return response;
  },
};
