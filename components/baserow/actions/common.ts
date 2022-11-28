import baserow from "../app/baserow";
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
