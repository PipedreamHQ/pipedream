import app from "../../weaviate.app.mjs";

export default {
  key: "weaviate-delete-class",
  name: "Delete Class",
  description: "Delete a class from Weaviate. [See the documentation](https://docs.weaviate.io/weaviate/api/rest#tag/schema/delete/schema/{className})",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    classId: {
      propDefinition: [
        app,
        "classId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteClass({
      $,
      classId: this.classId,
    });
    $.export("$summary", "Successfully deleted the class named " + this.classId);
    return response;
  },
};
