# BigQuery New Row Source

## Introduction

This source emits a new event each time a new row is added to a specific table
in BigQuery. It achieves so by periodically scanning such table for rows with a
higher index than previous records, hence it is necessary for the target table
to be indexed by a monotonically increasing column, or at least have a column
with such a property so that this component can detect new rows.

## Prerequisites

To set up your BigQuery credentials, go to the [Pipedream
Accounts](https://pipedream.com/accounts) page, and click on the **CONNECT AN
APP** button. Look for the **Google Cloud** app, and click on it.

The form contains a field called `key_json`, which should be filled with the
contents of a JSON key file of a [GCP service
account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

This event source will try to authenticate against Google Cloud using the
provided credentials, and with the following scopes, so make sure that the
service account has enough permissions:

- `https://www.googleapis.com/auth/bigquery`
- `https://www.googleapis.com/auth/drive.readonly`

Please note that if the targeted data source from BigQuery requires special
permissions, you must grant those permissions to the service account prior to
creating this event source. For example, if the data source of the targeted
BigQuery table is based from a Google Sheets spreadsheet, you must share that
spreadsheet with the service account with at least **View** access.

After filling in every field required in the form, and click on **SAVE**.

## Usage

1. Visit the [source
   page](https://pipedream.com/sources/new?key=bigquery-new-row)
2. Select the Google Cloud account to use (see [the previous
   section](#prerequisites) for information on how to set it up)
3. You'll be prompted to enter the time interval for the executions. The default
   value is 15 minutes.
4. Select the _event size_ (i.e. the amount of records to be sent in a single
   event). Select 1 (which is also the default value) if you prefer to send one
   event per new row.
5. Select the target BigQuery table to scan
6. Select the column in the target table to use as a unique key (see [the next
   section](#technical-details) for more information)

## Technical Details

As mentioned in the [introduction](#introduction), this event source makes use
of an index in the target table (which is customizable by the user) to scan and
detect new rows in periodic intervals.

During each execution, a SQL query similar to the following is executed, and the
resulting rows are streamed and emitted as events by Pipedream:

```sql
SELECT * FROM `YourTable` WHERE `ID` > LastId
```

`YourTable` and `ID` are customizable and provided by the user when setting up
the event source. `LastId` on the other hand is a variable that the event source
caches after each execution to keep track of the last scanned record. **Note
that if `ID` is not orderable and monotonically increasing then new records
might not be detected by this component.**
