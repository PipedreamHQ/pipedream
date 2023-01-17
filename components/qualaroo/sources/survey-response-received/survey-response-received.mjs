import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "qualaroo-survey-response-received",
  name: "New Survey Response Received",
  description: "Emit new event when a survey response is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    survey: {
      propDefinition: [
        base.props.qualaroo,
        "survey",
      ],
    },
  },
  async run() {
    const data = [];
    const limit = constants.MAX_LIMIT;
    let offset = this.getOffset();

    while (true) {
      const response = await this.qualaroo.listSurveyesponses({
        params: {
          limit,
          offset,
        },
      });

      if (response.length === 0) {
        break;
      }

      offset += limit;
      this.setOffset(offset);
      data.push(...response);
    }

    for (const surveyResponse of data) {
      this.$emit(surveyResponse,  {
        id: surveyResponse.id,
        summary: `New response received for: ${surveyResponse.nudge_name}`,
        ts: new Date(surveyResponse.time),
      });
    }
  },
};
