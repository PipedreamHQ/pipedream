# Overview

The Clearly Defined API offers a way to interact with the Clearly Defined service, which curates and shares data about the clarity of licenses and security of open source components. You can retrieve detailed information about software components' licenses, scores for clarity, and metadata. On Pipedream, you can harness this API to automate checking the compliance and security of software dependencies, notify pertinent stakeholders about the status of components, and integrate with other tools for a seamless open source governance process.

# Example Use Cases

- **Automate License Compliance Checks**: Set up a Pipedream workflow that triggers on a schedule to check the licenses of dependencies used in your project. If it finds dependencies with unclear licenses, it can send alerts to Slack or another communication platform used by your team.

- **Enrich Continuous Integration/Deployment (CI/CD) Processes**: Use Pipedream to integrate the Clearly Defined API into your CI/CD pipeline. Before deployment, trigger a workflow to verify that all open source components are up to the defined standards and block the deployment if necessary.

- **Maintain a Database of Component Licenses**: Create a Pipedream workflow to query the Clearly Defined API periodically for your projects' dependencies. Store the results in a database, such as Google Sheets or Airtable, to maintain a live catalog of licenses and security statuses for auditing or reporting purposes.
