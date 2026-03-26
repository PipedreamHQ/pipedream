import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-soql-query",
  name: "SOQL Query",
  description:
    "Execute a SOQL query against Salesforce. This is the **primary tool for querying Salesforce data** — use for all structured queries."
    + " For free-text search across multiple objects, use **Text Search** instead."
    + "\n\n"
    + "**When the user uses first-person language ('my', 'I', 'me'),** filter by `OwnerId` using the `userId` from **Get User Info**."
    + " Use **Describe Object** to discover field names and picklist values before querying non-obvious fields."
    + "\n\n"
    + "**SOQL syntax reference:**"
    + "\n- Basic: `SELECT Id, Name, Email FROM Contact WHERE AccountId = '001xxx'`"
    + "\n- Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE '%text%'`, `IN ('a','b')`, `NOT IN`"
    + "\n- Date literals: `TODAY`, `THIS_MONTH`, `LAST_N_DAYS:30`, `THIS_QUARTER`, `LAST_QUARTER`, `THIS_YEAR`"
    + "\n- NULL checks: `WHERE Email != null`"
    + "\n- Aggregates: `SELECT StageName, COUNT(Id) c, SUM(Amount) s FROM Opportunity GROUP BY StageName`"
    + "\n- Parent relationship: `SELECT Name, Account.Name FROM Contact`"
    + "\n- Child subquery: `SELECT Name, (SELECT Name FROM Contacts) FROM Account`"
    + "\n- Sorting/limits: `ORDER BY CreatedDate DESC LIMIT 10`"
    + "\n\n"
    + "**Always include `Id` in SELECT.** Include a clickable Salesforce link for every record"
    + " using the format `{instanceUrl}/lightning/r/{objectType}/{Id}/view` (get `instanceUrl` from **Get User Info**).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salesforce,
    query: {
      type: "string",
      label: "SOQL Query",
      description:
        "The SOQL query string to execute."
        + " Example: `SELECT Id, Name, Amount, StageName FROM Opportunity WHERE OwnerId = '005xxx' AND StageName = 'Closed Won' ORDER BY Amount DESC LIMIT 10`",
    },
  },
  async run({ $ }) {
    const baseUrl = this.salesforce._baseApiVersionUrl();
    let allRecords = [];
    let url = `${baseUrl}/query/?q=${encodeURIComponent(this.query)}`;
    let totalSize = 0;
    let requestCount = 0;
    const maxRequests = 5;

    while (url && requestCount < maxRequests) {
      const response = await this.salesforce._makeRequest({
        $,
        url,
      });

      if (requestCount === 0) {
        totalSize = response.totalSize;
      }

      allRecords = allRecords.concat(response.records || []);
      url = response.nextRecordsUrl
        ? `${this.salesforce._baseApiUrl()}${response.nextRecordsUrl}`
        : null;
      requestCount++;
    }

    const result = {
      totalSize,
      records: allRecords,
      hasMore: !!url,
    };

    $.export(
      "$summary",
      `Query returned ${totalSize} total record${totalSize === 1
        ? ""
        : "s"}, fetched ${allRecords.length}`,
    );

    return result;
  },
};
