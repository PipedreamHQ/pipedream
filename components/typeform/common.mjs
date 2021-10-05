import typeform from "../../typeform.app.mjs";

export default {
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
  },
};
