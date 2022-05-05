export default {
  type: "app",
  app: "data_stores",
  propDefinitions: {
    dataStore: {
      label: "Data Store",
      type: "data_store",
      description: "Select an existing Data Store or create a new one.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    //Because user might enter a JSON as JS object;
    //This method converts a JS object string to a JSON string before parsing it
    //e.g. {a:"b", 'c':1} => {"a":"b", "c":1}
    //We don't use eval here because of security reasons.
    //Using eval may cause something undesired run in the script.
    sanitizeJson(str) {
      return str.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ");
    },
  },
};
