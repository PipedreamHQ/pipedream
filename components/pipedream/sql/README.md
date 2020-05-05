# Pipedream Scheduled SQL Source

This source runs a SQL query against the [Pipedream SQL Service](https://docs.pipedream.com/destinations/sql/) on a schedule, emitting the query results to any listeners for further processing.

You can use this source to:

- Produce scheduled reports: aggregate the results of some table via SQL, and send them to Slack, for example.
- Check for anomalies in a data set: run a query that compares the count of events seen in the last hour against the historical average, notifying you when you observe an anomaly.
- Any place where you want to drive a workflow using a SQL query!

## Pre-requisites

First, you must have sent some data to the Pipedream SQL Service. Visit [https://pipedream.com/sql](https://pipedream.com/sql) or [see the docs](https://docs.pipedream.com/destinations/sql/#adding-a-sql-destination) to learn how.

## Usage

[Click here to create a Scheduled SQL Source]

### Props

This source accepts three props:

- **SQL Query** : The query you'd like to test
- **Result Type** : Specifies how you want the query results formatted in the emitted event. One of `array`, `object`, or `csv`.
- **Emit each record as its own event** : If `true`, each record in your results set is [emitted](/COMPONENT-API.md#thisemit) as its own event. Defaults to `false`, emitting results as a single event (based on the result type specified in the **Result Types** prop). See the [Result Format section](#result-format) for example output.

### Result Format

Both the **Result Type** and **Emit each record as its own event** props determine the final shape of your results. Typically, the default configuration — emit results as a single event, with an array of records in the results — will work for most use cases. This section describes that default output and the output for other combinations of these properties.

## `array` of results, single event

## `array` of results, with each row emitted as its own event

## `object` of results, single event

## `object` of results, with each row emitted as its own event

## `csv` results

## Limits

The Scheduled SQL Source is subject to the same [query limits](https://docs.pipedream.com/destinations/sql/#query-limits) as the Pipedream SQL Service.
