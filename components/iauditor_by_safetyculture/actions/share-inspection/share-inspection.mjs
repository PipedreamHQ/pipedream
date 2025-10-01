import safetyculture from "../../iauditor_by_safetyculture.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "iauditor_by_safetyculture-share-inspection",
  name: "Share Inspection",
  description: "Share an inspection with one or more users in iAuditor by SafetyCulture. [See the documentation](https://developer.safetyculture.com/reference/thepubservice_shareinspection)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    safetyculture,
    inspectionId: {
      propDefinition: [
        safetyculture,
        "inspectionId",
      ],
    },
    groupId: {
      propDefinition: [
        safetyculture,
        "groupId",
      ],
    },
    userId: {
      propDefinition: [
        safetyculture,
        "userId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
      type: "string[]",
      label: "Users",
      description: "Array of identifiers of the users to share with",
    },
    permission: {
      type: "string",
      label: "Permission",
      description: "The user permission",
      options: constants.PERMISSIONS,
    },
  },
  async run({ $ }) {
    const shares = this.userId?.map((id) => ({
      id,
      permission: this.permission,
    })) || [];

    const response = await this.safetyculture.shareInspection({
      inspectionId: this.inspectionId,
      data: {
        shares,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully shared inspection with ID ${this.inspectionId}.`);
    }

    return response;
  },
};
