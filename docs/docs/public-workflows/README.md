---
prev: false
next: false
---

# Workflow Code and Data Visibility

**By default, the workflows you create, and the steps within them, are private. The data you send to a workflow, and all logs and API responses we attach to steps, are also private**.

You can make your workflow code public using the drop-down menu to the right of the **code** label at the top of your workflow: 

<div>
<img alt="Workflow visibility toggle" src="./images/toggle-workflow-visibility.png">
</div>

**It's critical you do not save sensitive data — for example, API keys — in public workflow code**. You should save those values in [step parameters](/workflows/steps/#passing-data-to-steps-step-parameters) or [environment variables](/environment-variables/), and reference the value of those variables in your workflow, instead.

When a workflow is public, trigger and action steps are also public, **but the specific values of their [step parameters](/workflows/steps/#passing-data-to-steps-step-parameters) are kept private, by default**. For example:

- If you're using an HTTP trigger and sending data to S3 and SQL destinations, the fact that you're using those steps will be public. But we won't reveal the specific endpoint URL associated with your HTTP trigger.
- We also won't reveal the name of the S3 bucket to which you're sending data, or the specific data you're sending.

Moreover, you can [change the default visibility of step parameters](/workflows/steps/#the-values-of-step-params-are-private-by-default) to make them public, to set default values or for examples, where relevant.

<Footer />
