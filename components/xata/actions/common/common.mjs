import app from "../../xata.app.mjs";

export default {
  props: {
    app,
    endpoint: {
      propDefinition: [
        app,
        "endpoint",
      ],
    },
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    branch: {
      propDefinition: [
        app,
        "branch",
        (c) => ({
          endpoint: c.endpoint,
          database: c.database,
        }),
      ],
    },
    table: {
      propDefinition: [
        app,
        "table",
      ],
      reloadProps: true,
    },
  },
  async additionalProps(props) {
    const {
      endpoint,
      database,
      branch,
      table,
    } = this;

    const description = "The keys and values of the data that will be recorded in the database.";

    if (endpoint && database && branch && table) {
      try {
        const { columns } = await this.app.listColumns({
          endpoint,
          database,
          branch,
          table,
        });
        if (columns?.length) {
          let descriptionWithColumns = `${description} Available Columns:`;
          for (const column of columns) {
            descriptionWithColumns += ` \`${column.name}\``;
          }
          props.recordData.description = descriptionWithColumns;
          return {};
        }
      } catch (e) {
        props.recordData.description = description;
        // Columns not found. Occurs when the user hasn't finished entering the table name
      }
    }
    props.recordData.description = description;
    return {};
  },
  methods: {
    async formatRecordData() {
      const recordData = this.recordData;
      const { columns } = await this.app.listColumns({
        endpoint: this.endpoint,
        database: this.database,
        branch: this.branch,
        table: this.table,
      });
      if (!columns?.length) {
        return this.recordData;
      }
      for (const column of columns) {
        if (recordData[column.name] && (column.type === "int" || column.type === "float")) {
          recordData[column.name] = +recordData[column.name];
        }
        if (recordData[column.name] && column.type === "bool") {
          recordData[column.name] = !(recordData[column.name] === "false" || recordData[column.name === "0"]);
        }
      }
      return recordData;
    },
  },
};
