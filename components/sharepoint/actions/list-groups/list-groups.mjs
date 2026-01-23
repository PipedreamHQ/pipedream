import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-site-members",
  name: "List Site Members",
  description: "List all members of a SharePoint site grouped by their permission level (Owners, Members, Visitors). Use this to understand who has access to files within a site. [See the documentation](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-folders-and-files-with-rest)",
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
    },
    includeAllGroups: {
      type: "boolean",
      label: "Include All Site Groups",
      description: "By default, only shows standard groups (Owners, Members, Visitors). Enable to include all custom site groups.",
      optional: true,
      default: false,
    },
  },
  methods: {
    formatUser(user) {
      return {
        id: user.Id,
        displayName: user.Title,
        email: user.Email,
        loginName: user.LoginName,
        userPrincipalName: user.UserPrincipalName,
        isSiteAdmin: user.IsSiteAdmin,
      };
    },
    isStandardGroup(groupName) {
      // Standard SharePoint site groups typically end with these suffixes
      const standardSuffixes = [
        "Owners",
        "Members",
        "Visitors",
      ];
      return standardSuffixes.some((suffix) => groupName.endsWith(suffix));
    },
    getPermissionLevel(groupName) {
      if (groupName.endsWith("Owners")) return "owner";
      if (groupName.endsWith("Members")) return "member";
      if (groupName.endsWith("Visitors")) return "visitor";
      return "custom";
    },
  },
  async run({ $ }) {
    // Get the site's webUrl
    const site = await this.sharepoint.getSite({
      $,
      siteId: this.siteId,
      params: {
        $select: "webUrl,displayName",
      },
    });

    const siteWebUrl = site.webUrl;

    // Fetch all SharePoint site groups
    const groupsResponse = await this.sharepoint.listSharePointSiteGroups({
      $,
      siteWebUrl,
    });

    const siteGroups = groupsResponse.d?.results || [];
    const membersByPermissionLevel = {
      owners: [],
      members: [],
      visitors: [],
      custom: [],
    };
    const allUsers = new Map(); // Deduplicate users across groups
    const groupDetails = [];

    for (const group of siteGroups) {
      const groupName = group.Title;
      const permissionLevel = this.getPermissionLevel(groupName);

      // Skip custom groups unless requested
      if (!this.includeAllGroups && !this.isStandardGroup(groupName)) {
        continue;
      }

      // Fetch members of this group
      let members = [];
      try {
        const membersResponse = await this.sharepoint.getSharePointSiteGroupMembers({
          $,
          siteWebUrl,
          groupId: group.Id,
        });
        members = (membersResponse.d?.results || []).map((user) => this.formatUser(user));
      } catch (e) {
        console.error(`Failed to fetch members for group ${groupName}:`, e.message);
      }

      // Track group details
      groupDetails.push({
        id: group.Id,
        name: groupName,
        permissionLevel,
        description: group.Description,
        memberCount: members.length,
        members,
      });

      // Add to permission level buckets and dedupe
      for (const member of members) {
        // Track which groups each user belongs to
        if (!allUsers.has(member.id)) {
          allUsers.set(member.id, {
            ...member,
            groups: [],
            permissionLevels: new Set(),
          });
        }
        const existingUser = allUsers.get(member.id);
        existingUser.groups.push(groupName);
        existingUser.permissionLevels.add(permissionLevel);

        // Add to appropriate bucket
        const bucket = permissionLevel === "owner"
          ? "owners"
          : permissionLevel === "member"
            ? "members"
            : permissionLevel === "visitor"
              ? "visitors"
              : "custom";

        if (!membersByPermissionLevel[bucket].find((u) => u.id === member.id)) {
          membersByPermissionLevel[bucket].push(member);
        }
      }
    }

    // Create flat list of all unique users with their highest permission
    const allUniqueUsers = Array.from(allUsers.values()).map((user) => {
      // Determine highest permission level
      let highestPermission = "visitor";
      if (user.permissionLevels.has("owner")) {
        highestPermission = "owner";
      } else if (user.permissionLevels.has("member")) {
        highestPermission = "member";
      } else if (user.permissionLevels.has("custom")) {
        highestPermission = "custom";
      }

      return {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        loginName: user.loginName,
        highestPermission,
        groups: user.groups,
      };
    });

    // Sort by permission level (owners first, then members, then visitors)
    const permissionOrder = {
      owner: 0,
      member: 1,
      custom: 2,
      visitor: 3,
    };
    allUniqueUsers.sort((a, b) =>
      permissionOrder[a.highestPermission] - permissionOrder[b.highestPermission]);

    const totalUsers = allUniqueUsers.length;
    $.export("$summary", `Found ${totalUsers} user(s) with access to "${site.displayName}"`);

    return {
      site: {
        id: this.siteId,
        displayName: site.displayName,
        webUrl: siteWebUrl,
      },
      summary: {
        totalUsers,
        owners: membersByPermissionLevel.owners.length,
        members: membersByPermissionLevel.members.length,
        visitors: membersByPermissionLevel.visitors.length,
        customGroupUsers: membersByPermissionLevel.custom.length,
      },
      users: allUniqueUsers,
      byPermissionLevel: membersByPermissionLevel,
      groups: groupDetails,
    };
  },
};
