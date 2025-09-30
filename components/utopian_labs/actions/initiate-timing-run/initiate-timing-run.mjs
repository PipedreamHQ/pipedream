import {
  parseObjectEntries, parseStringAsJSON,
} from "../../common/utils.mjs";
import utopianLabs from "../../utopian_labs.app.mjs";

export default {
  key: "utopian_labs-initiate-timing-run",
  name: "Initiate Timing Run",
  description: "Initiate a timing run of the R1-Timing agent. [See the documentation](https://docs.utopianlabs.ai/timing#initiate-a-timing-run)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
          label: "r1-timing - the default research agent, which has access to a larger set of research sources",
          value: "r1-timing",
        },
        {
          label: "r1-timing-light - the light research agent, more affordable",
          value: "r1-timing-light",
        },
      ],
    },
    lead: {
      propDefinition: [
        utopianLabs,
        "lead",
      ],
      description: "The lead to determine the timing for. [See the documentation](https://docs.utopianlabs.ai/types#the-lead-type) for more information. Example: `{ \"company\": { \"website\": \"https://pipedream.com/\" } }`",
    },
    minResearchSteps: {
      propDefinition: [
        utopianLabs,
        "minResearchSteps",
      ],
    },
    maxResearchSteps: {
      propDefinition: [
        utopianLabs,
        "maxResearchSteps",
      ],
    },
    context: {
      propDefinition: [
        utopianLabs,
        "context",
      ],
    },
    additionalOptions: {
      propDefinition: [
        utopianLabs,
        "additionalOptions",
      ],
      description: "Additional parameters to send in the request. [See the documentation](https://docs.utopianlabs.ai/timing#initiate-a-timing-run) for all available parameters. Values will be parsed as JSON where applicable.",
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
    $.export("$summary", `Successfully initiated run (ID: ${response.id})`);
    return response;
  },
};
