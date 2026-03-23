import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Form Response (Instant)",
  key: "servicem8-new-form-response",
  description: "Emit new event when a new Form Response is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMeta({ entry }) {
      if (entry) {
        const {
          uuid, time,
        } = entry[0];

        const eventTime = time || new Date().getTime();

        return {
          id: uuid,
          summary: `New Form Response created with uuid: ${uuid}`,
          ts: eventTime,
        };
      }
    },
    getParams() {
      return {
        object: "Formresponse",
        fields: "uuid",
      };
    },
  },
};
