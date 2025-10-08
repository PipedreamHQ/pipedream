import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-pull",
  name: "Pull",
  description: "Generic pull for Roam Research pages. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/mdnjFsqoA).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    eid: {
      type: "string",
      label: "Entity ID",
      description: "The entity ID to pull. Eg. `[:block/uid \"08-30-2022\"]`.",
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
      eid,
      selector,
    } = this;

    const response = await app.pull({
      $,
      data: {
        eid,
        selector,
      },
    });

    if (!response.result) {
      $.export("$summary", `Failed to pull data for entity ID: \`${eid}\`.`);
      return response;
    }

    $.export("$summary", "Successfully ran pull.");
    return response;
  },
};
