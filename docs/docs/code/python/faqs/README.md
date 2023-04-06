# Frequently Asked Questions about Python

## What's the difference between `def handler(pd)` and the `pipedream` package for Python code steps?

The `handler` method is a newer implementation of Python code steps. It includes the ability to stop the workflow early, integrate a Data Store and/or Connected Accounts into your Python code step.

However, at this time there are issues with our Python interpreter that is causing an `ECONNRESET` error.

At this time, we recommend using the `pipedream` package to import and export data from Python code steps to other steps in your workflow.

If you absolutely need to use a Data Store in your workflow, we recommend using a prebuilt action to retrieve or store data or Node.js's Data Store capabilities.

## I've tried installing a Python package with a normal import and the magic comment system, but I still can't. What can I do?

Some Python packages require binaries present within the environment in order to function properly. Or they include binaries but those binaries are not compatible with the Pipedream workflow environment.

Unfortunately we cannot support these types of packages at this time.

Please stay tuned for custom Docker container support, which will allow you to bring your own container and package the dependencies needed for your own environment.

## Can I publish my Python code as a reusable pre-built action or trigger like you can with Node.js?

Not at this time. Pipedream only supports Python as a code step language. The Components system only supports Node.js at this time.

You can still duplicate Python code steps within the same workflow, but to reuse a code step, you'll need to copy and paste the Python code to another workflow.
