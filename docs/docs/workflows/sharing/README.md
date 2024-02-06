# Sharing Workflows

You can share your workflows as templates with other Pipedream accounts with a unique shareable link.

Creating a share link for your workflow will allow anyone with the link to create a template version of your workflow in their own Pipedream account. This will allow others to use your workflow with their own Pipedream account and also their own connected accounts.

[Here's an example of a workflow](https://pipedream.com/new?h=tch_OYWfjz) that sends you a daily SMS message with today's schedule:

<div class="flex justify-center">
<img alt="Daily Schedule SMS Reminder workflow" src="https://res.cloudinary.com/pipedreamin/image/upload/v1685116771/docs/docs/share%20workflows/New_Project_6_n63kju.png" />
</div>

Click the button below or copy and paste the link into your browser to instantly create a new workflow from this template:

<div class="flex justify-between my-3">
  <a href="https://pipedream.com/new?h=tch_OYWfjz" class="rounded cursor-pointer pd-copy-workflow shadow-md">
    <div class="flex items-center">
      <svg style="width: 25px;" class="fill-current text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>rocket-launch</title><path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z" /></svg>
      <span class="block">
      Deploy to Pipedream 
      </span>
    </div>
  </a>

  <input type="text" class="rounded font-semibold text-center w-3/5 border-2 focus:border-emerald-600  rounded-sm py-2 underline" value="https://pipedream.com/new?h=tch_OYWfjz" />
</div>

The copied workflow includes the same trigger, steps, and connected account configuration, but it has a separate event history and versioning from the original.

## Creating a share link for a workflow

To share a workflow, open the **Builder** for the workflow. Then in the top right menu, select **Create Share Link**.

![Click "Create Share Link" in the workflow's settings within the builder to generate a sharable link](https://res.cloudinary.com/pipedreamin/image/upload/v1685119418/docs/docs/share%20workflows/CleanShot_2023-05-26_at_12.42.22_p4q3dr.png)

Now you can define which prop values should be included in this shareable link.

## Including props

Optionally, you can include the actual individual prop configurations as well. This helps speed up workflow development if the workflow relies on specific prop values to function properly.

You can choose to **Include all** prop values if you'd like, or only select specific props.

For the daily schedule reminder workflow, we included the props for filtering Google Calendar events, but we did _not_ include the SMS number to send the message to. This is because the end user of this workflow will use their own phone number instead:

![Sharing a workflow that will send a daily SMS message of your Google Calendar schedule for today](https://res.cloudinary.com/pipedreamin/image/upload/v1685113542/docs/docs/share%20workflows/CleanShot_2023-05-26_at_11.05.16_hebqpl.png)

::: tip Connected Accounts are not shared

Shared workflow links do not include your own connected accounts. Instead, in this new workflow, the user of your workflow link is prompted to connect their own accounts.

:::

## Versioning

When you create a shared link for your workflow, that link is frozen to the version of your workflow at the time the link was created.

If changes are made to the original workflow, the changes will _not_ be included in the shared workflow link, nor in any workflows copied from the original shared link.

[Generate a new share link](#creating-a-share-link-for-a-workflow) to include new changes to a workflow.

::: tip Share links persist

You can create multiple share links for the same workflow with different prop configurations, or even different steps.

Share links will not expire or be overridden.

:::

## Frequently Asked Questions

### If changes are made to the original workflow, will copied versions of the workflow from the shared link also change?

No, workflows copied from a shared link will have separate version histories from the original workflow. You can modify your original workflow and it will not affect copied workflows.

### Will my connected accounts be shared with the workflow?

No, your connected accounts are not shared. Instead, copied workflows display a slot in actions that require a connected account, so the user of the copied workflow can provide their own accounts instead.

For example, if one of your steps relies on a Slack connected account to send a message, then the copied workflow will display the need to connect a Slack account.

### I haven't made any changes to my workflow, but if I generate another shared link will it override my original link?

No, if the steps and prop configuration of the workflow is exactly the same, then the shared link URL will also be exactly the same.

The shared workflow link is determined by the configuration of your workflow, it's not a randomly generated ID.

### Will generating new shared links disable or delete old links?

No, each link you generate will be available even if you create new versions based on changes or included props from the original workflow.

### What plan is this feature available on?

Sharing workflows via link is available on all plans, including the Free tier plans.

### Do users of my workflow need to have a subscription?

To copy a workflow, a subscription is not required. However, the copied workflow is subject to the current workspace's plan limits.

For example, if a workflow requires more connected accounts than what's available on the [Free tier](/pricing/#free-tier), then users of your workflow will require a plan to run the workflow properly.

### Will copies of my workflow use my credits?

No. Copied workflows have entirely separate versioning, connected accounts, and billing. Sharing workflow copies is free, and the user of the copy usage is responsible for credit usage. Your original workflow is entirely separate from the copy.

### How can I transfer all of my workflows from one account to another?

It's only possible to share a single workflow at time with a link at this time.

If you're trying to migrate all resources from one workspace to another [please contact us for help](mailto:support@pipedream.com).

### Can I share my v1 workflows?

No, v1 workflows are not shareable. If you need to share a v1 workflow, please see our [migration guide](/migrate-from-v1/) to convert it into a modern v2 workflow.
