# Data Stores

<VideoPlayer url="https://www.youtube.com/embed/0WMcAnDF7FA" title="Data store Basics" />

**Data stores** are Pipedream's built-in key-value store. You can set and get any JSON-serializable data at a specific key and maintain state across workflow executions.

They're useful for counting values, retrieving data across workflow executions, caching, and more.

You can also connect to the same data store across workflows, so they're great for sharing state across different services.

You can use pre-built, no-code actions to store, update, and clear data, or interact with data stores programmatically in [Node.js](/code/nodejs/using-data-stores/) or [Python](/code/python/using-data-stores/).

## Using pre-built Data Store actions

Pipedream includes several pre-built actions to interact with your data stores for the most common operations.

### Inserting data

To insert data into a data store, first search for the **Data Stores** app in a new action within your workflow.

Then you can select the **Add or update a single record** pre-built action.

![Insert a single row into a data store](https://res.cloudinary.com/pipedreamin/image/upload/v1648060286/docs/components/CleanShot_2022-03-23_at_14.31.05_2x_swrdrh.png)

After selecting this action, you'll be presented with the 3 options to finish setup:

![Configure the action](https://res.cloudinary.com/pipedreamin/image/upload/v1648063057/docs/components/CleanShot_2022-03-23_at_15.17.30_2x_snunyz.png)

1. **Select or create a Data Store** - you can create a brand new empty data store or choose another data store from your account
2. **Key** - this is the unique identifier to look up this data in the future
3. **Value** - the data that should be stored under the **Key**

For example, to store when the workflow was initially triggered, pass the timestamp path to the **Value** field, and assign the name _Triggered_ as the **Key**:

::: v-pre
`{{ steps.trigger.context.ts }}`
:::

The **Key** should always evaluate to a string.

However, you can use dynamic keys as well by passing a path to another step's exports. For instance, retrieving an `id` entry in the body of an HTTP Webhook trigger:

::: v-pre
`{{ steps.trigger.event.body.id }}`
:::

![Workflow trigger example](https://res.cloudinary.com/pipedreamin/image/upload/v1649270704/docs/components/add_update_record_action_eh7dpz.png)

:::tip

Need to store multiple data points in one action? Use the **Add or update multiple records** action instead.

:::

### Retrieving Data

The **Get record** action will retrieve the latest value of a data point in one of your data stores.

Search for the **Data Stores** app in a new code step, and then select the **Get record** action:

![Create a get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648062096/docs/components/CleanShot_2022-03-23_at_14.53.54_2x_aqpwx2.png)

This action has 3 properties:

1. **Select a Data Store** - select the data store to retrieve data from
2. **Key** - where to query the data from
3. **Create new record if key is not found** - if the specified key isn't found, you can create a new record

![Get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648853992/docs/components/data_stores_get_record_yqazfk.png)

### Deleting Data

To delete a single record from your data store, use the **Delete record** action in a step:

![Select the delete record step](https://res.cloudinary.com/pipedreamin/image/upload/v1648064099/docs/components/CleanShot_2022-03-23_at_15.34.44_2x_pk9idz.png)

This action requires 2 properties:

1. **Select a Data Store** - select the data store that contains the record to be deleted
2. **Key** - the key that identifies the individual record

This is an example of deleting the `Triggered At` key that we've created in the steps above:

![Delete a record example](https://res.cloudinary.com/pipedreamin/image/upload/v1648064157/docs/components/CleanShot_2022-03-23_at_15.35.48_2x_ay1bbw.png)

Deleting a record does not delete the entire data store. [To delete an entire data store, use the Pipedream Data Stores Dashboard](#deleting-data-stores-manually).

## Managing data stores

You can view the contents of your data stores at any time in the [Pipedream Dashboard](https://pipedream.com/data-stores/).

On the left had navigation menu, there's a dedicated **Data Stores** section.

From here you can open individual data stores by clicking on them.

### Editing data store values manually

You can also edit data store values manually from this view.

Click the pencil icon on the far right of the data store. This will open a text box that will allow you to edit the contents of the value. When you're finished with your edits, save by clicking the checkmark icon.

![Editing a data store's value manually](https://res.cloudinary.com/pipedreamin/image/upload/v1648063518/docs/components/CleanShot_2022-03-23_at_15.24.49_err0nt.gif)

### Deleting data stores

You can delete a data store from this dashboard as well. On the far right in the data store row, click the trash can icon.

![Delete a Data Store](https://res.cloudinary.com/pipedreamin/image/upload/v1648063753/docs/components/CleanShot_2022-03-23_at_15.29.00_qtvdcz.gif)

Deleting a data store is irreversible. Please take care when using this feature.

::: warning
If the delete icon is greyed out and unclickable, it means that you have dependent workflows using the data store.

In order to free up this data store to be deleted manually, you'll need to remove those steps from the workflow consuming that data store, or switch them to use a different data store to allow it to be deleted.
:::

### Using data stores in code steps

Refer to the [Node.js](/code/nodejs/using-data-stores/) and [Python](/code/python/using-data-stores/) data store docs to learn how to use data stores in code steps. You can get, set, delete and perform any other data store operations in code.

## Compression

Data saved in data stores is [Brotli-compressed](https://github.com/google/brotli), minimizing storage. The total compression ratio depends on the data being compressed. To test this on your own data, run it through a package that supports Brotli compression and measure the size of the data before and after.

## Data store limitations

Data Stores are only currently available in [Node.js](/code/nodejs/using-data-stores/) and [Python](/code/python/using-data-stores/) code steps. You cannot use data stores in [Bash](/code/bash/) or [Go](/code/go/) code steps.

### Supported data types

Data stores can hold any JSON-serializable data within the storage limits. This includes data types including:

- Strings
- Objects
- Arrays
- Dates
- Integers
- Floats

But you cannot serialize functions, classes, sets, maps, or other complex objects.

### Retrieving a large number of keys

You can retrieve up to {{$site.themeConfig.DATA_STORES_MAX_KEYS}} keys from a data store in a single query.

If you're using a pre-built action or code to retrieve all records or keys, and your data store contains more than {{$site.themeConfig.DATA_STORES_MAX_KEYS}} records, you'll receive a 426 error.
