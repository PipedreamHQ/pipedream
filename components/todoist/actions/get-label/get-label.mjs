import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-label",
  name: "Get Label",
  description: "Returns info about a label. [See the documentation](https://developer.todoist.com/api/v1#tag/Labels/operation/get_label_api_v1_labels__label_id__get)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
    label: {
      propDefinition: [
        todoist,
        "label",
      ],
    },
  },
  async run ({ $ }) {
    const resp = (await this.todoist.getLabels({
      $,
      id: this.label,
    }));
    $.export("$summary", "Successfully retrieved label");
    return resp;
  },
};
