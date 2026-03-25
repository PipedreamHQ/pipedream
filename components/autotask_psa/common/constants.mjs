/** Shared prop description for Autotask POST /query body */
export const QUERY_PROP_DESCRIPTION =
  "Query object sent to Autotask `query`: use `MaxRecords`, `IncludeFields`, and `filter` (array of filter objects). " +
  "A query is required; an empty `filter` array returns no records. " +
  "Operators include eq, noteq, gt, gte, lt, lte, beginsWith, endsWith, contains, exist, notExist, in, notIn. " +
  "Example: `{\"MaxRecords\":100,\"IncludeFields\":[],\"filter\":[{\"field\":\"companyName\",\"op\":\"eq\",\"value\":\"Acme Corp\"}]}`. " +
  "[Making basic query calls](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm)";
