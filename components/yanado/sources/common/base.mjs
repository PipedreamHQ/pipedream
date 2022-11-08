import yanado from "../../yanado.app.mjs";

export default {
  props: {
    yanado,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    listId: {
      propDefinition: [
        yanado,
        "listId",
      ],
    },
  },
};
