import app from "../../mitra.app.mjs";

export default {
  key: "mitra-delete-data",
  name: "Delete Data",
  description: "Deletes a record from a table in the Mitra database. [See the documentation]()", // Add documentation link if available
  version: "0.0.1",
  type: "action",
  props: {
    app,
    tableName: {
      propDefinition: [
        app,
        "tableName",
      ],
    },
    dimensionContentId: {
      type: "string",
      label: "Dimension Content ID",
      description: "The unique identifier of the record to delete.",
    },
  },
  methods: {
    deleteData({
      tableName, dimensionContentId, ...args
    } = {}) {
      return this.app.delete({
        tableName,
        path: `/${dimensionContentId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteData,
      tableName,
      dimensionContentId,
    } = this;

    const response = await deleteData({
      tableName,
      dimensionContentId,
    });

    $.export("$summary", "Succesfully deleted record from the Mitra database.");
    return response;
  },
};
