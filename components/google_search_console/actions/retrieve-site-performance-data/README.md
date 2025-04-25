# Google Search Console – Site Performance (Analytics) Action

This action queries **search performance data** for a verified website using the [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics/query). It allows you to extract insights like:

- Top search queries  
- Click-through rates  
- Page impressions  
- Device types, countries, and more  

---

## Use Cases

- Automate SEO reporting  
- Analyze organic search trends  
- Filter and break down traffic by dimensions (e.g. query, device, country)  

---

## Internals

- Supports all relevant props from the [Search Analytics Query API](https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics/query)  
- Trims and validates all input props  
- Accepts optional `dimensionFilterGroups` either as an object or JSON string  
- Automatically builds the POST request body using `propsMeta` metadata  
- Returns the raw Search Console API response for full access to metrics  
- Accumulates and displays warnings for non-blocking input issues  

---

## Auth

Requires OAuth 2.0 with the following scope: `https://www.googleapis.com/auth/webmasters.readonly`


## Endpoint
`https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`


## 📦 Example Request Payload



```json
{

  "siteUrl": "https://falc1.com/page",

  "startDate": "2025-12-22",

  "endDate": "2025-12-31",

  "dimensions": ["query", "page", "country", "device"],

  "searchType": "web",

  "rowLimit": 10,

  "startRow": 0,

  "aggregationType": "auto",

  "dataState": "final",

  "dimensionFilterGroups": [
    {

      "groupType": "and",

      "filters": [
        {

          "dimension": "query",

          "operator": "contains",

          "expression": "example"
        },
        {
          "dimension": "country",

          "operator": "equals",

          "expression": "USA"
        }
      ]
    }
  ]
}
```

### Field Descriptions

 **siteUrl**: The site you want to query data for. Must be verified in your Google Search Console account.
 **startDate**: The start date of the reporting period (inclusive), in YYYY-MM-DD format.
 **endDate**: The end date of the reporting period (inclusive), in YYYY-MM-DD format.
 **dimensions**: The dimensions you want to break down the data by. Valid values: "query", "page", "country", "device", "searchAppearance", "date". Order matters — it affects how rows are grouped in the response.
 **searchType**: The type of search data to include. Valid values: "web", "image", "video", "news", "googleNews", "discover"
 **rowLimit**: Maximum number of rows to return (1–25,000)
 **startRow**: Optional: Skips the first N rows — used for pagination.
 **aggregationType**: Optional: How to group data. "auto" = Google's default grouping. "byPage" = Group by page (useful for getting per-page breakdowns).
 **dataState**: Optional: Data freshness filter. "final" = Only finalized data (more accurate). "all" = Includes fresh but possibly incomplete data.
 **dimensionFilterGroups**: Optional filter group(s) to restrict which rows are returned. Each group applies logical AND/OR across its filters.
   **groupType**: Logical grouping operator for the filters inside this group. "and" = all filters must match, "or" = any filter can match
   **filters**: List of individual filters to apply within the group
      **dimension**: Which dimension to filter by (must match a dimension in your request)
      **operator**: Filter operator — e.g., "equals", "contains", "notEquals", etc.
      **expression**: Value to match against