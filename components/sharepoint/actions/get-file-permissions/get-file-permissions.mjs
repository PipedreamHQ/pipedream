import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-file-permissions",
  name: "Get File Permissions",
  description: "Retrieve sharing permissions for one or more files or folders from SharePoint. Returns who has access and their permission levels. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-list-permissions)",
  version: "0.0.1",
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
    fileOrFolderIds: {
      propDefinition: [
        sharepoint,
        "fileOrFolderId",
        (c) => ({
          siteId: c.siteId?.__lv?.value || c.siteId,
          driveId: c.driveId?.__lv?.value || c.driveId,
        }),
      ],
      type: "string[]",
      label: "Files or Folders",
      description: "Select one or more files or folders to get permissions for. You can also pass file IDs directly from the Select Files action output.",
      withLabel: true,
    },
    includeFileMetadata: {
      type: "boolean",
      label: "Include File Metadata",
      description: "When enabled, also fetches file metadata including temporary download URLs (valid for ~1 hour). Useful when you need both permissions and download URLs in one call.",
      optional: true,
      default: false,
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
        // If it's just an ID string, wrap it
        return {
          id: resolved,
          isFolder: false,
        };
      }
    },
    parseFileOrFolderList(values) {
      if (!values) return [];
      const list = Array.isArray(values)
        ? values
        : [
          values,
        ];
      return list.map((v) => this.parseFileOrFolder(v)).filter(Boolean);
    },
    formatPermission(permission) {
      const formatted = {
        id: permission.id,
        roles: permission.roles,
      };

      // Extract user info if present
      if (permission.grantedToV2?.user) {
        formatted.user = {
          id: permission.grantedToV2.user.id,
          displayName: permission.grantedToV2.user.displayName,
          email: permission.grantedToV2.user.email,
        };
      }

      // Extract group info if present
      if (permission.grantedToV2?.group) {
        formatted.group = {
          id: permission.grantedToV2.group.id,
          displayName: permission.grantedToV2.group.displayName,
        };
      }

      // Extract site user info if present (SharePoint-specific)
      if (permission.grantedToV2?.siteUser) {
        formatted.siteUser = {
          id: permission.grantedToV2.siteUser.id,
          displayName: permission.grantedToV2.siteUser.displayName,
          loginName: permission.grantedToV2.siteUser.loginName,
        };
      }

      // Extract sharing link info if present
      if (permission.link) {
        formatted.link = {
          type: permission.link.type,
          scope: permission.link.scope,
          webUrl: permission.link.webUrl,
        };
      }

      // Include inheritance info
      if (permission.inheritedFrom) {
        formatted.inheritedFrom = {
          driveId: permission.inheritedFrom.driveId,
          id: permission.inheritedFrom.id,
          path: permission.inheritedFrom.path,
        };
      }

      // Include expiration if set
      if (permission.expirationDateTime) {
        formatted.expirationDateTime = permission.expirationDateTime;
      }

      return formatted;
    },
  },
  async run({ $ }) {
    const selections = this.parseFileOrFolderList(this.fileOrFolderIds);

    if (selections.length === 0) {
      throw new Error("Please select at least one file or folder");
    }

    const driveId = this.resolveValue(this.driveId);
    const siteId = this.resolveValue(this.siteId);
    const includeFileMetadata = this.includeFileMetadata;

    // Fetch permissions (and optionally file metadata) for all selected items in parallel
    const settledResults = await Promise.allSettled(
      selections.map(async (selected) => {
        // Fetch permissions and optionally file metadata in parallel
        const requests = [
          this.sharepoint.listDriveItemPermissions({
            $,
            driveId,
            itemId: selected.id,
          }),
        ];

        if (includeFileMetadata) {
          requests.push(
            this.sharepoint.getDriveItem({
              $,
              siteId,
              driveId,
              fileId: selected.id,
            }),
          );
        }

        const [
          permissionsResponse,
          fileMetadata,
        ] = await Promise.all(requests);

        const result = {
          itemId: selected.id,
          itemName: selected.name || selected.id,
          isFolder: selected.isFolder || false,
          permissions: (permissionsResponse.value || []).map((p) => this.formatPermission(p)),
          _meta: {
            driveId,
            itemId: selected.id,
          },
        };

        // Add file metadata if requested
        if (includeFileMetadata && fileMetadata) {
          result.downloadUrl = fileMetadata["@microsoft.graph.downloadUrl"];
          result.webUrl = fileMetadata.webUrl;
          result.size = fileMetadata.size;
          result.mimeType = fileMetadata.file?.mimeType;
          result.lastModifiedDateTime = fileMetadata.lastModifiedDateTime;
          result.createdDateTime = fileMetadata.createdDateTime;
          if (fileMetadata.lastModifiedBy?.user) {
            result.lastModifiedBy = {
              displayName: fileMetadata.lastModifiedBy.user.displayName,
              email: fileMetadata.lastModifiedBy.user.email,
            };
          }
        }

        return result;
      }),
    );

    // Separate successful and failed results
    const results = [];
    const errors = [];

    settledResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        const selected = selections[index];
        const errorMessage = result.reason?.message || String(result.reason);
        console.error(`Failed to fetch permissions for ${selected.id} (${selected.name}): ${errorMessage}`);
        errors.push({
          itemId: selected.id,
          itemName: selected.name,
          error: errorMessage,
        });
      }
    });

    // If all items failed, throw an error
    if (results.length === 0 && errors.length > 0) {
      throw new Error(`Failed to fetch permissions for all items: ${errors.map((e) => e.itemName || e.itemId).join(", ")}`);
    }

    // Calculate total permissions count
    const totalPermissions = results.reduce((sum, r) => sum + r.permissions.length, 0);

    // If single item, return it directly for simpler usage
    if (results.length === 1 && errors.length === 0) {
      const item = results[0];
      $.export("$summary", `Found ${item.permissions.length} permission(s) for: ${item.itemName}`);
      return item;
    }

    // Multiple items: return as array
    const itemNames = results.map((r) => r.itemName).join(", ");
    const summaryParts = [
      `Found ${totalPermissions} total permission(s) across ${results.length} item(s): ${itemNames}`,
    ];
    if (errors.length > 0) {
      summaryParts.push(`Failed to fetch ${errors.length} item(s): ${errors.map((e) => e.itemName || e.itemId).join(", ")}`);
    }
    $.export("$summary", summaryParts.join(". "));

    return {
      items: results,
      totalPermissions,
      ...(errors.length > 0 && {
        errors,
      }),
    };
  },
};
