import app from "../../control_d.app.mjs";

export default {
  key: "control_d-create-device",
  name: "Create Device",
  description: "Create a new device. [See the documentation](https://docs.controld.com/reference/post_devices)",
  version: "0.0.3",
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
    },
    profileId: {
      propDefinition: [
        app,
        "profileId",
      ],
    },
    icon: {
      propDefinition: [
        app,
        "icon",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDevice({
      $,
      data: {
        name: this.name,
        profile_id: this.profileId,
        icon: this.icon,
      },
    });

    $.export("$summary", `Successfully created the device with the ID ${response.body.device_id}`);

    return response;
  },
};
