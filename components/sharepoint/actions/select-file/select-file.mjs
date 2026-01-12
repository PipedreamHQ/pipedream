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
      type: "string",
      label: "Folder",
      description: "The folder to browse. Leave empty to browse the root of the drive.",
      optional: true,
      async options({
        siteId, driveId,
      }) {
        const resolvedSiteId = siteId?.__lv?.value || siteId;
        const resolvedDriveId = driveId?.__lv?.value || driveId;
        if (!resolvedSiteId || !resolvedDriveId) {
          return [];
        }
        const response = await this.sharepoint.listDriveItems({
          siteId: resolvedSiteId,
          driveId: resolvedDriveId,
        });
        return response.value
          ?.filter(({ folder }) => folder)
          .map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          })) || [];
      },
      withLabel: true,
      reloadProps: true,
    },
    fileOrFolderId: {
      type: "string",
      label: "File or Folder",
      description: "Select a file to complete your selection, or select a folder and click 'Refresh Fields' to browse into it",
      async options({
        siteId, driveId, folderId,
      }) {
        const resolvedSiteId = siteId?.__lv?.value || siteId;
        const resolvedDriveId = driveId?.__lv?.value || driveId;
        const resolvedFolderId = folderId?.__lv?.value || folderId;
        if (!resolvedSiteId || !resolvedDriveId) {
          return [];
        }
        const response = resolvedFolderId
          ? await this.sharepoint.listDriveItemsInFolder({
            siteId: resolvedSiteId,
            folderId: resolvedFolderId,
          })
          : await this.sharepoint.listDriveItems({
            siteId: resolvedSiteId,
            driveId: resolvedDriveId,
          });
        return response.value?.map(({
          id, name, folder, size,
        }) => ({
          value: JSON.stringify({
            id,
            name,
            isFolder: !!folder,
            size,
          }),
          label: folder
            ? `📁 ${name}`
            : `📄 ${name}`,
        })) || [];
      },
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
