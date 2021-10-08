# Troubleshooting

This doc describes some common solutions for fixing issues with [pipedream.com](https://pipedream.com) or with a specific workflow.

[[toc]]

## A feature isn't working on pipedream.com

If you're seeing an issue with [pipedream.com](https://pipedream.com) (for example, the site won't load, or you think you've found a bug), try each of the following steps, checking to see if they fix the problem:

1. [Hard refresh](https://fabricdigital.co.nz/blog/how-to-hard-refresh-your-browser-and-clear-cache) pipedream.com in your browser.

2. Log out of your pipedream.com account, and log back in.

3. [Disable your browser extensions](https://www.computerhope.com/issues/ch001411.htm) or use features like [Chrome Guest mode](https://support.google.com/chrome/answer/6130773?hl=en&co=GENIE.Platform%3DAndroid) to browse pipedream.com without any existing extensions / cookies / cache.

If you're still seeing the issue after trying these steps, please [report a bug](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+).

## My workflow isn't working

If you're encountering a specific issue in a workflow, try the following steps, checking to see if they fix the problem:

1. Make a trivial change to your workflow, and **Deploy** your workflow again.

2. Try searching [the community](https://pipedream.com/support) or [the `pipedream` GitHub repo](https://github.com/PipedreamHQ/pipedream/issues) to see if anyone else has solved the same issue.

3. [Copy your workflow](/workflows/copy/) to see if the issue persists on the new workflow.

If you're still seeing the issue after trying these steps, please reach out in [the community](https://pipedream.com/support).

## Where do I find my workflow's ID?

Open [https://pipedream.com](https://pipedream.com) and visit your workflow. Copy the URL that appears in your browser's address bar. For example:

```
https://pipedream.com/@dylburger/p_abc123/edit
```

Your workflow's ID is the value that starts with `p_`. In this example: `p_abc123`.

## Where do I find my event source's ID?

Open [https://pipedream.com/sources](https://pipedream.com/sources) and click on your event source. Copy the URL that appears in your browser's address bar. For example:

```
https://pipedream.com/sources/dc_abc123
```

Your source's ID is the value that starts with `dc_`. In this example: `dc_abc123`.