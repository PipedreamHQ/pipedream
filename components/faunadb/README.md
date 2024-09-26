# Overview

Fauna API offers a powerful serverless database solution for modern applications. Its unique capabilities allow for highly scalable, secure, and flexible data management. With Pipedream, you can harness the power of Fauna to create intricate serverless workflows that react to various triggers, manage data efficiently, and connect seamlessly with other services and APIs to automate complex tasks.

# Example Use Cases

- **Scheduled Data Backups to Cloud Storage**: Use Pipedream's scheduled triggers to run a workflow that extracts data from your Fauna database and pushes it to cloud storage solutions like AWS S3 or Google Cloud Storage. This workflow can be set to run at regular intervals, ensuring your backups are always up-to-date.

- **Real-time Data Sync with Third-Party Services**: Integrate Fauna with other apps to keep data in sync across platforms. For instance, you could create a workflow that watches for updates in your Fauna database and reflects those changes in a Shopify store, syncing inventory levels or product details automatically.

- **Automated Email Notifications on Data Events**: Set up a workflow that sends out email notifications using a service like SendGrid whenever specific data changes occur in your Fauna database. For example, you might notify a user when their order status changes or when a new piece of content is available that fits their preferences.


# FaunaDB Event Sources

FaunaDB Event Sources collect data from FaunaDB (for example, changes to a collection) and emits them as individual events. These events can trigger [Pipedream workflows](https://docs.pipedream.com/workflows/), and are accessible as a [real-time, private SSE stream](https://docs.pipedream.com/api/sse/), and via [REST API](https://docs.pipedream.com/api/rest/).

[**Watch this video**](https://youtu.be/rsjbXdOouHU) to learn how to create an event source to track changes to documents in a Fauna collection and build a Pipedream workflow to run on every change.

<!--ts-->

- [FaunaDB Event Sources](#faunadb-event-sources)
  - [Sources](#sources)
    - [Changes to Documents in a Collection](#changes-to-documents-in-a-collection)
  - [Workflows](#workflows)

<!--te-->

## Sources

### Changes to Documents in a Collection

[**Click here to create this source**](https://pipedream.com/sources?action=create&key=faunadb-changes-to-collection&app=faunadb)

The [`changes-to-collection.mjs`](changes-to-collection.mjs) source tracks [`add` and `remove` events](https://docs.fauna.com/fauna/current/api/fql/functions/events) to documents in a specific collection. Each time you add or remove a document from this collection, this event source emits an event of the following shape:

<details>
  <summary>Click to expand</summary>

```json
{
  "ts": 1588738648630000,
  "action": "add",
  "document": {
    "@ref": {
      "id": "264744257335591434",
      "collection": {
        "@ref": {
          "id": "test",
          "collection": { "@ref": { "id": "collections" } }
        }
      }
    }
  }
}
```

</details>

If you set the **Emit changes as a single event** property to `true`, Pipedream will emit a single event with all the changes since the last time the source ran. That event has the following shape:

<details>
  <summary>Click to expand</summary>

```json
[
  {
    "ts": 1588738648630000,
    "action": "add",
    "document": {
      "@ref": {
        "id": "264744257335591434",
        "collection": {
          "@ref": {
            "id": "test",
            "collection": { "@ref": { "id": "collections" } }
          }
        }
      }
    }
  },
  {
    "ts": 1588739721810000,
    "action": "remove",
    "document": {
      "@ref": {
        "id": "264744257335591434",
        "collection": {
          "@ref": {
            "id": "test",
            "collection": { "@ref": { "id": "collections" } }
          }
        }
      }
    }
  }
]
```

</details>

## Workflows

Here are a few example workflows you can copy and modify in any way:

- [Trigger an AWS Lambda script every time a document in a collection is added or removed](https://pipedream.com/@dylburger/changes-to-faunadb-documents-to-aws-lambda-p_RRC9NL/readme)
- [Every time a document in a collection is added or removed, send the event to Amazon SQS](https://pipedream.com/@dylburger/changes-to-faunadb-documents-aws-sqs-p_PACGag/readme)
- [Every time a document in a collection is added or removed, send the event to Amazon EventBridge](https://pipedream.com/@dylburger/changes-to-faunadb-documents-to-aws-eventbridge-event-bus-p_o7Cl3V/readme)
