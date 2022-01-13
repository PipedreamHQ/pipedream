import mongoose from "mongoose";

export default {
  type: "app",
  app: "mongodb",
  propDefinitions: {},
  methods: {
    async getConnection() {
      const {
        username,
        password,
        database,
        hostname,
      } = this.$auth;
      // mongodb+srv://root:root@cluster0.jcnyr.mongodb.net/test
      const uri = `mongodb+srv://${username}:${password}@${hostname}/${database}`;
      console.log(uri);
      const res = await mongoose.connect(uri);
      console.log(res);
    },
  },
};
