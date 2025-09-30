import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import pagerduty from "../../pagerduty.app.mjs";

const {
  reduceProperties,
  emptyStrToUndefined,
  commaSeparatedListToArray,
} = utils;

export default {
  key: "pagerduty-trigger-incident",
  name: "Trigger Incident",
  description: "Trigger an incident. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE0MA-create-an-incident)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pagerduty,
    title: {
      propDefinition: [
        pagerduty,
        "incidentTitle",
      ],
    },
    serviceId: {
      propDefinition: [
        pagerduty,
        "serviceId",
      ],
    },
    urgency: {
      propDefinition: [
        pagerduty,
        "incidentUrgency",
      ],
    },
    bodyDetails: {
      propDefinition: [
        pagerduty,
        "incidentBodyDetails",
      ],
    },
    incidentKey: {
      propDefinition: [
        pagerduty,
        "incidentKey",
      ],
    },
    escalationPolicyId: {
      propDefinition: [
        pagerduty,
        "escalationPolicyId",
      ],
    },
    assigneeIds: {
      type: "string[]",
      label: "Assignee IDs",
      description: "The IDs of the users to assign to the incident. Use a comma-separated list when structured mode is `off` specifying the ids as values. (e.g. `P97DSQO,PWLDHXC,P1M4QLY`)",
      optional: true,
      propDefinition: [
        pagerduty,
        "userId",
      ],
    },
    conferenceBridgeNumber: {
      propDefinition: [
        pagerduty,
        "incidentConferenceBridgeNumber",
      ],
    },
    conferenceBridgeUrl: {
      propDefinition: [
        pagerduty,
        "incidentConferenceBridgeUrl",
      ],
    },
  },
  async run({ $ }) {
    const {
      title,
      serviceId,
    } = this;

    const conferenceBridgeNumber = emptyStrToUndefined(this.conferenceBridgeNumber);
    const conferenceBridgeUrl = emptyStrToUndefined(this.conferenceBridgeUrl);
    const escalationPolicyId = emptyStrToUndefined(this.escalationPolicyId);
    const bodyDetails = emptyStrToUndefined(this.bodyDetails);
    const urgency = emptyStrToUndefined(this.urgency);
    const incidentKey = emptyStrToUndefined(this.incidentKey);
    const assigneeIds = commaSeparatedListToArray(this.assigneeIds);

    const initialProps = {
      type: constants.INCIDENT_TYPE,
      title,
      service: {
        id: serviceId,
        type: constants.REFERENCE.SERVICE,
      },
    };

    const additionalProps = {
      urgency,
      incident_key: incidentKey,
      body: [
        {
          type: constants.INCIDENT_BODY_TYPE,
          details: bodyDetails,
        },
        bodyDetails,
      ],
      assignments: [
        assigneeIds?.map((id) => ({
          assignee: {
            id,
            type: constants.REFERENCE.USER,
          },
        })),
        assigneeIds?.length && !escalationPolicyId,
      ],
      escalation_policy: [
        {
          id: escalationPolicyId,
          type: constants.REFERENCE.ESCALATION_POLICY,
        },
        escalationPolicyId,
      ],
      conference_bridge: [
        {
          conference_number: conferenceBridgeNumber,
          conference_url: conferenceBridgeUrl,
        },
        conferenceBridgeNumber || conferenceBridgeUrl,
      ],
    };

    const toCreate = reduceProperties({
      initialProps,
      additionalProps,
    });

    const { incident } = await this.pagerduty.createIncident({
      $,
      data: {
        incident: toCreate,
      },
    });

    $.export("$summary", `Incident ${incident.summary} has been ${incident.status}`);

    return incident;
  },
};
