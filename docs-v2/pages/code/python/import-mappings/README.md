---
content_class: max-w-3/4
short_description: Import modules with different package names.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763741/docs/icons/icons8-module-96_ot9f1w.png
---

# Use PyPI packages with differing import names

Some Python PyPI package names do not match their import names. However, you can still import them into your Python steps.

## Using Magic Comments

When a package’s name doesn’t match the import name, you can specify the package name in a magic comment.

For example the `google.cloud` package exports `bigquery`, but you can still use it in your Python code steps in workflows:

```python
# pipedream add-package google-cloud-bigquery

from google.cloud import bigquery
```

The special comment `pipedream add-package <package name>` will install the package into your workflow environment.

This is the new preferred way to import packages in Python code steps with mismatching module names.


<PythonMappings />
