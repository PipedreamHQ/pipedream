import retrieveFileMetadata from
  "../../../sharepoint/actions/retrieve-file-metadata/retrieve-file-metadata.mjs";
import sharepointAdmin from
  "../../sharepoint_admin.app.mjs";
import parseUtils from
  "../../../sharepoint/common/utils.mjs";
import { extractCustomFields } from
  "../../common/customFields.mjs";

export default {
  ...retrieveFileMetadata,
  key: "sharepoint_admin-retrieve-file-metadata",
  name: retrieveFileMetadata.name,
  description: retrieveFileMetadata.description,
  type: retrieveFileMetadata.type,
  version: "0.0.4",
  props: {
    sharepointAdmin,
    siteId: {
      propDefinition: [
        sharepointAdmin,
        "siteId",
      ],
      withLabel: true,
    },
    driveId: {
      propDefinition: [
        sharepointAdmin,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      withLabel: true,
    },
    folderId: {
      propDefinition: [
        sharepointAdmin,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      label: "Folder",
      description: "The folder to browse. Leave empty "
        + "to browse the root of the drive.",
      optional: true,
      withLabel: true,
    },
    fileIds: {
      propDefinition: [
        sharepointAdmin,
        "fileOrFolderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
          folderId: c.folderId,
        }),
      ],
      type: "string[]",
      label: "Files",
      description:
        "Select one or more files to retrieve metadata for.",
      withLabel: true,
    },
  },
  methods: {
    ...retrieveFileMetadata.methods,
    addCustomFields(results) {
      if (!results) return results;
      const isSingleFile = !results.files
        && results._meta;
      const items = isSingleFile
        ? [
          results,
        ]
        : results.files || [];
      for (const item of items) {
        item.customFields = extractCustomFields(
          item.listItem?.fields,
        );
      }
      return results;
    },
  },
  async run({ $ }) {
    this.sharepoint = this.sharepointAdmin;

    const selections =
      parseUtils.parseFileOrFolderList(this.fileIds);

    if (selections.length === 0) {
      throw new Error(
        "Please select at least one file",
      );
    }

    const siteId =
      this.sharepoint.resolveWrappedValue(this.siteId);
    const driveId =
      this.sharepoint.resolveWrappedValue(this.driveId);

    const {
      fileResults,
      errors,
    } = await this.fetchFileMetadata(
      $, selections, siteId, driveId, {
        includeDownloadUrl: false,
      },
    );

    const result = this.processResults(
      $, fileResults, errors, [], {
        successVerb: "Retrieved",
        successNoun: "metadata",
      },
    );

    return this.addCustomFields(result);
  },
};
