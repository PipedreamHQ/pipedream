import {
  parseObjectEntries, parseStringAsJSON,
} from "../../common/utils.mjs";
import utopianLabs from "../../utopian_labs.app.mjs";

export default {
  key: "utopian_labs-initiate-research-run",
  name: "Initiate Research Run",
  description: "Initiate a research run of the R1 agent. [See the documentation](https://docs.utopianlabs.ai/research#initiate-a-research-run)",
  version: "0.0.1",
  type: "action",
  props: {
    utopianLabs,
    agent: {
      propDefinition: [
        utopianLabs,
        "agent",
      ],
      options: [
        {
          label: "r1 - a more powerful agent that has access to a larger set of research sources",
          value: "r1",
        },
        {
          label: "r1-light - a more affordable version of R1",
          value: "r1-light",
        },
      ],
    },
    lead: {
      type: "object",
      label: "Lead",
      description: "The lead to research. [See the documentation](https://docs.utopianlabs.ai/types#the-lead-type) for more information. Example: `{ \"company\": { \"website\": \"https://pipedream.com/\" } }`",
    },
    minResearchSteps: {
      type: "integer",
      label: "Minimum Research Steps",
      description: "Optionally limit R1 to a minimum amount of research steps (default is 0)",
      optional: true,
    },
    maxResearchSteps: {
      type: "integer",
      label: "Maximum Research Steps",
      description: "Optionally limit R1 to a maximum amount of research steps (default is 5)",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "The context for the research run. This is a free-form string that will be used to guide R1's research",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. [See the documentation](https://docs.utopianlabs.ai/research#initiate-a-research-run) for all available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.utopianLabs.initiateRun({
      agent: this.agent,
      lead: parseStringAsJSON(this.lead),
      min_research_steps: this.minResearchSteps,
      max_research_steps: this.maxResearchSteps,
      context: this.context,
      ...parseObjectEntries(this.additionalOptions),
    });
    $.export("$summary", `Successfully initiated run (ID: ${response.id}`);
    return response;
  },
};
