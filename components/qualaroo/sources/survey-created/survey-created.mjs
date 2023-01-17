import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "qualaroo-survey-created",
  name: "New Survey Created",
  description: "Emit new event when a survey is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  async run() {
    const data = [];
    const limit = constants.MAX_LIMIT;
    let offset = this.getOffset();

    while (true) {
      const response = await this.qualaroo.listSurveys({
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

    for (const survey of data) {
      this.$emit(survey, this.getMeta({
        id: survey.id,
        summary: `New survey created: ${survey.name}`,
        ts: new Date(survey.created_at),
      }));
    }
  },
};
