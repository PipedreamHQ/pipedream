import common from "../../common/constants.mjs";
import surveysparrow from "../../surveysparrow.app.mjs";

export default {
  props: {
    surveysparrow,
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
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode of the channel.",
      options: common.MODE_OPTIONS,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.mode === "RECURRING") {
      props.frequency = {
        type: "string",
        label: "Frequency",
        description: "The frequency of the recurring.",
        options: common.FREQUENCY_OPTIONS,
        reloadProps: true,
      };
      if (this.frequency === "WEEKLY") {
        props.weekDay = {
          type: "integer[]",
          label: "Week Days",
          description: "The days of the week of the schedule.",
          options: common.WEEK_OPTIONS,
        };
      }
      if ((this.frequency === "MONTHLY") || (this.frequency === "YEARLY")) {
        props.day = {
          type: "string[]",
          label: "On",
          description: "The day of the schedule.",
          options: common.DAY_OPTIONS,
        };
      }
      if (this.frequency === "YEARLY") {
        props.month = {
          type: "integer[]",
          label: "Month",
          description: "The months of the schedule.",
          options: common.MONTH_OPTIONS,
        };
      }
      if (this.frequency) {
        props.hour = {
          type: "integer",
          label: "Hour",
          description: "The hour of the schedule.",
          min: 1,
          max: 24,
        };
        props.minute = {
          type: "integer",
          label: "Minute",
          description: "The minute of the schedule.",
          min: 0,
          max: 59,
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    const scheduleObject = (this.mode === "RECURRING")
      ? {
        schedule: {
          frequency: this.frequency,
          config: {
            D: this.day && this.day.map((day) => {
              if (day === "LAST DAY") return 0;
              return parseInt(day);
            }).sort((a, b) => a - b),
            M: this.month && this.month.sort((a, b) => a - b),
            d: this.weekDay && this.weekDay.sort((a, b) => a - b),
            h: [
              this.hour,
            ],
            m: [
              this.minute,
            ],
          },
        },
      }
      : {};

    const response = await this.surveysparrow.createChannel({
      $,
      data: {
        type: this.getChannelType(),
        mode: this.mode,
        survey_id: this.survey,
        name: this.name,
        ...this.getData(),
        ...scheduleObject,
      },
    });

    $.export("$summary", this.getSummary());
    return response;
  },
};
