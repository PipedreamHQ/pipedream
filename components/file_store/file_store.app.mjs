export default {
  type: "app",
  app: "file_store",
  propDefinitions: {
    directory: {
      type: "string",
      label: "Directory",
      description: "The directory to list or upload files to. Defaults to the root directory.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file to create a URL for.",
    },
  },
  methods: {},
};
