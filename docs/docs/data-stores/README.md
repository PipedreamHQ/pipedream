# Data Stores

<VideoPlayer url="https://www.youtube.com/embed/0WMcAnDF7FA" title="Data Store Basics" />

**Data stores** are key-value stores. You can set and get any JSON-serializable data at a specific key and maintain state across workflow executions.

They're useful for counting values, retrieving data across workflow executions, caching, and more.

You can connect to a data store in any workflow, so they're also great for sharing state across different services. You can also use pre-built actions to store, update, and clear data without code.

## Using pre-built Data Store actions

Pipedream includes several pre-built actions to interact with your Data Stores for the most common operations.

### Inserting data

To insert data into a data store, first search for the **Data Stores** app in a new action within your workflow.

Then you can select the **Add or update a single record** pre-built action.

![Insert a single row into a data store](https://res.cloudinary.com/pipedreamin/image/upload/v1648060286/docs/components/CleanShot_2022-03-23_at_14.31.05_2x_swrdrh.png)

After selecting this action, you'll be presented with the 3 options to finish setup:

![Configure the action](https://res.cloudinary.com/pipedreamin/image/upload/v1648063057/docs/components/CleanShot_2022-03-23_at_15.17.30_2x_snunyz.png)

1. **Select or create a Data Store** - you can create a brand new empty Data Store or choose another Data Store from your account
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

The **Get record** action will retrieve the latest value of a data point in one of your Data Stores.

Search for the **Data Stores** app in a new code step, and then select the **Get record** action:

![Create a get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648062096/docs/components/CleanShot_2022-03-23_at_14.53.54_2x_aqpwx2.png)

This action has 3 properties:

1. **Select a Data Store** - select the Data Store to retrieve data from
2. **Key** - where to query the data from
3. **Create new record if key is not found** - if the specified key isn't found, you can create a new record

![Get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648853992/docs/components/data_stores_get_record_yqazfk.png)

### Deleting Data

To delete a single record from your Data Store, use the **Delete record** action in a step:

![Select the delete record step](https://res.cloudinary.com/pipedreamin/image/upload/v1648064099/docs/components/CleanShot_2022-03-23_at_15.34.44_2x_pk9idz.png)

This action requires 2 properties:

1. **Select a Data Store** - select the Data Store that contains the record to be deleted
2. **Key** - the key that identifies the individual record

This is an example of deleting the `Triggered At` key that we've created in the steps above:

![Delete a record example](https://res.cloudinary.com/pipedreamin/image/upload/v1648064157/docs/components/CleanShot_2022-03-23_at_15.35.48_2x_ay1bbw.png)

Deleting a record does not delete the entire Data Store. [To delete an entire Data Store, use the Pipedream Data Stores Dashboard](#deleting-data-stores-manually).

## Managing Data Stores

You can view the contents of your Data Stores at any time in the [Pipedream Dashboard](https://pipedream.com/data-stores/).

On the left had navigation menu, there's a dedicated **Data Stores** section.

From here you can open individual Data Stores by clicking on them.

### Editing Data Store values manually

You can also edit Data Store values manually from this view. To edit a particular Data Stores values, click the pencil icon on the far right of the data store.

This will open a text box that will allow you to edit the contents of the value. When you're finished with your edits, save by clicking the checkmark icon.

![Editing a data store's value manually](https://res.cloudinary.com/pipedreamin/image/upload/v1648063518/docs/components/CleanShot_2022-03-23_at_15.24.49_err0nt.gif)

### Deleting Data Stores manually

You can delete a specific Data Store from this dashboard as well. On the far right in the Data Store entry, click the trash can icon to prompt the deletion of the Data Store.

![Delete a Data Store](https://res.cloudinary.com/pipedreamin/image/upload/v1648063753/docs/components/CleanShot_2022-03-23_at_15.29.00_qtvdcz.gif)

Deleting a Data Store is irreversible. Please take care when using this feature.

::: warning
If the delete icon is greyed out and unclickable, it means that you have dependent workflows using the Data Store.

In order to free up this Data Store to be deleted manually, you'll need to remove those steps from the workflow consuming that Data Store, or switch them to use a different Data Store to allow it to be deleted.
:::

### Using Data Stores in Code Steps

Refer to the [Node.js](/code/nodejs/using-data-stores/) and [Python](/code/python/using-data-stores/) Data Store documentation to learn how to use Data Stores in code steps in your workflows. You can get, set, delete and perform any other data store operations in code.

## Compression

Data saved in data stores is [Brotli-compressed](https://github.com/google/brotli), minimizing storage. The total compression ratio depends on the data being compressed. To test this on your own data, run it through a package that supports Brotli compression and measure the size of the data before and after.

## Data store limitations

Pipedream Data Stores are currently in Beta and are subject to change.

Data Stores are only currently available in [Node.js](/code/nodejs/using-data-stores/) and [Python](/code/python/using-data-stores/) code steps. They are not yet available in other languages like [Bash](/code/bash/) or [Go](/code/go/).

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

If you're using a pre-built action or code to retrieve all records or keys, and your Data Store contains more than {{$site.themeConfig.DATA_STORES_MAX_KEYS}} records, you'll receive a 426 error.
