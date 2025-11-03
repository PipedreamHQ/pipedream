import zohoNotebook from "../../zoho_notebook.app.mjs";

export default {
  key: "zoho_notebook-create-notebook",
  name: "Create Notebook",
  description: "Creates a new notebook.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoNotebook,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new notebook",
    },
    coverImageId: {
      type: "string",
      label: "Cover Image ID",
      description: "ID of the cover image that is to be used by the notebook",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Name of the place where the notebook is made",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Longitude coordinate",
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Latitude coordinate",
      optional: true,
    },
    isDefault: {
      type: "boolean",
      label: "Is Default",
      description: "Specifies if this Notebook is the default notebook",
      optional: true,
    },
    isLocked: {
      type: "boolean",
      label: "Is Locked",
      description: "Specifies if this Notebook is locked",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoNotebook.createNotebook({
      $,
      params: {
        JSONString: JSON.stringify({
          name: this.name,
          cover_image_id: this.coverImageId,
          location: this.location,
          longitude: +this.longitude,
          latitude: +this.latitude,
          is_default: this.isDefault,
          is_locked: this.isLocked,
        }),
      },
    });
    $.export("$summary", `Successfully created notebook with ID ${response.notebook_id}`);
    return response;
  },
};
