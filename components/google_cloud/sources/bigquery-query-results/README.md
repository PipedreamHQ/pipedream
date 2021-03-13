# BigQuery Query Results Source

## Introduction

This source emits new events with the results of an arbitrary SQL query provided
by the user. It achieves so by periodically executing such query.

Please note that the event source will **blindly** execute the query in an
agnostic manner. This means that if the result of the query contains
previously-seen records, those records will be re-sent in the event payload. It
is the user's responsibility to customize the SQL query so that the amount of
emitted events is bounded.

Users can also provide a field/column name to use for de-duplication purposes.

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
spreadsheet with the service account, and grant at least **View** access.

After filling in every field required in the form, and click on **SAVE**.

## Usage

1. Visit the [source
   page](https://pipedream.com/sources/new?key=google_cloud-bigquery-query-results)
2. Select the BigQuery account to use (see [the previous
   section](#prerequisites) for information on how to set it up)
3. You'll be prompted to enter the time interval for the executions. The default
   value is 15 minutes.
4. Select the _event size_ (i.e. the amount of records to be sent in a single
   event). Select 1 (which is also the default value) if you prefer to send one
   event per new row
5. Enter the _SQL query_ to be executed at each iteration/execution of this
   event source
6. Optionally, select the _de-duplication key_ to use for the de-duplication
   logic (see [the following section](#de-duplication-details) section for more
   information)

## De-duplication Details

If users provide a valid deduplication key during setup, the event source will
use that key to make sure emitting events containing the same result rows is
minimised.

### One Event per Row

This is the case when users set the **Event Size** value to 1. In such cases,
the column named after the deduplication key that the user provided is directly
used to detect duplicates.

As an example, let's assume the user provides `ID` as a
de-duplication field, and it also provided the following query:

```sql
SELECT * FROM MyTable
```

The results for such query could be:

```csv
ID    FIRSTNAME   LASTNAME
101   TestUser    One
102   TestUser    Two
103   TestUser    Three
```

The event source would issue 3 events with ID's set to `101`, `102` and `103`,
respectively. Even though results for subsequent executions of the query will
include the records above, the de-duplication logic of the event source will not
emit events for such records again.

### One Event with Multiple Rows

This is the case when users set the **Event Size** value to something higher
than 1. In such cases, the column named after the deduplication key that the
user provided is used to detect duplicates, but not directly.

When **Event Size** is set to a value greater than 1, the event source combines
the rows of the query results in chunks of size up to the the specified event
size. Before emitting the event, the event source computes a SHA1 hash using the
value of the selected deduplication key contained in all the combined rows
belonging to the same event and uses that hash as the event ID, which is then
used for event deduplication. **Note that this is a best effort approach since
the final computed ID depends on the specific combination of rows in each event,
which is not guaranteed to be constant.**

Using the example from the previous section, and assuming the event size is set
to 2, the event source will emit 2 events with the data split like this:

**Event 1:**

```csv
ID    FIRSTNAME   LASTNAME
101   TestUser    One
102   TestUser    Two
```

**Event 2:**

```csv
103   TestUser    Three
```

Taking the first event as an example, the ID of the event will be computed via a
SHA1 hash of the values `101` and `102`, and use its base 64 digest as the final
event ID. For this example, the final event ID will be
`2PCorOl6ZyJX9EEEk6y07RxCsk0=`. As pointed out before, this ID will be **unique
only for this combination of rows**. If for example the order of the rows
changes, the SHA1 hash will also change.
