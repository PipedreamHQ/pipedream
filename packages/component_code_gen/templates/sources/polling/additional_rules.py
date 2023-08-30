additional_rules = """## Additional rules for polling sources

1. Always emit relevant data. The data being emitted must be JSON-serializable. The emitted data is displayed in Pipedream and used in the next steps.

2. Always use this signature for the run method:

async run() {
  // your code here
}"""
