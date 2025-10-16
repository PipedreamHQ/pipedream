import {
  parseObjectEntries, parseStringAsJSON,
} from "../../common/utils.mjs";
import utopianLabs from "../../utopian_labs.app.mjs";

export default {
  key: "utopian_labs-initiate-research-run",
  name: "Initiate Research Run",
  description: "Initiate a research run of the R1 agent. [See the documentation](https://docs.utopianlabs.ai/research#initiate-a-research-run)",
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
      propDefinition: [
        utopianLabs,
        "lead",
      ],
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
