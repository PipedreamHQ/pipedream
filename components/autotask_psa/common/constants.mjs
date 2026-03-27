/**
 * Prismatic-aligned description for the JSON POST body to
 * `/V1.0/{Entity}/query` and `/V1.0/{Entity}/query/count`.
 */
export const FILTER_PROP_DESCRIPTION =
  "JSON body: `filter` (array of conditions); optional `IncludeFields`, " +
  "`MaxRecords`, etc. A filter is required; omitting it can return a 500 error. " +
  "An empty `filter` array returns no records. " +
  "Operators: eq, noteq, gt, gte, lt, lte, beginsWith, endsWith, contains, " +
  "exist, notExist, in, notIn; use `and`/`or` with nested `items` to group. " +
  "For UDFs add `\"udf\": true` on the filter object (one UDF per request). " +
  "Include `Id` in IncludeFields when paginating past 500 rows. " +
  "Example: " +
  "`{\"MaxRecords\":100,\"IncludeFields\":[],\"filter\":[" +
  "{\"field\":\"companyName\",\"op\":\"eq\",\"value\":\"Acme Corp\"}]}`. " +
  "[Basic queries]" +
  "(https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/" +
  "REST_Basic_Query_Calls.htm), " +
  "[Advanced features]" +
  "(https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/" +
  "REST_Advanced_Query_Features.htm), " +
  "[REST API home]" +
  "(https://www.autotask.net/help/developerhelp/Content/APIs/REST/" +
  "REST_API_Home.htm)";
