import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-select-file",
  name: "Select File",
  description: "A file picker action that allows browsing and selecting files from SharePoint. Returns the selected file's metadata. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
      withLabel: true,
      reloadProps: true,
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId?.__lv?.value || c.siteId,
        }),
      ],
      withLabel: true,
      reloadProps: true,
    },
    folderId: {
      propDefinition: [
        sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId?.__lv?.value || c.siteId,
          driveId: c.driveId?.__lv?.value || c.driveId,
        }),
      ],
      label: "Folder",
      description: "The folder to browse. Leave empty to browse the root of the drive.",
      optional: true,
      withLabel: true,
      reloadProps: true,
    },
    fileOrFolderId: {
      propDefinition: [
        sharepoint,
        "fileOrFolderId",
        (c) => ({
          siteId: c.siteId?.__lv?.value || c.siteId,
          driveId: c.driveId?.__lv?.value || c.driveId,
          folderId: c.folderId?.__lv?.value || c.folderId,
        }),
      ],
      label: "File or Folder",
      description: "Select a file to complete your selection, or select a folder and click 'Refresh Fields' to browse into it",
      withLabel: true,
    },
  },
  methods: {
    resolveValue(prop) {
      if (!prop) return null;
      if (typeof prop === "object" && prop.__lv) {
        return prop.__lv.value;
      }
      return prop;
    },
    parseFileOrFolder(value) {
      if (!value) return null;
      const resolved = this.resolveValue(value);
      try {
        return JSON.parse(resolved);
      } catch {
        return {
          id: resolved,
          isFolder: false,
        };
      }
    },
  },
  async run({ $ }) {
    const selected = this.parseFileOrFolder(this.fileOrFolderId);

    if (!selected) {
      throw new Error("Please select a file or folder");
    }

    if (selected.isFolder) {
      $.export("$summary", `Selected folder: ${selected.name}. Set this as the Folder ID and refresh to browse its contents.`);
      return {
        type: "folder",
        id: selected.id,
        name: selected.name,
        message: "To browse this folder, set it as the folderId and reload props",
      };
    }

    const siteId = this.resolveValue(this.siteId);
    const file = await this.sharepoint.getDriveItem({
      $,
      siteId,
      fileId: selected.id,
    });

    $.export("$summary", `Selected file: ${file.name}`);
    return file;
  },
};
