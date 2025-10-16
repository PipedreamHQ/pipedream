import gami5d from "../../gami5d.app.mjs";

export default {
  key: "gami5d-record-observation",
  name: "Record Observation",
  description: "Record an observation for evaluation in the gami5d platform. [See the documentation](https://app.gami5d.com/web/api/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gami5d,
    playerUniqueRef: {
      type: "string",
      label: "Player Unique Ref",
      description: "The unique reference for the player in your system to identify the player and link this observation. This reference should have been provided when creating the player. Example: `P256310`. If the unique reference is not found, then a new player will be created.",
      reloadProps: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Provide an ID which will be marked as the author of this record. Example: `john.doe@myinc.com`",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const attributes = await this.gami5d.listAttributes();
    for (const attribute of attributes) {
      props[attribute.key] = {
        type: "string",
        label: attribute.key,
        description: attribute.label,
      };
    }
    return props;
  },
  async run({ $ }) {
    const attributes = await this.gami5d.listAttributes();
    const attributeValues = {};
    for (const attribute of attributes) {
      attributeValues[attribute.key] = this[attribute.key];
    }

    const response = await this.gami5d.recordObservation({
      $,
      data: {
        client_id: this.gami5d.$auth.client_id,
        project_id: this.gami5d.$auth.project_id,
        player_unique_ref: this.playerUniqueRef,
        user_id: this.userId,
        attributes: [
          attributeValues,
        ],
      },
    });
    $.export("$summary", "Successfully recorded observation");
    return response;
  },
};
