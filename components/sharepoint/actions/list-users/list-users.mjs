import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-users",
  name: "List Users",
  description: "List users from the Microsoft 365 tenant, optionally filtered by group membership. Requires admin consent for User.Read.All scope (and Group.Read.All if filtering by groups). [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    groupIds: {
      type: "string[]",
      label: "Filter by Groups",
      description: "Only return users who are members of these groups. Leave empty to list all users in the tenant.",
      optional: true,
      async options({ prevContext }) {
        const params = {
          $select: "id,displayName",
          $orderby: "displayName",
          $top: 50,
        };

        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {
            params,
          };

        const response = await this.sharepoint.listGroups(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Filter users by display name or email. Uses `startswith` filter on displayName.",
      optional: true,
    },
    includeGuests: {
      type: "boolean",
      label: "Include Guest Users",
      description: "Include external/guest users in the results",
      optional: true,
      default: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of users to return. Use 0 for unlimited.",
      optional: true,
      default: 100,
    },
  },
  methods: {
    formatUser(user, groupInfo = null) {
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.mail || user.userPrincipalName,
        userPrincipalName: user.userPrincipalName,
        jobTitle: user.jobTitle,
        department: user.department,
        userType: user.userType,
        accountEnabled: user.accountEnabled,
        createdDateTime: user.createdDateTime,
        ...(groupInfo && {
          groups: groupInfo,
        }),
      };
    },
  },
  async run({ $ }) {
    const maxResults = this.maxResults || 0;
    const groupIds = this.groupIds || [];

    // If filtering by groups, get members from each group
    if (groupIds.length > 0) {
      const userMap = new Map(); // Use map to deduplicate by user ID
      const userGroups = new Map(); // Track which groups each user belongs to

      // First, get group names for better output
      const groupNames = new Map();
      for (const groupId of groupIds) {
        try {
          const groupResponse = await this.sharepoint._makeRequest({
            $,
            path: `/groups/${groupId}`,
            params: {
              $select: "id,displayName",
            },
          });
          groupNames.set(groupId, groupResponse.displayName);
        } catch (e) {
          groupNames.set(groupId, groupId); // Fall back to ID if can't get name
        }
      }

      // Get members from each group
      for (const groupId of groupIds) {
        let nextLink = null;

        do {
          const response = nextLink
            ? await this.sharepoint._makeRequest({
              $,
              url: nextLink,
            })
            : await this.sharepoint.listGroupMembers({
              $,
              groupId,
              params: {
                $select: "id,displayName,mail,userPrincipalName,jobTitle,department,userType,accountEnabled,createdDateTime",
                $top: 999,
              },
            });

          for (const member of response.value || []) {
            // Only include users (not nested groups or other object types)
            if (member["@odata.type"] !== "#microsoft.graph.user") {
              continue;
            }

            // Filter out guests if requested
            if (!this.includeGuests && member.userType === "Guest") {
              continue;
            }

            // Apply search filter if specified
            if (this.searchQuery) {
              const query = this.searchQuery.toLowerCase();
              const matchesName = member.displayName?.toLowerCase().startsWith(query);
              const matchesEmail = member.mail?.toLowerCase().startsWith(query);
              if (!matchesName && !matchesEmail) {
                continue;
              }
            }

            // Track group membership
            if (!userGroups.has(member.id)) {
              userGroups.set(member.id, []);
            }
            userGroups.get(member.id).push({
              id: groupId,
              displayName: groupNames.get(groupId),
            });

            // Add to map (deduplicates automatically)
            if (!userMap.has(member.id)) {
              userMap.set(member.id, member);
            }

            // Check max results
            if (maxResults > 0 && userMap.size >= maxResults) {
              break;
            }
          }

          nextLink = response["@odata.nextLink"];

          if (maxResults > 0 && userMap.size >= maxResults) {
            break;
          }
        } while (nextLink);

        if (maxResults > 0 && userMap.size >= maxResults) {
          break;
        }
      }

      // Format results with group info
      const users = Array.from(userMap.values()).map((user) =>
        this.formatUser(user, userGroups.get(user.id)));

      // Sort by display name
      users.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));

      const groupNamesList = groupIds.map((id) => groupNames.get(id)).join(", ");
      $.export("$summary", `Found ${users.length} user(s) in group(s): ${groupNamesList}`);

      return {
        users,
        count: users.length,
        filteredByGroups: groupIds.map((id) => ({
          id,
          displayName: groupNames.get(id),
        })),
      };
    }

    // No group filter - list all users from tenant
    const users = [];
    let nextLink = null;

    // Build filter string
    const filters = [];
    if (this.searchQuery) {
      // Escape single quotes for OData (replace ' with '')
      const sanitizedQuery = this.searchQuery.replace(/'/g, "''");
      filters.push(`startswith(displayName,'${sanitizedQuery}')`);
    }
    if (!this.includeGuests) {
      filters.push("userType eq 'Member'");
    }

    const params = {
      $select: "id,displayName,mail,userPrincipalName,jobTitle,department,userType,accountEnabled,createdDateTime",
      $orderby: "displayName",
      $top: Math.min(maxResults || 999, 999),
    };

    if (filters.length > 0) {
      params.$filter = filters.join(" and ");
    }

    do {
      const response = nextLink
        ? await this.sharepoint._makeRequest({
          $,
          url: nextLink,
        })
        : await this.sharepoint.listUsers({
          $,
          params,
        });

      for (const user of response.value || []) {
        users.push(this.formatUser(user));

        if (maxResults > 0 && users.length >= maxResults) {
          break;
        }
      }

      nextLink = response["@odata.nextLink"];

      if (maxResults > 0 && users.length >= maxResults) {
        break;
      }
    } while (nextLink);

    $.export("$summary", `Found ${users.length} user(s)`);

    return {
      users,
      count: users.length,
    };
  },
};
