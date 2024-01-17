import amazonAlexa from "../../amazon_alexa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "amazon_alexa-simulate-skill",
  name: "Simulate Alexa Skill",
  description: "Simulate a dialog from an Alexa-enabled device and receive the skill response for the specified example utterance. [See the documentation](https://developer.amazon.com/en-us/docs/alexa/smapi/skill-simulation-api.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    amazonAlexa,
    skillId: {
      propDefinition: [
        amazonAlexa,
        "skillId",
      ],
    },
    stage: {
      propDefinition: [
        amazonAlexa,
        "stage",
      ],
    },
    intent: {
      propDefinition: [
        amazonAlexa,
        "intent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amazonAlexa.simulateSkill({
      skillId: this.skillId,
      stage: this.stage,
      intent: this.intent,
    });

    $.export("$summary", `Simulated ${this.intent} intent for skill ${this.skillId} on ${this.stage} stage`);
    return response;
  },
};
