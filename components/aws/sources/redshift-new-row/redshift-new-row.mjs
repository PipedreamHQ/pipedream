import common from "../common/redshift-polling.mjs";

export default {
  ...common,
  key: "aws-redshift-new-row",
  name: "Redshift - New Row",
  description: "Emit new event when a new row is added to a table. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    uniqueColumn: {
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
      uniqueColumn,
      getValue,
    } = this;

    const lastId = this.db.get("lastId");

    let sql = `SELECT * FROM ${schema}.${table}`;
    if (lastId) {
      sql += ` WHERE ${uniqueColumn} > :lastId`;
    }

    sql += ` ORDER BY ${uniqueColumn} DESC LIMIT 100`;

    const parameters = lastId
      ? [
        {
          name: "lastId",
          value: String(lastId),
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

      const records = response.Records.map((record) => {
        return record.reduce((row, field, index) => ({
          ...row,
          [columnNames[index]]: getValue(field),
        }), {});
      });

      records.reverse().forEach((record) => {
        const id = record[uniqueColumn];
        const ts = Date.now();
        this.$emit(record, {
          id,
          ts,
          summary: `New Row Added ${id}`,
        });
      });

      if (records?.length > 0) {
        const [
          lastId,
        ] = records.map((record) => record[uniqueColumn]).reverse();
        this.db.set("lastId", lastId);
      }
    }
  },
};
