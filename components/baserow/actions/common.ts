import baserow from "../app/baserow.app";
export default {
  props: {
    baserow,
    tableId: {
      propDefinition: [
        baserow,
        "tableId",
      ],
    },
  },
};
