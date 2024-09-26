# Overview

The Diffy API offers visual regression testing, allowing you to compare visuals of web pages over time or across different environments. With Pipedream's serverless architecture, you can integrate Diffy into various workflows to automate visual testing, get notified of changes, or even trigger deployments in a CI/CD pipeline when a visual test passes.

# Example Use Cases

- **Scheduled Visual Regression Tests**: Set up a Pipedream workflow that triggers on a schedule to run visual comparisons of your production site against a staging environment using the Diffy API. If differences exceed a certain threshold, it can alert your team through Slack or email for review.

- **Monitor Competitor Websites**: Create a Pipedream workflow that periodically checks your competitors' websites using the Diffy API. Store the snapshots in a data store, and if significant visual changes are detected, notify your marketing team so they can analyze the competitor's strategy.

- **Integration with Deployment Pipelines**: Design a workflow in Pipedream to act as a gatekeeper in your deployment pipeline. After a deployment to a test environment, trigger a visual test using Diffy API. If the test passes, automatically promote the build to the next stage in your pipeline; if not, halt the deployment and notify your development team.
