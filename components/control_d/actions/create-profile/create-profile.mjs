import app from "../../control_d.app.mjs";

export default {
  key: "control_d-create-profile",
  name: "Create Profile",
  description: "Create a profile. [See the documentation](https://docs.controld.com/reference/post_profiles)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Profile name",
    },
  },
  async run({ $ }) {
    const response = await this.app.createProfile({
      $,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created the profile '${this.name}'`);

    return response;
  },
};
