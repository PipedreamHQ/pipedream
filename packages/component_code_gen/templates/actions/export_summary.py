export_summary = """<ExportSummary>

You must call `$.export` to export a short text summary near the end of the `run` method so the user knows the call was successful. This is done by calling `$.export("$summary", "Your summary here")`.

The summary should contain relevant metadata about the object that was created, updated, or deleted. For example, if you are creating a new issue, you should include the issue name or ID in the summary. Include information here that you think will be most relevant for the user reading the summary. 

Generally, this should happen immediately before you return the data at the end of the component's `run` method.

```javascript
$.export("$summary", `Created issue ${name}`)
return data
```

</ExportSummary>
"""
