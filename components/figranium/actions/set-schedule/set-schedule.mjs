import { ConfigurationError } from "@pipedream/platform";
import app from "../../figranium.app.mjs";

export default {
  key: "figranium-set-schedule",
  name: "Set Schedule",
  description: "Create or update a schedule on a task. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Whether the schedule should be active",
      default: true,
    },
    scheduleMode: {
      type: "string",
      label: "Schedule Mode",
      description: "How to express the schedule timing",
      options: [
        {
          label: "Frequency (Interval)",
          value: "frequency",
        },
        {
          label: "Cron Expression",
          value: "cron",
        },
      ],
      default: "frequency",
      reloadProps: true,
    },
    cronExpression: {
      type: "string",
      label: "Cron Expression",
      description: "A standard 5-field cron expression (minute hour day month weekday), e.g. `0 9 * * 1-5` for 9am on weekdays. Evaluated in the Figranium server's local system timezone.",
      hidden: true,
    },
    frequency: {
      type: "string",
      label: "Frequency",
      description: "How often the task should run",
      options: [
        {
          label: "Every N Minutes",
          value: "interval",
        },
        {
          label: "Daily",
          value: "daily",
        },
        {
          label: "Weekly",
          value: "weekly",
        },
        {
          label: "Monthly",
          value: "monthly",
        },
      ],
      default: "daily",
      hidden: true,
      reloadProps: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (this.scheduleMode === "cron") {
      props.cronExpression = {
        ...existingProps.cronExpression,
        hidden: false,
      };
      return props;
    }

    props.frequency = {
      ...existingProps.frequency,
      hidden: false,
    };

    if (this.frequency === "interval") {
      props.intervalMinutes = {
        type: "integer",
        label: "Interval (Minutes)",
        description: "How often to run (in minutes)",
        default: 60,
      };
      return props;
    }

    props.scheduleHour = {
      type: "integer",
      label: "Hour",
      description: "Hour of day to run (0-23)",
      default: 9,
    };
    props.scheduleMinute = {
      type: "integer",
      label: "Minute",
      description: "Minute of hour to run (0-59)",
      default: 0,
    };

    if (this.frequency === "weekly") {
      props.daysOfWeek = {
        type: "integer[]",
        label: "Days of Week",
        description: "Days to run on (0 = Sunday, 6 = Saturday)",
        options: [
          {
            label: "Sunday",
            value: 0,
          },
          {
            label: "Monday",
            value: 1,
          },
          {
            label: "Tuesday",
            value: 2,
          },
          {
            label: "Wednesday",
            value: 3,
          },
          {
            label: "Thursday",
            value: 4,
          },
          {
            label: "Friday",
            value: 5,
          },
          {
            label: "Saturday",
            value: 6,
          },
        ],
        default: [
          1,
        ],
      };
    } else if (this.frequency === "monthly") {
      props.dayOfMonth = {
        type: "integer",
        label: "Day of Month",
        description: "Day of month to run (1-31)",
        default: 1,
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      app,
      taskId,
      enabled,
      scheduleMode,
      cronExpression,
      frequency,
      intervalMinutes,
      scheduleHour,
      scheduleMinute,
      daysOfWeek,
      dayOfMonth,
    } = this;

    const data = {
      enabled,
    };

    if (scheduleMode === "cron") {
      if (!cronExpression) {
        throw new ConfigurationError("The **Cron Expression** field is required when **Schedule Mode** is set to Cron Expression.");
      }
      data.cron = cronExpression;
    } else {
      data.frequency = frequency;
      if (frequency === "interval") {
        data.intervalMinutes = intervalMinutes;
      } else if (frequency === "weekly") {
        data.hour = scheduleHour;
        data.minute = scheduleMinute;
        data.daysOfWeek = daysOfWeek;
      } else if (frequency === "monthly") {
        data.hour = scheduleHour;
        data.minute = scheduleMinute;
        data.dayOfMonth = dayOfMonth;
      } else {
        data.hour = scheduleHour;
        data.minute = scheduleMinute;
      }
    }

    const response = await app.setSchedule({
      $,
      taskId,
      data,
    });

    $.export("$summary", `Successfully set schedule for task \`${taskId}\`.`);
    return response;
  },
};
