import common from "../common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      description: "Watch for failed tasks on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
    database: {
      propDefinition: [
        common.props.snowflake,
        "database",
      ],
    },
    schemas: {
      propDefinition: [
        common.props.snowflake,
        "schema",
        (configuredProps) => ({
          database: configuredProps.database,
        }),
      ],
      type: "string[]",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task to watch for failures. It allows you to use Regex to match multiple tasks.",
      optional: true,
    },
  },
  type: "source",
  key: "snowflake-failed-task-in-schema",
  // eslint-disable-next-line
  name: "Failed Task in Schema",
  description: "Emit new events when a task fails in a database schema",
  version: "0.1.2",
  async run() {
    await this.emitFailedTasks({
      database: this.database,
      schemas: this.schemas,
      taskName: this.taskName,
    });
  },
};
