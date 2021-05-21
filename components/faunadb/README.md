# FaunaDB Event Sources

FaunaDB Event Sources collect data from FaunaDB (for example, changes to a collection) and emits them as individual events. These events can trigger [Pipedream workflows](https://docs.pipedream.com/workflows/), and are accessible as a [real-time, private SSE stream](https://docs.pipedream.com/api/sse/), and via [REST API](https://docs.pipedream.com/api/rest/).

[**Watch this video**](https://youtu.be/rsjbXdOouHU) to learn how to create an event source to track changes to documents in a Fauna collection and build a Pipedream workflow to run on every change.

<!--ts-->

- [Sources](#sources)
  - [Changes to Documents in a Collection](#changes-to-documents-in-a-collection)
- [Workflows](#workflows)

<!--te-->

## Sources

### Changes to Documents in a Collection

[**Click here to create this source**](https://pipedream.com/sources?action=create&key=faunadb-changes-to-collection&app=faunadb)

The [`changes-to-collection.js`](changes-to-collection.js) source tracks [`add` and `remove` events](https://docs.fauna.com/fauna/current/api/fql/functions/events) to documents in a specific collection. Each time you add or remove a document from this collection, this event source emits an event of the following shape:

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
  },
  "instance": {
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
    },
    "instance": {
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
    },
    "instance": {
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
