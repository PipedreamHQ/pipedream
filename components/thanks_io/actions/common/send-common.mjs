import thanksIo from "../../thanks_io.app.mjs";

export default {
  props: {
    thanksIo,
    subAccount: {
      propDefinition: [
        thanksIo,
        "subAccount",
      ],
    },
    message: {
      propDefinition: [
        thanksIo,
        "message",
      ],
    },
    frontImageUrl: {
      propDefinition: [
        thanksIo,
        "frontImageUrl",
      ],
    },
    handwritingStyle: {
      propDefinition: [
        thanksIo,
        "handwritingStyle",
      ],
    },
  },
};
