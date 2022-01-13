import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-create-new-document",
  name: "Create New Document",
  description: "Create a new document in a collection of your choice",
  version: "0.0.9",
  type: "action",
  props: {
    mongodbApp,
  },
  async run() {
    await this.mongodbApp.getConnection();
  },
};
