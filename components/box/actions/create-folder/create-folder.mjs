// x-pd-ai: optimized
import app from "../../box.app.mjs";

export default {
  key: "box-create-folder",
  name: "Create Folder",
  description: "Creates a new empty folder within the specified parent folder. Parent folder ID `0` is the root (All Files). Folder names must be 1-255 characters, use only Unicode Basic Multilingual Plane (BMP) characters, and cannot contain non-printable characters, `/` or `\\`, leading or trailing spaces, or be `.` or `..`. Names must be unique within the parent (case-insensitive). Use **List Folder Items** to inspect contents, or **Move Folder** / **Delete Folder** to reorganize afterward. [See the documentation](https://developer.box.com/reference/post-folders/). [See folder name restrictions](https://support.box.com/hc/en-us/articles/360044196773-Troubleshooting-Uploads-to-Box).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    parentId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "The parent folder to create the new folder in. Use `0` for the root folder.",
    },
    name: {
      type: "string",
      label: "Folder Name",
      description: "The name of the new folder. Must be 1-255 characters and use only Unicode Basic Multilingual Plane (BMP) characters. Cannot contain non-printable characters, `/` or `\\`, leading or trailing spaces, or be `.` or `..`. [See folder name restrictions](https://support.box.com/hc/en-us/articles/360044196773-Troubleshooting-Uploads-to-Box).",
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.fields?.length) {
      params.fields = Array.isArray(this.fields)
        ? this.fields.join(",")
        : this.fields;
    }

    const response = await this.app.createFolder({
      $,
      params,
      data: {
        name: this.name,
        parent: {
          id: this.parentId || "0",
        },
      },
    });

    $.export("$summary", `Successfully created folder "${response.name}"`);
    return response;
  },
};
