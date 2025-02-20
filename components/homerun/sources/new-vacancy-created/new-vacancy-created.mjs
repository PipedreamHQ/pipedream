import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "homerun-new-vacancy-created",
  name: "New Vacancy Created",
  description: "Emit new event when a new vacancy is created. [See the documentation](https://developers.homerun.co/#tag/Vacancies/operation/vacancies.get).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "created_at";
    },
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listVacancies;
    },
    getResourcesFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Vacancy: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
