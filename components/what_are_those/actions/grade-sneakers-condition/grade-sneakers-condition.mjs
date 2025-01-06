import what_are_those from "../../what_are_those.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "what_are_those-grade-sneakers-condition",
  name: "Grade and Authenticate Sneakers",
  description: "Grades and authenticates sneakers using provided images. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    what_are_those,
    frontImage: {
      propDefinition: [
        what_are_those,
        "frontImage",
      ],
    },
    leftImage: {
      propDefinition: [
        what_are_those,
        "leftImage",
      ],
    },
    rightImage: {
      propDefinition: [
        what_are_those,
        "rightImage",
      ],
    },
    soleImage: {
      propDefinition: [
        what_are_those,
        "soleImage",
      ],
    },
    insoleImage: {
      propDefinition: [
        what_are_those,
        "insoleImage",
      ],
    },
    sizeTagImage: {
      propDefinition: [
        what_are_those,
        "sizeTagImage",
      ],
    },
    type: {
      propDefinition: [
        what_are_those,
        "type",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.what_are_those.gradeAuthenticateSneakers({
      frontImage: this.frontImage,
      leftImage: this.leftImage,
      rightImage: this.rightImage,
      soleImage: this.soleImage,
      insoleImage: this.insoleImage,
      sizeTagImage: this.sizeTagImage,
      type: this.type,
    });
    $.export("$summary", "Successfully graded and authenticated sneakers.");
    return response;
  },
};
