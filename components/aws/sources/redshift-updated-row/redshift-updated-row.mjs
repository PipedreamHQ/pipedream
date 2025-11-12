import common from "../common/redshift-polling.mjs";

export default {
  ...common,
  key: "aws-redshift-updated-row",
  name: "Redshift - Updated Row",
  description: "Emit new event when a row is updated, based on a selected timestamp column. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      propDefinition: [
        common.props.app,
        "info",
      ],
    },
    timestampColumn: {
      label: "Timestamp Column",
      description: "A column with a timestamp that is updated when a row is modified.",
      propDefinition: [
        common.props.app,
        "uniqueColumn",
        ({
          region,
          database,
          workgroupName,
          schema,
          table,
        }) => ({
          region,
          database,
          workgroupName,
          schema,
          table,
          filter: (column) => column.typeName === "timestamp",
        }),
      ],
    },
  },
  async run() {
    const {
      region,
      workgroupName,
      database,
      schema,
      table,
      timestampColumn,
      getValue,
    } = this;

    const lastTimestamp = this.db.get("lastTimestamp");

    let sql = `SELECT * FROM ${schema}.${table}`;
    if (lastTimestamp) {
      sql += ` WHERE ${timestampColumn} > :lastTimestamp`;
    }
    sql += ` ORDER BY ${timestampColumn} DESC LIMIT 100`;

    const parameters = lastTimestamp
      ? [
        {
          name: "lastTimestamp",
          value: lastTimestamp,
        },
      ]
      : undefined;

    const response = await this.app.executeStatement({
      region,
      workgroupName,
      database,
      sql,
      parameters,
    });

    if (response?.Records?.length > 0) {
      const columnNames = response.ColumnMetadata.map((c) => c.name);

      const records = response.Records.map((record) =>
        record.reduce((row, field, index) => ({
          ...row,
          [columnNames[index]]: getValue(field),
        }), {}));

      records.reverse().forEach((record) => {
        const id = record[timestampColumn];
        const ts = new Date(record[timestampColumn]).getTime();
        this.$emit(record, {
          id,
          ts,
          summary: `Row Updated ${id}`,
        });
      });

      if (records?.length > 0) {
        const [
          newLastTimestamp,
        ] = records.map((record) => record[timestampColumn]).reverse();
        this.db.set("lastTimestamp", newLastTimestamp);
      }
    }
  },
};
