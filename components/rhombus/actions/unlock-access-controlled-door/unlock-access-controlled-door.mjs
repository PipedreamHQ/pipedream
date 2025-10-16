import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-unlock-access-controlled-door",
  name: "Unlock Access Controlled Door",
  description: "Unlock an access controlled door. [See the documentation](https://apidocs.rhombus.com/reference/unlockaccesscontrolleddoor)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rhombus,
    doorUuid: {
      propDefinition: [
        rhombus,
        "doorUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rhombus.unlockAccessControlledDoor({
      $,
      data: {
        accessControlledDoorUuid: this.doorUuid,
      },
    });
    $.export("$summary", `Unlocked access controlled door ${this.doorUuid}`);
    return response;
  },
};
