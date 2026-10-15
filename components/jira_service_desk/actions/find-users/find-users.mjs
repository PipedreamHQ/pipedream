import app from "../../jira_service_desk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jira_service_desk-find-users",
  name: "Find Users",
  description:
    "Finds any active user on an Atlassian site by name or email address and returns the `accountId` of each match."
    + " **Pick this tool when the person does not have to be a customer of one particular service desk**, i.e. to fill `requestParticipants` on **Create Request** with an approver, manager, watcher, or agent, or when the user names somebody but no service desk is known yet."
    + " Natural-language cues: \"add my manager Dana as a participant\", \"cc the security lead on this ticket\", \"loop in john@acme.com\", \"what is the account ID for Jean?\"."
    + " Pick **Find Service Desk Customers** instead when you already know the service desk and the person is the one the ticket is being raised for (`raiseOnBehalfOf`). That tool is more precise, confirms the person can actually raise a request on that desk, and excludes bots."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Worked example: for \"open a laptop request and add Dana Lee as a participant\", call this with Query `Dana Lee`, read `accountId` `5b10a2844c20165700ede21g` off the match whose `accountType` is `atlassian`, then pass `[\"5b10a2844c20165700ede21g\"]` as `requestParticipants` on **Create Request**."
    + " Most users on a Jira site are bots, not people. Integrations come back as ordinary matches carrying `accountType` `app`, so read `accountType` and use only `atlassian` accounts as `raiseOnBehalfOf` or `requestParticipants`."
    + " Query is matched against `displayName` and `emailAddress`, and matches more than just the start of them. Pass a full name or a full email address to keep the result set tight."
    + " Results are paginated automatically up to `maxResults`."
    + " Returns `{ users, truncated }`. `truncated` is `true` when the result set may be incomplete, either because more matches remained unfetched or because collection stopped at Atlassian's 1000-match limit, which looks the same whether or not further matches exist. Once you have 1000 matches, narrow the query rather than raising `maxResults`, which cannot go higher."
    + " `accountId` is the only field guaranteed present: Atlassian's profile visibility rules hide `emailAddress` on users who have not made it public, so match on `displayName` and never require an email to be returned."
    + " An empty `users` list means either nobody matched or the connected account lacks the \"Browse users and groups\" global permission, which Atlassian reports as zero results rather than as an error."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-user-search/#api-rest-api-3-user-search-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      description: "Maximum number of users to return across all pages (1-1000).",
    },
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      query,
      maxResults,
    } = this;

    const {
      results, hasMore,
    } = await app.searchUsers({
      $,
      cloudId,
      query,
      maxResults,
    });

    // Dropping the four avatar URLs per user the raw payload carries.
    const users = results.map(({
      accountId, displayName, emailAddress, active, accountType,
    }) => ({
      accountId,
      displayName,
      emailAddress,
      active,
      accountType,
    }));

    // At the offset ceiling raising Max Results cannot help, so say so instead.
    const atSiteLimit = users.length >= constants.USER_SEARCH_MAX_OFFSET;
    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"} on the site matching "${query}"${hasMore
      ? atSiteLimit
        ? ", stopped at Atlassian's 1000-match limit; narrow the query to check for more"
        : ", truncated at Max Results; raise it to fetch more"
      : ""}`);
    return {
      users,
      truncated: hasMore,
    };
  },
};
