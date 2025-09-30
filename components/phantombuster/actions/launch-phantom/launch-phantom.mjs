import app from "../../phantombuster.app.mjs";

export default {
  type: "action",
  key: "phantombuster-launch-phantom",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Launch Phantom",
  description: "Adds an agent to the launch queue, [See the docs](https://hub.phantombuster.com/reference/post_agents-launch-1)",
  props: {
    app,
    agentId: {
      propDefinition: [
        app,
        "agentId",
      ],
    },
    arguments: {
      type: "string",
      label: "Arguments",
      description: "Agent arguments. Must be a JSON string, e.g. `{\"key1\": \"Value 1\", \"key2\": \"Value 2\"}`",
      optional: true,
    },
    saveArguments: {
      type: "boolean",
      label: "Save Arguments",
      description: "If true, argument will be saved as the default launch options for the agent.",
      optional: true,
    },
    bonusArgument: {
      type: "string",
      label: "Bonus Argument",
      description: "Agent bonus argument. This bonus argument is single-use, it will only be used for the current launch. Must be a JSON string, e.g. `{\"key1\": \"Value 1\", \"key2\": \"Value 2\"}`",
      optional: true,
    },
    manualLaunch: {
      type: "boolean",
      label: "Manual Launch",
      description: "If set, the agent will be considered as `launched manually`.",
      optional: true,
    },
    maxInstanceCount: {
      type: "integer",
      label: "Max Instance Count",
      description: "If set, the agent will only be launched if the number of already running instances is below the specified number.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resp = await this.app.launchPhantom({
      $,
      data: {
        id: this.agentId,
        arguments: this.arguments,
        saveArguments: this.saveArguments,
        bonusArgument: this.bonusArgument,
        manualLaunch: this.manualLaunch,
        maxInstanceCount: this.maxInstanceCount,
      },
    });
    $.export("$summary", `Phantom has been launched succesfully. Container ID(${resp.containerId})`);
    return resp;
  },
};
