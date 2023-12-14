# Data Stores

<VideoPlayer url="https://www.youtube.com/embed/0WMcAnDF7FA" title="Data store Basics" />

**Data stores** are Pipedream's built-in key-value store.

Data stores are useful for:

- Storing and retrieving data at a specific key
- Counting or summing values over time
- Retrieving JSON-serializable data across workflow executions
- Caching
- And any other case where you'd use a key-value store

You can connect to the same data store across workflows, so they're also great for sharing state across different services.

You can use pre-built, no-code actions to store, update, and clear data, or interact with data stores programmatically in [Node.js](/code/nodejs/using-data-stores/) or [Python](/code/python/using-data-stores/).

[[toc]]

## Using pre-built Data Store actions

Pipedream provides several pre-built actions to set, get, delete, and perform other operations with data stores.

### Inserting data

To insert data into a data store:

1. Add a new step to your workflow.
2. Search for the **Data Stores** app and select it.
3. Select the **Add or update a single record** pre-built action.

![Insert a single row into a data store](https://res.cloudinary.com/pipedreamin/image/upload/v1648060286/docs/components/CleanShot_2022-03-23_at_14.31.05_2x_swrdrh.png)

Configure the action:

1. **Select or create a Data Store** — create a new data store or choose an existing data store.
2. **Key** - the unique ID for this data that you'll use for lookup later
3. **Value** - The data to store at the specified `key`

![Configure the action](https://res.cloudinary.com/pipedreamin/image/upload/v1648063057/docs/components/CleanShot_2022-03-23_at_15.17.30_2x_snunyz.png)

For example, to store the timestamp when the workflow was initially triggered, set the **Key** to **Triggered At** and the **Value** to <code v-pre>{{steps.trigger.context.ts}}</code>.

The **Key** must evaluate to a string. You can pass a static string, reference [exports](/workflows/steps/#step-exports) from a previous step, or use [any valid expression](/workflows/steps/using-props/#entering-expressions).

![Workflow trigger example](https://res.cloudinary.com/pipedreamin/image/upload/v1649270704/docs/components/add_update_record_action_eh7dpz.png)

:::tip

Need to store multiple records in one action? Use the **Add or update multiple records** action instead.

:::

### Retrieving Data

The **Get record** action will retrieve the latest value of a data point in one of your data stores.

1. Add a new step to your workflow.
2. Search for the **Data Stores** app and select it.
3. Select the **Add or update a single record** pre-built action.

![Create a get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648062096/docs/components/CleanShot_2022-03-23_at_14.53.54_2x_aqpwx2.png)

Configure the action:

1. **Select or create a Data Store** — create a new data store or choose an existing data store.
2. **Key** - the unique ID for this data that you'll use for lookup later
3. **Create new record if key is not found** - if the specified key isn't found, you can create a new record
4. **Value** - The data to store at the specified `key`

![Get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648853992/docs/components/data_stores_get_record_yqazfk.png)

### Deleting Data

To delete a single record from your data store, use the **Delete a single record** action in a step:

![Select the delete record step](https://res.cloudinary.com/pipedreamin/image/upload/v1648064099/docs/components/CleanShot_2022-03-23_at_15.34.44_2x_pk9idz.png)

Then configure the action:

1. **Select a Data Store** - select the data store that contains the record to be deleted
2. **Key** - the key that identifies the individual record

For example, you can delete the data at the **Triggered At** key that we've created in the steps above:

![Delete a record example](https://res.cloudinary.com/pipedreamin/image/upload/v1648064157/docs/components/CleanShot_2022-03-23_at_15.35.48_2x_ay1bbw.png)

Deleting a record does not delete the entire data store. [To delete an entire data store, use the Pipedream Data Stores Dashboard](#deleting-data-stores).

## Managing data stores

You can view the contents of your data stores at any time in the [Pipedream Data Stores dashboard](https://pipedream.com/data-stores/). You can also add, edit, or delete data store records manually from this view.

### Editing data store values manually

1. Select the data store
2. Click the pencil icon on the far right of the record you want to edit. This will open a text box that will allow you to edit the contents of the value. When you're finished with your edits, save by clicking the checkmark icon.

![Editing a data store's value manually](https://res.cloudinary.com/pipedreamin/image/upload/v1648063518/docs/components/CleanShot_2022-03-23_at_15.24.49_err0nt.gif)

### Deleting data stores

You can delete a data store from this dashboard as well. On the far right in the data store row, click the trash can icon.

![Delete a Data Store](https://res.cloudinary.com/pipedreamin/image/upload/v1648063753/docs/components/CleanShot_2022-03-23_at_15.29.00_qtvdcz.gif)

**Deleting a data store is irreversible**.

::: warning
If the **Delete** option is greyed out and unclickable, you have workflows using the data store in a step. Click the **>** to the left of the data store's name to expand the linked workflows.

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1702248767/docs/Screenshot_2023-12-10_at_2.52.21_PM_tw2qwo.png" width="600px" />
</div>

Then remove the data store from any linked steps.

:::

## Using data stores in code steps

Refer to the [Node.js](/code/nodejs/using-data-stores/) and [Python](/code/python/using-data-stores/) data store docs to learn how to use data stores in code steps. You can get, set, delete and perform any other data store operations in code. You cannot use data stores in [Bash](/code/bash/) or [Go](/code/go/) code steps.

## Compression

Data saved in data stores is [Brotli-compressed](https://github.com/google/brotli), minimizing storage. The total compression ratio depends on the data being compressed. To test this on your own data, run it through a package that supports Brotli compression and measure the size of the data before and after.

## Data store limits

Depending on your plan, Pipedream sets limits on:

1. The total number of data stores
2. The total number of keys across all data stores
3. The total storage used across all data stores, [after compression](#compression)

You'll find your workspace's limits in the **Data Stores** section of usage dashboard in the bottom-left of [https://pipedream.com](https://pipedream.com).

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1702248992/docs/Screenshot_2023-12-10_at_2.56.28_PM_xmwqbq.png" width="300px" />
</div>

## Supported data types

Data stores can hold any JSON-serializable data within the storage limits. This includes data types including:

- Strings
- Objects
- Arrays
- Dates
- Integers
- Floats

But you cannot serialize functions, classes, sets, maps, or other complex objects.

## Retrieving a large number of keys

You can retrieve up to {{$site.themeConfig.DATA_STORES_MAX_KEYS}} keys from a data store in a single query.

If you're using a pre-built action or code to retrieve all records or keys, and your data store contains more than {{$site.themeConfig.DATA_STORES_MAX_KEYS}} records, you'll receive a 426 error.
