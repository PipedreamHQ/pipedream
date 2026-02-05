import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-site-members",
  name: "List Site Members",
  description: "List all members of a SharePoint site. For team sites connected to Microsoft 365 Groups, returns group members (Owners and Members). For sites without an M365 Group, returns site-level permissions. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-list-members)",
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
    },
  },
  methods: {
    formatGraphUser(user, role) {
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.mail || user.userPrincipalName,
        userPrincipalName: user.userPrincipalName,
        jobTitle: user.jobTitle,
        role,
      };
    },
  },
  async run({ $ }) {
    // Get the site details including the associated group if any
    const site = await this.sharepoint.getSite({
      $,
      siteId: this.siteId,
      params: {
        $select: "id,webUrl,displayName",
        $expand: "drive",
      },
    });

    // Try to find the associated M365 group
    // The site ID format for group-connected sites includes the group ID
    // We can also check if there's a root site or group association
    let groupId = null;

    // Method 1: Try to get the group from site path
    // Group-connected sites have format: {hostname},{site-collection-id},{web-id}
    // We need to query to find the associated group

    // Method 2: Search for a group with the same name or associated site
    try {
      // Try to find a group whose displayName matches the site
      const groupsResponse = await this.sharepoint.listGroups({
        $,
        params: {
          $filter: `displayName eq '${site.displayName.replace(/'/g, "''")}'`,
          $select: "id,displayName,mail",
        },
      });

      if (groupsResponse.value?.length > 0) {
        // Verify this group is connected to our site
        for (const group of groupsResponse.value) {
          try {
            const groupSiteResponse = await this.sharepoint._makeRequest({
              $,
              path: `/groups/${group.id}/sites/root`,
              params: {
                $select: "id",
              },
            });
            if (
              groupSiteResponse.id === this.siteId
              || groupSiteResponse.id?.includes(this.siteId)
            ) {
              groupId = group.id;
              break;
            }
          } catch {
            // Group doesn't have an associated site, continue
          }
        }
      }
    } catch (e) {
      console.log("Could not search for associated group:", e.message);
    }

    // If we found an associated M365 group, get owners and members
    if (groupId) {
      const [
        ownersResponse,
        membersResponse,
      ] = await Promise.all([
        this.sharepoint._makeRequest({
          $,
          path: `/groups/${groupId}/owners`,
          params: {
            $select: "id,displayName,mail,userPrincipalName,jobTitle",
          },
        }),
        this.sharepoint.listGroupMembers({
          $,
          groupId,
          params: {
            $select: "id,displayName,mail,userPrincipalName,jobTitle",
          },
        }),
      ]);

      const owners = (ownersResponse.value || [])
        .filter((m) => m["@odata.type"] === "#microsoft.graph.user")
        .map((user) => this.formatGraphUser(user, "owner"));

      const members = (membersResponse.value || [])
        .filter((m) => m["@odata.type"] === "#microsoft.graph.user")
        .map((user) => this.formatGraphUser(user, "member"));

      // Deduplicate - owners are also members in M365 groups
      const ownerIds = new Set(owners.map((o) => o.id));
      const uniqueMembers = members.filter((m) => !ownerIds.has(m.id));

      const allUsers = [
        ...owners,
        ...uniqueMembers,
      ];

      $.export("$summary", `Found ${allUsers.length} user(s) with access to "${site.displayName}" (via M365 Group)`);

      return {
        site: {
          id: this.siteId,
          displayName: site.displayName,
          webUrl: site.webUrl,
        },
        m365Group: {
          id: groupId,
          note: "This site is connected to a Microsoft 365 Group. Permissions are managed via group membership.",
        },
        summary: {
          totalUsers: allUsers.length,
          owners: owners.length,
          members: uniqueMembers.length,
        },
        users: allUsers,
        byRole: {
          owners,
          members: uniqueMembers,
        },
      };
    }

    // No M365 Group found - this is likely a Communication Site or classic site
    // For these sites, permissions are managed differently
    // We can try to get drive permissions as a proxy for site access

    // Get drive permissions - check both root and items for inherited site permissions
    let drivePermissions = [];
    try {
      const drivesResponse = await this.sharepoint.listSiteDrives({
        $,
        siteId: this.siteId,
        params: {
          $select: "id,name",
        },
      });

      if (drivesResponse.value?.length > 0) {
        const mainDrive = drivesResponse.value[0];

        // Get root permissions
        const rootPermissionsResponse = await this.sharepoint._makeRequest({
          $,
          path: `/drives/${mainDrive.id}/root/permissions`,
        });
        drivePermissions = rootPermissionsResponse.value || [];

        // Also check permissions on items in the drive to capture inherited site-level permissions
        // Site groups like "Communication site Members" often show up on items but not on root
        const itemsResponse = await this.sharepoint.listDriveItems({
          $,
          siteId: this.siteId,
          driveId: mainDrive.id,
          params: {
            $top: 5,
            $select: "id,name",
          },
        });

        // Check permissions on first few items to find inherited permissions
        for (const item of (itemsResponse.value || []).slice(0, 3)) {
          try {
            const itemPermissionsResponse = await this.sharepoint.listDriveItemPermissions({
              $,
              driveId: mainDrive.id,
              itemId: item.id,
            });

            // Add any permissions we haven't seen yet (especially inherited ones)
            for (const perm of itemPermissionsResponse.value || []) {
              const existingPerm = drivePermissions.find((p) => p.id === perm.id);
              if (!existingPerm) {
                drivePermissions.push(perm);
              }
            }
          } catch (e) {
            console.log(`Could not fetch permissions for item ${item.name}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.log("Could not fetch drive permissions:", e.message);
    }

    // Helper to decode base64 permission IDs (SharePoint encodes group names in base64)
    const tryDecodeBase64 = (str) => {
      try {
        // Check if it looks like base64 (alphanumeric, +, /, =)
        if (/^[A-Za-z0-9+/]+=*$/.test(str) && str.length > 10) {
          const decoded = Buffer.from(str, "base64").toString("utf-8");
          // Check if decoded string is printable text (not binary garbage)
          if (/^[\x20-\x7E\s]+$/.test(decoded)) {
            return decoded;
          }
        }
      } catch {
        // Not valid base64
      }
      return null;
    };

    // Format drive permissions into users
    const usersFromPermissions = [];
    const groupsFromPermissions = [];
    const siteUsersToExpand = []; // Track siteUsers that might be groups/roles

    for (const permission of drivePermissions) {
      const roles = permission.roles || [];
      const role = roles.includes("owner")
        ? "owner"
        : roles.includes("write")
          ? "editor"
          : "reader";

      if (permission.grantedToV2?.user) {
        usersFromPermissions.push({
          id: permission.grantedToV2.user.id,
          displayName: permission.grantedToV2.user.displayName,
          email: permission.grantedToV2.user.email,
          role,
          permissionId: permission.id,
        });
      } else if (permission.grantedToV2?.group) {
        groupsFromPermissions.push({
          id: permission.grantedToV2.group.id,
          displayName: permission.grantedToV2.group.displayName,
          role,
          permissionId: permission.id,
        });
      } else if (permission.grantedToV2?.siteUser) {
        const siteUser = permission.grantedToV2.siteUser;
        // Check if this siteUser is actually a group/role claim (format: c:0t.c|tenant|{guid})
        const claimMatch = siteUser.loginName?.match(/c:0t\.c\|tenant\|([a-f0-9-]+)/i);
        if (claimMatch) {
          // This is a tenant claim (group or role), track for expansion
          siteUsersToExpand.push({
            id: claimMatch[1],
            displayName: siteUser.displayName,
            role,
            permissionId: permission.id,
            siteUserId: siteUser.id,
          });
        } else {
          // Regular site user, add directly
          usersFromPermissions.push({
            id: siteUser.id,
            displayName: siteUser.displayName,
            loginName: siteUser.loginName,
            role,
            permissionId: permission.id,
          });
        }
      } else if (permission.id) {
        // No recognized grantedToV2 data (user, group, or siteUser)
        // This might be a SharePoint-native permission group where the ID is base64-encoded
        const decodedName = tryDecodeBase64(permission.id);
        if (decodedName) {
          // Check if we already have this group
          if (!groupsFromPermissions.find((g) => g.displayName === decodedName)) {
            groupsFromPermissions.push({
              id: permission.id,
              displayName: decodedName,
              role,
              permissionId: permission.id,
              isSharePointNativeGroup: true,
            });
          }
        }
      }
    }

    // Add siteUsers that are actually groups/roles to the groups list for expansion
    for (const siteUser of siteUsersToExpand) {
      // Check if we already have this group from grantedToV2.group
      if (!groupsFromPermissions.find((g) => g.id === siteUser.id)) {
        groupsFromPermissions.push({
          id: siteUser.id,
          displayName: siteUser.displayName,
          role: siteUser.role,
          permissionId: siteUser.permissionId,
        });
      }
    }

    // Fetch SharePoint site groups for fallback expansion
    // This is needed because native SharePoint groups can't be expanded via Graph API
    // Microsoft Graph does NOT support listing SharePoint site group members - must use SharePoint REST API
    // See: https://learn.microsoft.com/en-us/answers/questions/5578364/retrieve-sharepoint-site-group-members-via-api
    let sharePointSiteGroups = null;
    let sharePointGroupsError = null;
    try {
      const spGroupsResponse = await this.sharepoint.listSharePointSiteGroups({
        $,
        siteWebUrl: site.webUrl,
      });
      sharePointSiteGroups = spGroupsResponse.d?.results || [];
    } catch (e) {
      sharePointGroupsError = e.message;
      console.log("Could not fetch SharePoint site groups:", e.message);
    }

    // Helper to expand a SharePoint-native group using the REST API
    const expandSharePointGroup = async (group) => {
      if (!sharePointSiteGroups) return false;

      const spGroup = sharePointSiteGroups.find(
        (g) => g.Title === group.displayName
          || g.LoginName === group.displayName,
      );

      if (!spGroup) return false;

      try {
        const spMembersResponse = await this.sharepoint.getSharePointSiteGroupMembers({
          $,
          siteWebUrl: site.webUrl,
          groupId: spGroup.Id,
        });
        const spMembers = spMembersResponse.d?.results || [];

        // Format SharePoint users - they have different structure than Graph users
        for (const spUser of spMembers) {
          if (!usersFromPermissions.find((u) => u.email === spUser.Email || u.loginName === spUser.LoginName)) {
            usersFromPermissions.push({
              id: spUser.Id?.toString(),
              displayName: spUser.Title,
              email: spUser.Email,
              loginName: spUser.LoginName,
              role: group.role,
              viaGroup: group.displayName,
              viaGroupType: "sharePointGroup",
            });
          }
        }
        group.type = "sharePointGroup";
        group.sharePointGroupId = spGroup.Id;
        group.memberCount = spMembers.length;
        return true;
      } catch (spError) {
        console.log(`Could not expand SharePoint group ${group.displayName}:`, spError.message);
        return false;
      }
    };

    // Expand groups to get individual members
    for (const group of groupsFromPermissions) {
      let members = [];

      // If this is a known SharePoint-native group, skip Graph API and go straight to REST API
      if (group.isSharePointNativeGroup) {
        const expanded = await expandSharePointGroup(group);
        if (!expanded) {
          group.type = "unknown";
          group.expandError = "Could not resolve members from SharePoint REST API";
        }
        continue;
      }

      // Try as M365/Security Group first (Graph API)
      try {
        const groupMembersResponse = await this.sharepoint.listGroupMembers({
          $,
          groupId: group.id,
          params: {
            $select: "id,displayName,mail,userPrincipalName",
          },
        });
        members = groupMembersResponse.value || [];
        group.type = "entraIdGroup";
      } catch (groupError) {
        // If not a group, try as Azure AD Directory Role
        try {
          const roleMembersResponse = await this.sharepoint._makeRequest({
            $,
            path: `/directoryRoles(roleTemplateId='${group.id}')/members`,
            params: {
              $select: "id,displayName,mail,userPrincipalName",
            },
          });
          members = roleMembersResponse.value || [];
          group.type = "directoryRole";
        } catch (roleError) {
          // Try with direct role ID (not template ID)
          try {
            const directRoleMembersResponse = await this.sharepoint._makeRequest({
              $,
              path: `/directoryRoles/${group.id}/members`,
              params: {
                $select: "id,displayName,mail,userPrincipalName",
              },
            });
            members = directRoleMembersResponse.value || [];
            group.type = "directoryRole";
          } catch (directRoleError) {
            // Graph API failed - try SharePoint REST API as fallback
            const expanded = await expandSharePointGroup(group);
            if (expanded) {
              continue; // Skip the generic member processing below
            }

            console.log(`Could not expand ${group.displayName} via any method`);
            group.type = "unknown";
            group.expandError = "Could not resolve members";
          }
        }
      }

      // Process Graph API members (Entra ID groups and directory roles)
      for (const member of members) {
        if (member["@odata.type"] === "#microsoft.graph.user") {
          // Check if user already exists
          if (!usersFromPermissions.find((u) => u.id === member.id)) {
            usersFromPermissions.push({
              id: member.id,
              displayName: member.displayName,
              email: member.mail || member.userPrincipalName,
              role: group.role,
              viaGroup: group.displayName,
              viaGroupType: group.type,
            });
          }
        }
      }
    }

    // IMPORTANT: Also expand ALL SharePoint site groups directly
    // The Graph API permissions may not include all SharePoint-native groups,
    // so we proactively fetch and expand all site groups to ensure complete coverage
    if (sharePointSiteGroups && sharePointSiteGroups.length > 0) {
      for (const spGroup of sharePointSiteGroups) {
        // Skip system groups that typically don't contain regular users
        if (spGroup.Title === "Everyone" || spGroup.Title === "Everyone except external users") {
          continue;
        }

        // Check if we already processed this group
        const alreadyProcessed = groupsFromPermissions.find(
          (g) => g.displayName === spGroup.Title
            || g.sharePointGroupId === spGroup.Id,
        );

        if (alreadyProcessed) {
          continue;
        }

        // Determine role based on group name patterns
        let role = "reader";
        const titleLower = spGroup.Title.toLowerCase();
        if (titleLower.includes("owner")) {
          role = "owner";
        } else if (titleLower.includes("member") || titleLower.includes("contributor")) {
          role = "editor";
        }

        // Expand this SharePoint group
        try {
          const spMembersResponse = await this.sharepoint.getSharePointSiteGroupMembers({
            $,
            siteWebUrl: site.webUrl,
            groupId: spGroup.Id,
          });
          const spMembers = spMembersResponse.d?.results || [];

          // Add to groups list for reporting
          groupsFromPermissions.push({
            id: spGroup.Id?.toString(),
            displayName: spGroup.Title,
            role,
            sharePointGroupId: spGroup.Id,
            type: "sharePointGroup",
            memberCount: spMembers.length,
          });

          // Add members
          for (const spUser of spMembers) {
            if (!usersFromPermissions.find((u) => u.email === spUser.Email || u.loginName === spUser.LoginName)) {
              usersFromPermissions.push({
                id: spUser.Id?.toString(),
                displayName: spUser.Title,
                email: spUser.Email,
                loginName: spUser.LoginName,
                role,
                viaGroup: spGroup.Title,
                viaGroupType: "sharePointGroup",
              });
            }
          }
        } catch (spError) {
          console.log(`Could not expand SharePoint group ${spGroup.Title}:`, spError.message);
          groupsFromPermissions.push({
            id: spGroup.Id?.toString(),
            displayName: spGroup.Title,
            role,
            sharePointGroupId: spGroup.Id,
            type: "sharePointGroup",
            expandError: spError.message,
          });
        }
      }
    }

    $.export("$summary", `Found ${usersFromPermissions.length} user(s) with access to "${site.displayName}" (Communication Site)`);

    return {
      site: {
        id: this.siteId,
        displayName: site.displayName,
        webUrl: site.webUrl,
      },
      note: "This site is not connected to a Microsoft 365 Group. Showing users with document library access.",
      summary: {
        totalUsers: usersFromPermissions.length,
        permissionGroups: groupsFromPermissions.length,
        sharePointSiteGroupsFound: sharePointSiteGroups?.length || 0,
      },
      users: usersFromPermissions,
      groups: groupsFromPermissions,
      ...(sharePointGroupsError && {
        sharePointGroupsError,
      }),
      ...(sharePointSiteGroups && {
        _debug: {
          sharePointSiteGroups: sharePointSiteGroups.map((g) => ({
            Id: g.Id,
            Title: g.Title,
          })),
        },
      }),
    };
  },
};
