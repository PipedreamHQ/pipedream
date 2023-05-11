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
    schema: {
      propDefinition: [
        common.props.snowflake,
        "schema",
        (configuredProps) => ({
          database: configuredProps.database,
        }),
      ],
    },
  },
  type: "source",
  key: "snowflake-failed-task-in-schema",
  // eslint-disable-next-line
  name: "Failed Task in Schema",
  description: "Emit new events when a task fails in a database schema",
  version: "0.1.0",
  async run() {
    await this.emitFailedTasks({
      database: this.database,
      schema: this.schema,
    });
  },
};
