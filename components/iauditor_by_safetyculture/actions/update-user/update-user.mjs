import safetyculture from "../../iauditor_by_safetyculture.app.mjs";
import constants from "../../common/constants.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "iauditor_by_safetyculture-update-user",
  name: "Update User",
  description: "Update an existing user in iAuditor by SafetyCulture. [See the documentation](https://developer.safetyculture.com/reference/thepubservice_updateuser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    safetyculture,
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
    },
    firstName: {
      propDefinition: [
        safetyculture,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        safetyculture,
        "lastName",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the user",
      options: constants.USER_STATUS,
      optional: true,
    },
    seatType: {
      propDefinition: [
        safetyculture,
        "seatType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.safetyculture.updateUser({
      userId: this.userId,
      data: pickBy({
        firstname: this.firstName,
        lastname: this.lastName,
        status: this.status,
        seat_type: this.seatType,
      }),
      $,
    });

    $.export("$summary", `Successfully updated user with ID ${this.userId}`);

    return response;
  },
};
