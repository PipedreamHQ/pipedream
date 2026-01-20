import app from "../../bugherd.app.mjs";

export default {
  key: "bugherd-create-project",
  name: "Create Project",
  description: "Create a new project. The project will initially have no members. [See the documentation](https://www.bugherd.com/api_v2#api_proj_create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
      optional: true,
    },
    devurl: {
      type: "string",
      label: "Development URL",
      description: "The full URL of the project's primary website",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "True if the project is active. Otherwise the project is disabled",
      default: true,
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "True if [public feedback](https://bugherd.com/public-feedback) is enabled on the project",
      default: false,
      optional: true,
    },
    guestsSeeGuests: {
      type: "boolean",
      label: "Guests See Guests",
      description: "True if guests are able to see feedback created by other guests on this project",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        project: {
          name: this.name,
          devurl: this.devurl,
          is_active: this.isActive,
          is_public: this.isPublic,
          guests_see_guests: this.guestsSeeGuests,
        },
      },
    });

    $.export("$summary", `Successfully created project "${response.project?.name}" with ID ${response.project?.id || "unknown"}`);
    return response;
  },
};

