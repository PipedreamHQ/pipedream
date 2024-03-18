import surveysparrow from "../../surveysparrow.app.mjs";

export default {
  props: {
    surveysparrow,
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode of the channel.",
      options: [
        "BLAST",
        "RECURRING",
        "RELATIVE_RECURRING",
      ],
      optional: true,
    },
    survey: {
      propDefinition: [
        surveysparrow,
        "survey",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the channel.",
    },
  },
  async run({ $ }) {
    const response = await this.surveysparrow.createChannel({
      $,
      data: {
        type: this.getChannelType(),
        mode: this.mode,
        survey_id: this.survey,
        name: this.name,
        ...this.getData(),
      },
    });

    $.export("$summary", this.getSummary());
    return response;
  },
};
