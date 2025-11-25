import freshdesk from "../../freshdesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "freshdesk-update-agent",
  name: "Update Agent",
  description: "Update an agent in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#update_agent)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    agentId: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the Agent.",
      optional: true,
    },
    ticketScope: {
      type: "integer",
      label: "Ticket Scope",
      description: "Ticket permission of the agent. Current logged in agent can't update his/her ticket_scope",
      options: constants.TICKET_SCOPE,
      optional: true,
    },
    occasional: {
      type: "boolean",
      label: "Occasional",
      description: "Set to true if this is an occasional agent (true => occasional, false => full-time)",
      optional: true,
    },
    signature: {
      type: "string",
      label: "Signature",
      description: "Signature of the agent in HTML format",
      optional: true,
    },
    skillIds: {
      propDefinition: [
        freshdesk,
        "skillIds",
      ],
    },
    groupIds: {
      propDefinition: [
        freshdesk,
        "groupId",
      ],
      type: "string[]",
      label: "Group IDs",
      description: "Array of group IDs",
      optional: true,
    },
    roleIds: {
      propDefinition: [
        freshdesk,
        "roleIds",
      ],
    },
    agentType: {
      type: "integer",
      label: "Agent Type",
      description: "Type of the agent",
      options: constants.AGENT_TYPE,
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "	Language of the Agent. Default language is `en`",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone of the agent. Default value is time zone of the domain.",
      optional: true,
    },
    focusMode: {
      type: "boolean",
      label: "Focus Mode",
      description: "Focus mode of the agent. Default value is `true`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.updateAgent({
      $,
      agentId: this.agentId,
      data: {
        email: this.email,
        ticket_scope: this.ticketScope,
        occasional: this.occasional,
        signature: this.signature,
        skill_ids: this.skillIds,
        group_ids: this.groupIds,
        role_ids: this.roleIds,
        agent_type: this.agentType,
        language: this.language,
        time_zone: this.timeZone,
        focus_mode: this.focusMode,
      },
    });
    $.export("$summary", `Agent ${this.email} updated successfully`);
    return response;
  },
};
