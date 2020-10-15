# Pipedream Scheduled SQL Source

This source runs a SQL query against the [Pipedream SQL Service](https://docs.pipedream.com/destinations/sql/) on a schedule, emitting the query results to any listeners for further processing.

You can use this source to:

- Produce scheduled reports: [aggregate the results of some table via SQL, and send them to Slack](https://pipedream.com/@dylburger/run-a-sql-query-against-the-pipedream-sql-service-send-results-to-slack-p_MOCrOV/edit), for example.
- Check for anomalies in a data set: run a query that compares the count of events seen in the last hour against the historical average, notifying you when you observe an anomaly.
- Any place where you want to drive a workflow using a SQL query!

This source is meant to operate on relatively small (< 1MB) results. See the [limits](#limits) section or [reach out](https://docs.pipedream.com/support/) to the Pipedream team with any questions.

## Pre-requisites

First, you must have sent some data to the Pipedream SQL Service. Visit [https://pipedream.com/sql](https://pipedream.com/sql) or [see the docs](https://docs.pipedream.com/destinations/sql/#adding-a-sql-destination) to learn how.

## Usage

[Click here to create a Scheduled SQL Source](https://pipedream.com/sources?action=create&url=https%3A%2F%2Fgithub.com%2FPipedreamHQ%2Fpipedream%2Fblob%2Fmaster%2Fcomponents%2Fpipedream%2Fsql%2Fsql.js&app=pipedream). You'll be asked to select a schedule (by default, this source runs once a day at 00:00 UTC) and configure the props below.

### Props

This source accepts three props:

- **SQL Query** : The query you'd like to run
- **Result Type** (_optional_): Specifies how you want the query results formatted in the emitted event. One of `array`, `object`, or `csv`. **Defaults to `array`**.
- **Emit each record as its own event** (_optional_): If `true`, each record in your results set is [emitted](/COMPONENT-API.md#emit) as its own event. **Defaults to `false`**, emitting results as a single event (based on the result type specified in the **Result Types** prop). See the [Result Format section](#result-format) for example output.

**Emit each record as its own event** only applies to a **Result Type** of `array`. If **Result Type** is set to `object` or `csv`, the value of **Emit each record as its own event** is ignored and assumed to be `false` — the source will always emit one event for each query.

### Result Format

All events contain the following keys:

- `query`: your SQL query
- `results.columnInfo`: an array of objects, one for each column in the results.
- `results.queryExecutionId`: a unique identifier for each query execution.
- `results.csvLocation`: a URL that points to a CSV of query results. This URL requires you authenticate with your Pipedream API as a `Bearer` token — [see the SQL API docs](https://docs.pipedream.com/destinations/sql/#running-sql-queries-via-api).

Both the **Result Type** and **Emit each record as its own event** props determine the final shape of your `results`. Typically, the default configuration — emit a single event, with the query results in an array — will work for most use cases. This lets you run a Pipedream workflow or other code on the full query output.

But you can emit each record as its own event, running a workflow on every record. Or you can output an object of results if it's easier for your workflow to operate on. This section describes the shape of the default output and the output for other combinations of these properties.

In the examples below, assume this query:

```sql
SELECT status_code, COUNT(*) AS count
FROM http_requests
GROUP BY 1
```

returns these results:

| `status_code` | `count` |
| ------------- | :-----: |
| `200`         |   400   |
| `202`         |   300   |
| `404`         |   200   |
| `500`         |   100   |

#### `array` of results, single event

The default output. Every time your query runs, the source emits an event of the following shape:

```json
{
  "query": "SELECT status_code, COUNT(*) AS count FROM http_requests GROUP BY 1",
  "results": {
    "columnInfo": [
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "status_code",
        "Label": "status_code",
        "Type": "bigint",
        "Precision": 17,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      },
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "count",
        "Label": "count",
        "Type": "bigint",
        "Precision": 19,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      }
    ],
    "queryExecutionId": "6cd06536-56f7-4c5d-a3e1-721b9e3ac614",
    "csvLocation": "https://rt.pipedream.com/sql/csv/6cd06536-56f7-4c5d-a3e1-721b9e3ac614.csv",
    "results": [
      ["200", "400"],
      ["202", "300"],
      ["404", "200"],
      ["500", "100"]
    ]
  }
}
```

#### `array` of results, with each row emitted as its own event

When **Emit each record as its own event** is set to `true`, the source will emit each record as its own distinct event. In the example above, 4 records are returned from the query, so the source emits 4 events, each of which has the following shape:

```json
{
  "query": "SELECT status_code, COUNT(*) AS count FROM http_requests GROUP BY 1",
  "results": {
    "columnInfo": [
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "status_code",
        "Label": "status_code",
        "Type": "bigint",
        "Precision": 17,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      },
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "count",
        "Label": "count",
        "Type": "bigint",
        "Precision": 19,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      }
    ],
    "queryExecutionId": "310134a3-50f6-437a-939e-ec328de510b1",
    "csvLocation": "https://rt.pipedream.com/sql/csv/310134a3-50f6-437a-939e-ec328de510b1.csv",
    "record": { "status_code": "200", "count": "400" }
  }
}
```

**This is a powerful feature**. It allows you to compute results by group using SQL, then run a Pipedream workflow on every group (record) in the results.

#### `object` of results

```json
{
  "query": "SELECT status_code, COUNT(*) AS count FROM csp_violation_data GROUP BY 1",
  "results": {
    "columnInfo": [
      {
        "Type": "bigint",
        "Label": "status_code",
        "Scale": 0,
        "CaseSensitive": false,
        "SchemaName": "",
        "Nullable": "UNKNOWN",
        "TableName": "",
        "Precision": 17,
        "CatalogName": "hive",
        "Name": "status_code"
      },
      {
        "Type": "bigint",
        "Label": "count",
        "Scale": 0,
        "CaseSensitive": false,
        "SchemaName": "",
        "Nullable": "UNKNOWN",
        "TableName": "",
        "Precision": 19,
        "CatalogName": "hive",
        "Name": "count"
      }
    ],
    "csvLocation": "https://rt.pipedream.com/sql/csv/72ead1c3-9193-4879-807a-bdd6cf3bf61d.csv",
    "queryExecutionId": "72ead1c3-9193-4879-807a-bdd6cf3bf61d",
    "results": [
      { "status_code": "200", "count": "400" },
      { "status_code": "202", "count": "300" },
      { "status_code": "404", "count": "200" },
      { "status_code": "500", "count": "100" }
    ]
  }
}
```

#### `csv` results

Setting **Result Type** to `csv` allows you to output results directly as a CSV string:

```json
{
  "query": "SELECT status_code, COUNT(*) AS count FROM csp_violation_data GROUP BY 1",
  "results": {
    "columnInfo": [
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "status_code",
        "Label": "status_code",
        "Type": "bigint",
        "Precision": 17,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      },
      {
        "CatalogName": "hive",
        "SchemaName": "",
        "TableName": "",
        "Name": "count",
        "Label": "count",
        "Type": "bigint",
        "Precision": 19,
        "Scale": 0,
        "Nullable": "UNKNOWN",
        "CaseSensitive": false
      }
    ],
    "queryExecutionId": "fed2cbbf-e723-4f2f-9f1d-4036362945cc",
    "csvLocation": "https://rt.pipedream.com/sql/csv/fed2cbbf-e723-4f2f-9f1d-4036362945cc.csv",
    "results": "status_code,count\n\"200\",400\n\"202\",300\n\"404\",200\n\"500\",100\n"
  }
}
```

## Limits

The Scheduled SQL Source is subject to stricter limits than the [query limits](https://docs.pipedream.com/destinations/sql/#query-limits) for the Pipedream SQL Service:

- Query results should be limited to **less than 512KB**
- Queries are currently limited to a runtime of 60 seconds.
