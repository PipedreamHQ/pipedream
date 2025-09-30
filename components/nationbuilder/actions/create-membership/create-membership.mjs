import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-create-membership",
  name: "Create Membership",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new membership with the provided data. [See the documentation](https://nationbuilder.com/memberships_api)",
  type: "action",
  props: {
    nationbuilder,
    name: {
      type: "string",
      label: "Membership Type Name",
      description: "The name of the membership type.",
    },
    personId: {
      propDefinition: [
        nationbuilder,
        "personId",
      ],
      label: "Person Id",
      description: "The NationBuilder Id of the person the membership applies to.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The current status of the membership.",
      options: [
        "active",
        "grace period",
        "canceled",
        "expired",
      ],
    },
    statusReason: {
      type: "string",
      label: "Status Reason",
      description: "A description of how the memebership acquired its current status.",
      optional: true,
    },
    expiresOn: {
      type: "string",
      label: "Expires On",
      description: "A timestamp representing when the membership expires. **Format: YYYY-MM-DDTHH:mm:ssZ**",
      optional: true,
    },
    startedAt: {
      type: "string",
      label: "Started At",
      description: "A timestamp representing when the membership expires. **Format: YYYY-MM-DDTHH:mm:ssZ**",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      personId,
      statusReason,
      expiresOn,
      startedAt,
      ...data
    } = this;

    const response = await nationbuilder.createMembership({
      $,
      personId,
      data: {
        membership: {
          status_reason: statusReason,
          expires_on: expiresOn,
          started_at: startedAt,
          ...data,
        },
      },
    });

    $.export("$summary", `A new membership with Id: ${response.membership?.id} was successfully created!`);
    return response;
  },
};
