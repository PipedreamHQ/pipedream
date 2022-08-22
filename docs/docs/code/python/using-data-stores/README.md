---
short_description: Store and read data with data stores.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763735/docs/icons/icons8-database-96_iv1oup.png
---

# Using Data Stores

:::warning

This is an experimental feature and is available to to enable or disable in the [alpha](https://pipedream.com/dashboard).

There may be changes to this feature while we prepare it for a full release.

:::

In Python code steps, you can also store and retrieve data from [Data Stores](/data-stores/) without connecting to a 3rd party database.

Add a data store as a input to a Python step, then access it in your Python `handler` with `pd.inputs["data_store"]`.

```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Store a value under a key
  data_store["key"] = "Hello World"

  # Retrieve the value and print it to the step's Logs
  print(data_store["key"])

```

## Adding a Data Store

In the _inputs_ select the _Add Data Store_ option.

![Adding a datastore to a Python step](https://res.cloudinary.com/pipedreamin/image/upload/v1658954673/docs/components/CleanShot_2022-07-27_at_16.44.16_olfejo.gif)

This will add the selected Data Store to your Python code step.

## Saving data

Data Stores are key-value stores. Saving data within a Data Store is just like setting a property on a dictionary:

```python
from datetime import datetime

def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Store a timestamp
  data_store["last_ran_at"] = datetime.now().isoformat()
```

## Retrieving keys

Fetch all the keys in a given Data Store using the `keys` method:
```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Retrieve all keys in the data store
  keys = pd.inputs["data_store"].keys()

  # Print a comma separated string of all keys
  print(*keys, sep=",")
```

## Checking for the existence of specific keys

If you need to check whether a specific `key` exists in a Data Store, use `if` and `in` as a conditional:

```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Search for a key in a conditional
  if "last_ran_at" in data_store:
    print(f"Last ran at {data_store['last_ran_at']}")
```

## Retrieving data

You can retrieve data with the Data Store by key name:

```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Retrieve the timestamp value by the key name
  last_ran_at = data_store["last_ran_at"]
  
  # Print the timestamp
  print(f"Last ran at {last_ran_at")
```

Alternatively, use the `data_store.get()` method to retrieve a specific key's contents:

```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Retrieve the timestamp value by the key name
  last_ran_at = data_store.get("last_ran_at")
  
  # Print the timestamp
  print(f"Last ran at {last_ran_at") 
```


::: tip
What's the difference between `data_store["key"]` and `data_store.get("key")`?

* `data_store["key"]` will throw a `TypeError` if the key doesn't exist in the Data Store.
* `data_store.get("key")` will instead return `None` if the key doesn't exist in the Data Store.
* `data_store.get("key", "default_value")` will return `"default_value"` if the key doesn't exist on the Data Store.
:::

## Deleting or updating values within a record

To delete or update the _value_ of an individual record, assign `key` a new value or `''` to remove the value but retain the key.
```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]
  
  # Assign a new value to the key
  data_store["myKey"] = "newValue"

  # Remove the value but retain the key
  data_store["myKey"] = ""
```

## Deleting specific records

To delete individual records in a Data Store, use the `del` operation for a specific `key`:
```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Delete the last_ran_at timestamp key
  del data_store["last_ran_at"]
```

## Deleting all records from a specific Data Store

If you need to delete all records in a given Data Store, you can use the `clear` method.
```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # Delete the entire contents of the datas store
  data_store.clear()
```

:::warning
`data_store.clear()` is an **irreversible** change, **even when testing code** in the workflow builder.
:::

## Viewing store data

You can view the contents of your data stores in your [Pipedream dashboard](https://pipedream.com/stores).

From here you can also manually edit your data store's data, rename stores, delete stores or create new stores.

## Workflow counter example

You can use a data store as a counter. For example, this code counts the number of times the workflow runs:

```python
def handler(pd: "pipedream"):
  # Access the data store under the pd.inputs
  data_store = pd.inputs["data_store"]

  # if the counter doesn't exist yet, start it at one
  if data_store.get("counter") == None:
    data_store["counter"] = 1

  # Otherwise, increment it by one
  else:
    count = data_store["counter"]
    data_store["counter"] = count + 1
```

## Dedupe data example

Data Stores are also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.

For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:

```python
def handler(pd: "pipedream"):
  # Access the data store
  data_store = pd.inputs["data_store"]

  # Reference the incoming email from the HTTP request
  new_email = pd.steps["trigger"]["event"]["body"]["new_customer_email"]

  # Retrieve the emails stored in our data store
  emails = data_store.get('emails', [])

  # If this email has been seen before, exit early
  if new_email in emails:
    print(f"Already seen {new_email}, exiting")
    return False

  # This email is new, append it to our list
  else:
    print(f"Adding new email to data store {new_email}")
    emails.append(new_email)
    data_store["emails"] = emails
    return new_email
```

## Data store limitations

Pipedream Data Stores are currently in Preview and are subject to change.

Data Stores are only currently available in Node.js code steps. They are not yet available in other languages like [Python](/code/python/), [Bash](/code/bash/) or [Go](/code/go/).

### Supported data types

Data stores can hold any JSON-serializable data within the storage limits. This includes data types including:

* Strings
* Dictionaries
* Lists
* Integers
* Floats

But you cannot serialize Modules, Functions, Classes, or other more complex objects.
