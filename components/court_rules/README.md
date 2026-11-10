# Overview

[Court Rules](https://www.courtrules.app/) is a free reference for U.S. federal and state court rules, local rules and judge standing orders, with a deadline calculator and a REST API. Every rule is extracted from the court's own published documents and keeps a link and a citation back to its source, so you can see the exact page or section behind it.

With the Court Rules components on Pipedream you can look up courts and judges, read the rules that apply to a specific judge, search filing rules by topic (courtesy copies, page limits, e-filing, service, fees, timing), list court holidays, and check a filing against a judge's rules, from a workflow or from an AI agent.

# Example Use Cases

- **Skip court holidays in a deadline workflow.** Fetch a court's closure dates with List Court Holidays and leave them out when a workflow counts days toward a filing deadline.
- **Brief the team before a filing.** When a new matter is assigned to a judge, call Get Judge Rules and post the page limits and courtesy copy requirements to Slack or email.
- **Check a draft before it goes out.** Send the page count and word count of a draft to Check Document Compliance and open a task if any rule fails.
- **Answer rule questions in an agent.** Give an AI agent Search Filing Rules and List Judges so it can cite the court rule behind each answer.

# Getting Started

1. Sign in to the [Court Rules console](https://console.courtrules.app) with Google or email, and copy your API key from the dashboard.
2. In Pipedream, add the Court Rules app to a workflow step and paste the key when prompted.
3. Run List Courts to find a court ID, then List Judges to find a judge slug.
4. Use Get Judge Rules or Search Filing Rules with those values.

See the [Court Rules API documentation](https://docs.courtrules.app) for every endpoint and field.

# Troubleshooting

- **Invalid API key.** A rejected key returns a 403 error. Copy the key again from the dashboard and reconnect the app.
- **Missing API key.** A 401 error means no key was sent. Reconnect the app and make sure the key field is not empty.
- **Compliance checks for other courts.** Check Document Compliance runs for the Eastern District of New York today. Other courts return an error that points to Get Judge Rules and Search Filing Rules.
- **Search too broad.** Search Filing Rules rejects searches that are too broad. Add a Court ID, a Judge Slug or a Rule Type.
- **Rate limits.** Requests are limited per key. A 429 error means to wait for the number of seconds in the Retry-After header and try again.
