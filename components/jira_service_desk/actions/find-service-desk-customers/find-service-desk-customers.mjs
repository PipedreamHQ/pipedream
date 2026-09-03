import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-find-service-desk-customers",
  name: "Find Service Desk Customers",
  description:
    "Finds the customers of one service desk by name or email address and returns the `accountId` of each match."
    + " **Pick this tool when the person is the one the ticket is being raised for on a service desk you can identify**, i.e. to fill `raiseOnBehalfOf` on **Create Request**."
    + " Natural-language cues: \"raise a ticket for Jean on the IT desk\", \"open a request on behalf of john@acme.com\", \"file this for my colleague Dana\", \"submit a hardware request for the new starter\"."
    + " Pick **Find Users** instead when the person does not have to be a customer of this desk, such as an approver, manager, or agent you are adding to `requestParticipants`, or when you cannot tell which service desk applies."
    + " Prefer this tool wherever both would work: it searches only this desk's customer list, so a match proves the person can actually raise a request here, and bot accounts are excluded (a site-wide search on a live site returned 17 users of which 16 were integrations)."
    + " Use **List Sites** for `cloudId` and **List Service Desks** for `serviceDeskId` first."
    + " Worked example: for \"open a laptop request for Joseph Wilson on the IT desk\", call this with Service Desk ID `1` and Query `Joseph Wilson`, read `accountId` `5b10a2844c20165700ede21g` off the single match, then call **Create Request** with Service Desk ID `1` and that `accountId` as `raiseOnBehalfOf`."
    + " Omit Query to list every customer of the desk, which answers \"who can raise requests on this desk?\"."
    + " Query is matched against `displayName` and `emailAddress`, and matches more than just the start of them. Pass a full name or a full email address to keep the result set tight."
    + " If nobody matches, the person may exist on the site without being a customer of this desk, retry with **Find Users**."
    + " Results are paginated automatically up to `maxResults`."
    + " Returns `{ users, truncated }`, where `truncated` is `true` when more matches remained unfetched."
    + " `accountId` is the only field guaranteed present: Atlassian's profile visibility rules hide `emailAddress` on users who have not made it public, so match on `displayName` and never require an email to be returned."
    + " An unknown or inaccessible Service Desk ID fails with a 404 rather than returning an empty list, so an empty list really does mean nobody matched."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-servicedesk/#api-rest-servicedeskapi-servicedesk-servicedeskid-customer-get)",
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
    serviceDeskId: {
      propDefinition: [
        app,
        "serviceDeskId",
      ],
      description: "The service desk whose customers to search, e.g. `1`. Run **List Service Desks** to map a project name or key to its ID. Use the same ID you will pass to **Create Request**, so the match is checked against the desk the ticket will actually be raised on.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Name or email address to search for, e.g. `Joseph Wilson` or `joseph@example.com`. Matched against `displayName` and `emailAddress`. Omit to list every customer of the desk.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      description: "Maximum number of customers to return across all pages (1-1000).",
    },
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      serviceDeskId,
      query,
      maxResults,
    } = this;

    const {
      results, hasMore,
    } = await app.searchServiceDeskCustomers({
      $,
      cloudId,
      serviceDeskId,
      query,
      maxResults,
    });

    // Dropping the avatar URLs and `_links` the raw payload carries.
    const users = results.map(({
      accountId, displayName, emailAddress, active,
    }) => ({
      accountId,
      displayName,
      emailAddress,
      active,
    }));

    $.export("$summary", `Found ${users.length} customer${users.length === 1
      ? ""
      : "s"} on service desk ${serviceDeskId}${query
      ? ` matching "${query}"`
      : ""}${hasMore
      ? ", truncated at Max Results; raise it to fetch more"
      : ""}`);
    return {
      users,
      truncated: hasMore,
    };
  },
};
