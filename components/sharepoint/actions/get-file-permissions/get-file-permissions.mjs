import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-file-permissions",
  name: "Get File Permissions",
  description: "Retrieve sharing permissions for one or more files or folders from SharePoint. Returns who has access and their permission levels. Optionally expands permission groups to show individual users with email addresses. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-list-permissions)",
  version: "0.0.2",
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
    expandGroupsToUsers: {
      type: "boolean",
      label: "Expand Groups to Users",
      description: "When enabled, expands permission groups to show individual users with their email addresses. This is useful when you need to know exactly which end users have access to the files. Uses SharePoint REST API to expand SharePoint-native groups.",
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
    // Decode base64 permission IDs (SharePoint encodes group names in base64)
    tryDecodeBase64(str) {
      try {
        if (/^[A-Za-z0-9+/]+=*$/.test(str) && str.length > 10) {
          const decoded = Buffer.from(str, "base64").toString("utf-8");
          if (/^[\x20-\x7E\s]+$/.test(decoded)) {
            return decoded;
          }
        }
      } catch {
        // Not valid base64
      }
      return null;
    },
    // Determine access level from roles array
    getAccessLevel(roles) {
      if (roles.includes("owner")) return "owner";
      if (roles.includes("write")) return "write";
      if (roles.includes("read")) return "read";
      return "read"; // Default to read if unknown
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
    const expandGroupsToUsers = this.expandGroupsToUsers;

    // If expanding groups, we need the site webUrl for SharePoint REST API
    let siteWebUrl = null;
    let sharePointSiteGroups = null;
    let siteGroupsError = null;
    const expansionDebug = {
      siteWebUrl: null,
      sharePointSiteGroupsFound: 0,
      sharePointSiteGroupNames: [],
      groupsToExpandCount: 0,
      groupsToExpand: [],
      expansionErrors: [],
    };

    if (expandGroupsToUsers) {
      try {
        const site = await this.sharepoint.getSite({
          $,
          siteId,
          params: {
            $select: "webUrl",
          },
        });
        siteWebUrl = site.webUrl;
        expansionDebug.siteWebUrl = siteWebUrl;

        // Fetch all SharePoint site groups upfront
        const spGroupsResponse = await this.sharepoint.listSharePointSiteGroups({
          $,
          siteWebUrl,
        });
        sharePointSiteGroups = spGroupsResponse.d?.results || [];
        expansionDebug.sharePointSiteGroupsFound = sharePointSiteGroups.length;
        expansionDebug.sharePointSiteGroupNames = sharePointSiteGroups.map((g) => g.Title);
      } catch (e) {
        siteGroupsError = e instanceof Error ? e.message : String(e);
        expansionDebug.expansionErrors.push(`Site/groups fetch error: ${siteGroupsError}`);
        console.log("Could not fetch site info for group expansion:", siteGroupsError);
      }
    }

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

    // Expand groups to individual users if requested
    if (expandGroupsToUsers && results.length > 0) {
      // Collect all unique groups across all items
      const groupsToExpand = new Map(); // key: group identifier, value: { displayName, roles, ... }

      for (const item of results) {
        for (const permission of item.permissions) {
          const roles = permission.roles || [];
          const accessLevel = this.getAccessLevel(roles);

          // Check for Entra ID group
          if (permission.group?.id) {
            const key = `entra:${permission.group.id}`;
            if (!groupsToExpand.has(key)) {
              groupsToExpand.set(key, {
                type: "entraId",
                id: permission.group.id,
                displayName: permission.group.displayName,
                accessLevel,
              });
            }
          }

          // Check for siteUser that might be a group/role claim
          if (permission.siteUser?.loginName) {
            const claimMatch = permission.siteUser.loginName.match(/c:0t\.c\|tenant\|([a-f0-9-]+)/i);
            if (claimMatch) {
              const key = `entra:${claimMatch[1]}`;
              if (!groupsToExpand.has(key)) {
                groupsToExpand.set(key, {
                  type: "entraId",
                  id: claimMatch[1],
                  displayName: permission.siteUser.displayName,
                  accessLevel,
                });
              }
            }
          }

          // Check for SharePoint-native groups (base64-encoded IDs)
          if (permission.id && !permission.user && !permission.group && !permission.link) {
            const decodedName = this.tryDecodeBase64(permission.id);
            if (decodedName) {
              const key = `sp:${decodedName}`;
              if (!groupsToExpand.has(key)) {
                groupsToExpand.set(key, {
                  type: "sharePoint",
                  id: permission.id,
                  displayName: decodedName,
                  accessLevel,
                });
              }
            }
          }
        }
      }

      // Track groups for debug
      expansionDebug.groupsToExpandCount = groupsToExpand.size;
      expansionDebug.groupsToExpand = Array.from(groupsToExpand.values()).map(
        (g) => `${g.type}:${g.displayName}`,
      );

      // Expand all groups to get individual users
      const usersWithAccess = new Map(); // key: email or loginName, value: user info

      for (const [
        ,
        group,
      ] of groupsToExpand) {
        if (group.type === "entraId") {
          // Try to expand Entra ID group via Graph API
          try {
            const membersResponse = await this.sharepoint.listGroupMembers({
              $,
              groupId: group.id,
              params: {
                $select: "id,displayName,mail,userPrincipalName",
              },
            });

            for (const member of membersResponse.value || []) {
              if (member["@odata.type"] === "#microsoft.graph.user") {
                const email = member.mail || member.userPrincipalName;
                const key = email?.toLowerCase() || member.id;
                if (!usersWithAccess.has(key)) {
                  usersWithAccess.set(key, {
                    id: member.id,
                    displayName: member.displayName,
                    email,
                    accessLevel: group.accessLevel,
                    viaGroup: group.displayName,
                    groupType: "entraId",
                  });
                }
              }
            }
          } catch (e) {
            // Try as directory role
            try {
              const roleResponse = await this.sharepoint._makeRequest({
                $,
                path: `/directoryRoles/${group.id}/members`,
                params: {
                  $select: "id,displayName,mail,userPrincipalName",
                },
              });

              for (const member of roleResponse.value || []) {
                if (member["@odata.type"] === "#microsoft.graph.user") {
                  const email = member.mail || member.userPrincipalName;
                  const key = email?.toLowerCase() || member.id;
                  if (!usersWithAccess.has(key)) {
                    usersWithAccess.set(key, {
                      id: member.id,
                      displayName: member.displayName,
                      email,
                      accessLevel: group.accessLevel,
                      viaGroup: group.displayName,
                      groupType: "directoryRole",
                    });
                  }
                }
              }
            } catch {
              console.log(`Could not expand Entra ID group/role ${group.displayName}`);
            }
          }
        } else if (group.type === "sharePoint") {
          if (!sharePointSiteGroups || !siteWebUrl) {
            expansionDebug.expansionErrors.push(`Cannot expand SP group "${group.displayName}": siteWebUrl=${!!siteWebUrl}, siteGroups=${!!sharePointSiteGroups}`);
            continue;
          }

          // Find matching SharePoint group by name
          const spGroup = sharePointSiteGroups.find(
            (g) => g.Title === group.displayName,
          );

          if (!spGroup) {
            expansionDebug.expansionErrors.push(`SP group "${group.displayName}" not found in site groups`);
            continue;
          }

          try {
            const spMembersResponse = await this.sharepoint.getSharePointSiteGroupMembers({
              $,
              siteWebUrl,
              groupId: spGroup.Id,
            });

            const spMembers = spMembersResponse.d?.results || [];
            for (const spUser of spMembers) {
              const key = spUser.Email?.toLowerCase() || spUser.LoginName;
              if (key && !usersWithAccess.has(key)) {
                usersWithAccess.set(key, {
                  id: spUser.Id?.toString(),
                  displayName: spUser.Title,
                  email: spUser.Email,
                  loginName: spUser.LoginName,
                  accessLevel: group.accessLevel,
                  viaGroup: group.displayName,
                  groupType: "sharePoint",
                });
              }
            }
          } catch (e) {
            const errMsg = e instanceof Error ? e.message : String(e);
            expansionDebug.expansionErrors.push(`Error expanding SP group "${group.displayName}": ${errMsg}`);
            console.log(`Could not expand SharePoint group ${group.displayName}:`, errMsg);
          }
        }
      }

      // Add direct user permissions (not via groups)
      for (const item of results) {
        for (const permission of item.permissions) {
          if (permission.user?.email) {
            const key = permission.user.email.toLowerCase();
            if (!usersWithAccess.has(key)) {
              usersWithAccess.set(key, {
                id: permission.user.id,
                displayName: permission.user.displayName,
                email: permission.user.email,
                accessLevel: this.getAccessLevel(permission.roles || []),
                viaGroup: null,
                groupType: "direct",
              });
            }
          }
        }
      }

      // Add usersWithAccess and debug info to each result
      const usersArray = Array.from(usersWithAccess.values());
      for (const item of results) {
        item.usersWithAccess = usersArray;
        item._expansionDebug = expansionDebug;
      }
    }

    // Calculate total permissions count
    const totalPermissions = results.reduce((sum, r) => sum + r.permissions.length, 0);

    // If single item, return it directly for simpler usage
    if (results.length === 1 && errors.length === 0) {
      const item = results[0];
      const userCount = item.usersWithAccess?.length || 0;
      const summaryText = expandGroupsToUsers && userCount > 0
        ? `Found ${item.permissions.length} permission(s) and ${userCount} user(s) with access for: ${item.itemName}`
        : `Found ${item.permissions.length} permission(s) for: ${item.itemName}`;
      $.export("$summary", summaryText);
      return item;
    }

    // Multiple items: return as array
    const itemNames = results.map((r) => r.itemName).join(", ");
    const totalUsers = results[0]?.usersWithAccess?.length || 0;
    const summaryParts = [
      `Found ${totalPermissions} total permission(s) across ${results.length} item(s): ${itemNames}`,
    ];
    if (expandGroupsToUsers && totalUsers > 0) {
      summaryParts.push(`${totalUsers} user(s) with access`);
    }
    if (errors.length > 0) {
      summaryParts.push(`Failed to fetch ${errors.length} item(s): ${errors.map((e) => e.itemName || e.itemId).join(", ")}`);
    }
    $.export("$summary", summaryParts.join(". "));

    return {
      items: results,
      totalPermissions,
      ...(expandGroupsToUsers && totalUsers > 0 && {
        totalUsersWithAccess: totalUsers,
      }),
      ...(errors.length > 0 && {
        errors,
      }),
    };
  },
};
