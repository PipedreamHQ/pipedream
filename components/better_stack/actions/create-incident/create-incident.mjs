import app from "../../better_stack.app.mjs";

export default {
  key: "better_stack-create-incident",
  name: "Create Incident",
  description: "Initiates an incident that signals the team. [See the documentation](https://betterstack.com/docs/uptime/api/create-a-new-incident/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    requesterEmail: {
      type: "string",
      label: "Requester Email",
      description: "E-mail of the user who requested the incident",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Brief summary of the incident",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Short name of the incident",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Full description of the incident",
      optional: true,
    },
    call: {
      type: "boolean",
      label: "Call",
      description: "Should we call the on-call person?",
      optional: true,
    },
    sms: {
      type: "boolean",
      label: "SMS",
      description: "Should we send an SMS to the on-call person?",
      optional: true,
    },
    email: {
      type: "boolean",
      label: "Email",
      description: "Should we send an email to the on-call person?",
      optional: true,
    },
    push: {
      type: "boolean",
      label: "Push",
      description: "Should we send a push notification to the on-call person?",
      optional: true,
    },
    teamWait: {
      type: "integer",
      label: "Team Wait",
      description: "How long to wait before escalating the incident alert to the team. Leave blank to disable escalating to the entire team. In seconds.",
      optional: true,
    },
    policyId: {
      propDefinition: [
        app,
        "policyId",
      ],
    },
  },
  methods: {
    createIncident(args = {}) {
      return this.app.post({
        path: "/incidents",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createIncident,
      requesterEmail,
      name,
      summary,
      description,
      call,
      sms,
      email,
      push,
      teamWait,
      policyId,
    } = this;

    const response = await createIncident({
      $,
      data: {
        requester_email: requesterEmail,
        name,
        summary,
        description,
        call,
        sms,
        email,
        push,
        team_wait: teamWait,
        policy_id: policyId,
      },
    });

    $.export("$summary", `Successfully created incident with ID \`${response.data.id}\``);
    return response;
  },
};
