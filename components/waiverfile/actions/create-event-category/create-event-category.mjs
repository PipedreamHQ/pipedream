import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-create-event-category",
  name: "Create Event Category",
  description: "Creates a new event category in WaiverFile.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    waiverfile,
    categoryname: {
      type: "string",
      label: "Category Name",
      description: "The name of the category",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A brief description of the category",
    },
    parentid: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent category (for creating a sub-category)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.waiverfile._makeRequest({
      method: "POST",
      path: "/api/v1/InsertEventCategory",
      params: {
        name: this.categoryname,
        active: true,
        description: this.description,
        parentid: this.parentid,
      },
    });

    $.export("$summary", `Successfully created event category with name ${this.categoryname}`);
    return response;
  },
};
