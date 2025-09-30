import { LANGUAGE_CODE_OPTIONS } from "../../common/constants.mjs";
import {
  parseObjectEntries, parseStringAsJSON,
} from "../../common/utils.mjs";
import utopianLabs from "../../utopian_labs.app.mjs";

export default {
  key: "utopian_labs-initiate-copywriting-run",
  name: "Initiate Copywriting Run",
  description: "Initiate a copywriting run of the R1-Copywriting agent. [See the documentation](https://docs.utopianlabs.ai/copywriting#initiate-a-copywriting-run)",
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
          label: "r1-copywriting - the default research agent, which has access to a larger set of research sources",
          value: "r1-copywriting",
        },
        {
          label: "r1-copywriting-light - the light research agent, more affordable",
          value: "r1-copywriting-light",
        },
      ],
    },
    lead: {
      propDefinition: [
        utopianLabs,
        "lead",
      ],
      description: "The lead to write a sales message for. [See the documentation](https://docs.utopianlabs.ai/types#the-lead-type) for more information. Example: `{ \"company\": { \"website\": \"https://pipedream.com/\" } }`",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The langauge to write the copy in (defaults to `en-US`)",
      optional: true,
      options: LANGUAGE_CODE_OPTIONS,
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
      description: "Additional parameters to send in the request. [See the documentation](https://docs.utopianlabs.ai/copywriting#initiate-a-copywriting-run) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.utopianLabs.initiateRun({
      agent: this.agent,
      lead: parseStringAsJSON(this.lead),
      language: this.language,
      min_research_steps: this.minResearchSteps,
      max_research_steps: this.maxResearchSteps,
      context: this.context,
      ...parseObjectEntries(this.additionalOptions),
    });
    $.export("$summary", `Successfully initiated run (ID: ${response.id})`);
    return response;
  },
};
