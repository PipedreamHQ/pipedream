# Overview

Develop, run and deploy your Python code in Pipedream workflows. Integrate seamlessly between no-code steps, with [connected accounts]([https://pipedream.com/docs/code/python/auth](https://pipedream.com/docs/code/nodejs/auth)), or integrate [Data Stores](https://pipedream.com/docs/data-stores) and [manipulate files within a workflow](https://pipedream.com/docs/code/python/working-with-files).

This includes [installing PyPI packages](https://pipedream.com/docs/code/python#using-third-party-packages), within your code without having to manage a `requirements.txt` file or running `pip`.

Below is an example of using Python to access data from the trigger of the workflow, and sharing it with subsequent workflow steps:

# Example Use Cases

Here are three practical uses for incorporating Python code in Pipedream workflows:

1. **Automated Data Processing**:
    - Python can be utilized within Pipedream to automate the processing of incoming data from various sources such as webhooks, APIs, or even scheduled events. You can transform, sanitize, and aggregate this data before passing it to subsequent steps or storing it in databases or data stores provided by Pipedream. This is particularly useful for workflows involving data analytics, where Python’s extensive library ecosystem (e.g., [Pandas](https://pandas.pydata.org/docs/user_guide/index.html) for data manipulation) can be leveraged.
2. **Integration and API Interactions**:
    - Use Python to orchestrate complex API interactions that require custom logic beyond simple HTTP requests. This can include handling authentication flows, error processing, or managing pagination. Python’s robust support for network and protocol management makes it ideal for integrating disparate systems, performing API health checks, or even creating composite APIs that aggregate data from multiple sources into a unified response.
3. **Machine Learning and AI**:
    - Implement machine learning models directly within your workflows to perform real-time predictions, analyses, or automated decision-making based on the incoming data streams. Python’s compatibility with machine learning frameworks like [TensorFlow](https://www.tensorflow.org/learn) or [scikit-learn](https://scikit-learn.org/stable/) allows you to import pre-trained models or train them on-the-fly using workflow data. This can be applied in scenarios such as image recognition, predictive maintenance, or customer sentiment analysis.

These applications of Python in Pipedream workflows enable sophisticated data operations, extend functionality with external APIs, and incorporate advanced analytics and machine learning directly into your automated processes.

# Getting Started

To add a Python code step, open a new workflow and include a step.

1. Select the Python app:

![Python app being chosen in Pipedream's new step selector screen.](https://res.cloudinary.com/pipedreamin/image/upload/v1713462237/marketplace/apps/python/CleanShot_2024-04-18_at_13.43.34_fin0ru.png)

2. Then select the **Run Python Code** action:

![Selecting the 'Run Python Code' action from the Python app in the Pipedream interface.](https://res.cloudinary.com/pipedreamin/image/upload/v1713462283/marketplace/apps/python/CleanShot_2024-04-18_at_13.44.34_jt15cq.png)

Now you’re ready to write some code!

On the right, you'll see the default code provided by Pipedream:

```python
def handler(pd: "pipedream"):
    # Reference data from previous steps
    print(pd.steps["trigger"]["context"]["id"])
    # Return data for use in future steps
    return {"foo": {"test": True}}
```

You can write your custom code within the `handler` function. `handler` is called when this step executes in your workflow. The **`pd`** argument contains the workflow's context and data.

When you click **Test** on the Python code step, it will display the event data from your trigger step. For instance, if your trigger is an HTTP request, then the HTTP request data will be returned.

This step can execute any Python code. However, the `handler` function, a special Pipedream callback, must be set up correctly to return data. Otherwise, you can run arbitrary code that:

* [Consume or share data with other steps](https://pipedream.com/docs/code/python#sharing-data-between-steps)

- [Send HTTP requests]([https://pipedream.com/docs/code/python#making-http-requests-from-your-workflow](https://pipedream.com/docs/code/nodejs#making-http-requests-from-your-workflow))
- [Return an HTTP response]([https://pipedream.com/docs/code/python#returning-http-responses](https://pipedream.com/docs/code/nodejs#returning-http-responses))
- [End the entire workflow]([https://pipedream.com/docs/code/python#ending-a-workflow-early](https://pipedream.com/docs/code/nodejs#ending-a-workflow-early))
- [Use your connected accounts to make authenticated HTTP requests]([https://pipedream.com/docs/code/python/auth](https://pipedream.com/docs/code/nodejs/auth))
- [Reference environment variables]([https://pipedream.com/docs/code/python#using-secrets-in-code](https://pipedream.com/docs/code/nodejs#using-secrets-in-code))
- [Retrieve or update data within Data Stores]([https://pipedream.com/docs/code/python/using-data-stores](https://pipedream.com/docs/code/nodejs/using-data-stores))
- [Download, upload and manipulate files]([https://pipedream.com/docs/code/python/working-with-files](https://pipedream.com/docs/code/nodejs/working-with-files))
- [Pausing, resuming and rerunning Python code steps]([https://pipedream.com/docs/code/python/rerun](https://pipedream.com/docs/code/nodejs/rerun))

# Troubleshooting

Pipedream will show your error traces within your individual steps, under the **Logs** section.

Traces across all of your workflows are also available within the [Event History](https://pipedream.com/docs/event-history) in your Pipedream workspace. This gives a global view of all failed executions, and gives you the tools to filter by workflow, time occurred and more.
