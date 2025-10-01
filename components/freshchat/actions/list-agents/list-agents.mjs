import freshchat from "../../freshchat.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshchat-list-agents",
  name: "List Agents",
  description: "Lists all agents in Freshchat. [See the documentation](https://developers.freshchat.com/api/#list_all_agents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshchat,
    groupId: {
      propDefinition: [
        freshchat,
        "groupId",
      ],
      optional: true,
    },
    isDeactivated: {
      type: "boolean",
      label: "Is Deactivated",
      description: "Limits the response to agent objects whose is_deactivated value matches the parameter value",
      optional: true,
    },
    availabilityStatus: {
      type: "string",
      label: "Availability Status",
      description: "Limits the response to agent objects whose availability_status value matches the parameter value",
      options: [
        "AVAILABLE",
        "UNAVAILABLE",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        freshchat,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.freshchat.getPaginatedResults({
        fn: this.freshchat.listAgents,
        args: {
          $,
          params: {
            groups: this.groupId,
            is_deactivated: this.isDeactivated,
            availability_status: this.availabilityStatus,
          },
        },
        resourceKey: "agents",
        max: this.maxResults,
      });
      $.export("$summary", `Listed ${response.length} agent${response.length === 1
        ? ""
        : "s"}`);
      return response;
    } catch (e) {
      if (e.status === 404) {
        $.export("$summary", "No agents found");
      } else {
        throw new ConfigurationError(e);
      }
    }
  },
};
