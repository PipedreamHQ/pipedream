# Managing Data Stores

You can view the contents of your Data Stores at any time in the [Pipedream Dashboard](https://pipedream.com/data-stores/).

On the left had navigation menu, there's a dedicated **Data Stores** section.

From here you can open individual Data Stores by clicking on them individually.

## Editing Data Store values manually

You can also edit Data Store values manually from this view. To edit a Data Stores values, click the pencil icon on the far right of the data store.

This will open a text box that will allow you to edit the contents of the value. When you're finished with your edits, save by clicking the checkmark icon.

![Editing a data store's value manually](https://res.cloudinary.com/pipedreamin/image/upload/v1648063518/docs/components/CleanShot_2022-03-23_at_15.24.49_err0nt.gif)


## Deleting Data Stores manually

You can delete a specific Data Store from this dashboard as well. On the far right in the Data Store entry, click the trash can icon to prompt the deletion of the Data Store.

![Delete a Data Store](https://res.cloudinary.com/pipedreamin/image/upload/v1648063753/docs/components/CleanShot_2022-03-23_at_15.29.00_qtvdcz.gif)

Deleting a Data Store is irreversiable. Please take care when using this feature.

::: warning
If the delete icon is greyed out and unclickable, it means that you have dependent workflows using the data store.

In order to free up this Data Store to be deleted manually, you'll need to remove those steps from the workflow consuming that Data Store, or switch them to use a different Data Store to allow it to be deleted.
:::

## Using with Data Stores in Code Steps

[Refer to our Node.js Data Store documentation](/code/nodejs/using-data-stores) to learn how to use props to define Data Stores in custom code steps in your workflows.
