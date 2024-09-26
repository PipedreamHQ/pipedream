export_summary = """## Export summary

A short summary should be exported before the end so that the user can quickly read what has happened. This is done by calling `$.export("$summary", "Your summary here")`. This is not optional.

The summary should contain relevant metadata about the object that was created, updated, or deleted. For example, if you are creating a new issue, you should include the issue name or ID in the summary. 

```
`$.export("$summary", `Created issue ${name}`)
```

Include information here that you think will be most relevant for the user.
"""
