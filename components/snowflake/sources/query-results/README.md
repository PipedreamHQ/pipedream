# Snowflake Query Results Source

## Introduction

This source emits new events with the results of an arbitrary SQL query provided
by the user. It achieves so by periodically executing such query.

Please note that the event source will **blindly** execute the query in an
agnostic manner. This means that if the result of the query contains
previously-seen records, those records will be re-sent in the event payload. It
is the user's responsibility to customize the SQL query so that the amount of
emitted events is bounded.

Users can also provide a field/column name to use for de-duplication purposes.
**This is only applicable when the _Event Size_ prop is set to 1**. See the
[De-duplication Details](#de-duplication-details) section for more information.

## Prerequisites

To set up your Snowflake credentials, go to the [Pipedream
Accounts](https://pipedream.com/accounts) page, and click on the **CONNECT AN
APP** button. Look for the **Snowflake** app, and click on it. Fill in every
field required in the form, and click on **SAVE**.

## Usage

1. Visit the [source
   page](https://pipedream.com/sources/new?key=snowflake-query-results)
2. Select the Snowflake account to use (see [the previous
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

As an example, let's assume the user provides `ID` as a de-duplication field,
and it also provided the following query:

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
