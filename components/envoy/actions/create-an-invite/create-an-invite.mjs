import app from "../../envoy.app.mjs";

export default {
  key: "envoy-create-an-invite",
  name: "Create an Invite",
  description: "Create an Invite to a person to visit a location. [See the docs](https://developers.envoy.com/hub/reference/createinvite).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    expectedArrivalAt: {
      propDefinition: [
        app,
        "expectedArrivalAt",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "visitorName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "visitorEmail",
      ],
    },
    hostEmployeeId: {
      propDefinition: [
        app,
        "employeeId",
      ],
      description: "Unique identifier of a host.",
    },
    expectedDepartureAt: {
      propDefinition: [
        app,
        "expectedDepartureAt",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    sendEmailToInvitee: {
      propDefinition: [
        app,
        "sendEmailToInvitee",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      invite: {
        expectedArrivalAt: this.expectedArrivalAt,
        expectedDepartureAt: this.expectedDepartureAt,
        locationId: this.locationId,
        notes: this.notes,
        sendEmailToInvitee: this.sendEmailToInvitee,
        hostEmployeeId: this.hostEmployeeId,
        invitee: {
          name: this.name,
          email: this.email,
        },
      },
    };
    const response = await this.app.createInvite($, data);
    $.export("$summary", `Successfully created an invite with id: "${response.data.id}"`);
    return response;
  },
};
