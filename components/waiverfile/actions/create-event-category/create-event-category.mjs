import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-create-event-category",
  name: "Create Event Category",
  description: "Creates a new event category in WaiverFile. [See the documentation](https://api.waiverfile.com/swagger/ui/index#!/WaiverEvent/WaiverEvent_InsertEventCategory)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    waiverfile,
    name: {
      type: "string",
      label: "Category Name",
      description: "The name of the category",
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "When `true`, creates the category with an active status. If `false`, status wil be set to disabled.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.waiverfile.createEventCategory({
      $,
      params: {
        name: this.name,
        active: this.active,
      },
    });

    $.export("$summary", `Successfully created Event Category with name ${this.name}`);
    return response;
  },
};
