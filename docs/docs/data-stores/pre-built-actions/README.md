# Using pre-built Data Store actions

Pipedream includes several native pre-built actions to interact with your Data Stores for the most common operations to speed up your workflow development.

## Inserting data

To insert data into a data store, first search for the **Data Stores** app in a new action on your workflow.

Then you can select the **Add or update a single record** pre-built action.

![Insert a single row into a data store](https://res.cloudinary.com/pipedreamin/image/upload/v1648060286/docs/components/CleanShot_2022-03-23_at_14.31.05_2x_swrdrh.png)

After selecting this action, you'll be presented with the 3 key options to finish setup:

![Configure the action](https://res.cloudinary.com/pipedreamin/image/upload/v1648063057/docs/components/CleanShot_2022-03-23_at_15.17.30_2x_snunyz.png)

1. **Select or create a Data Store** - you can create a brand new empty Data Store or choose another Data Store from your account
2. **Key** - this is the unique identifier to look up this data in the future
3. **Value** - the data that should be stored under the **Key**

For example, to store when the workflow was initially triggered, pass the timestamp path to the **Value** field, and assign the name _Triggered"_ as the **Key**:

::: v-pre
`{{ steps.trigger.context.ts }}`
:::

The **Key** should always evaluate to a string.

However, you can use dynamic keys as well by passing a path to another step's exports. For instance, retrieving an `id` entry in the body of an HTTP Webhook trigger:

::: v-pre 
`{{ steps.trigger.event.body.id }}`
:::

![Workflow trigger example](https://res.cloudinary.com/pipedreamin/image/upload/v1648061400/docs/components/CleanShot_2022-03-23_at_14.49.43_2x_eaiv7p.png)

:::tip

Need to store multiple data points in one action? Use the **Add or update multiple records** action instead.

:::

### Retrieving Data

The **Get record** action will retrieve the latest value of a data point in one of your Data Stores.

Search for the **Data Stores** app in a new code step, and then select the **Get record** action:

![Create a get record action](https://res.cloudinary.com/pipedreamin/image/upload/v1648062096/docs/components/CleanShot_2022-03-23_at_14.53.54_2x_aqpwx2.png)

This action has 2 properties:

1. **Select a Data Store** - select the Data Store to retrieve data from
2. **Key** - where to query the data from


![Retrieve workflow triggered example](https://res.cloudinary.com/pipedreamin/image/upload/v1648063057/docs/components/CleanShot_2022-03-23_at_15.17.30_2x_snunyz.png)

## Deleting Data

To delete a single record from your Data Store, use the **Delete record** action in a step:

![Select the delete record step](https://res.cloudinary.com/pipedreamin/image/upload/v1648064099/docs/components/CleanShot_2022-03-23_at_15.34.44_2x_pk9idz.png)

This action requires 2 properties:

1. **Select a Data Store** - select the Data Store that contains the record to be deleted
2. **Key** - the key that identifies the individual record

This is an example of deleting the `Triggered At` key that we've created in the steps above:

![Delete a record example](https://res.cloudinary.com/pipedreamin/image/upload/v1648064157/docs/components/CleanShot_2022-03-23_at_15.35.48_2x_ay1bbw.png)

Deleting a record is not deleting the whole Data Store. [To delete an entire Data Store, use the Pipedream Data Stores Dashboard](#deleting-data-stores-manually).
