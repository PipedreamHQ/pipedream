const docusign = require("../../docusign.app.js");

module.exports = {
  key: "docusign-new-folder",
  name: "New Folder",
  description: "Emits an event when a new folder is created",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    docusign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    include: {
      type: "string[]",
      label: "Folder types",
      description: "Folder types to include in the response",
      options: [
        "envelope_folders",
        "template_folders",
        "shared_template_folders",
      ],
      default: [
        "envelope_folders",
        "template_folders",
        "shared_template_folders",
      ],
    },
  },
  methods: {
    async processFolders(baseUri, params, folders, ts) {
      for (const folder of folders) {
        if (folder.hasSubFolders == "true") {
          for (const subfolder of folder.folders) {
            let done = false;
            do {
              const {
                folders: subfolders,
                nextUri,
                resultSetSize,
              } = await this.docusign.listFolderItems(baseUri, params, subfolder.folderId);
              await this.processFolders(baseUri, params, subfolders, ts);
              if (nextUri) params.start_postion += resultSetSize + 1;
              else done = true;
            } while (!done);
          }
        }
        const meta = this.generateMeta(folder, ts);
        this.$emit(folder, meta);
      }
    },
    generateMeta({
      folderId: id, name: summary,
    }, ts) {
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { timestamp: ts } = event;
    const baseUri =  await this.docusign.getBaseUri(this.account);
    let done = false;
    const params = {
      start_position: 0,
      include: (this.include).join(),
      include_items: true,
    };
    do {
      const {
        folders = [],
        nextUri,
        resultSetSize,
      } = await this.docusign.listFolders(baseUri, params);
      if (nextUri) params.start_position += resultSetSize + 1;
      else done = true;

      await this.processFolders(baseUri, params, folders, ts);

    } while (!done);
  },
};
