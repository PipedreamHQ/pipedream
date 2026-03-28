# Overview

The End utility on Pipedream provides a straightforward way to terminate workflows conditionally or unconditionally based on specific criteria or the status of preceding steps. This feature is particularly useful in scenarios where workflows need to be efficient, by stopping the execution once a certain condition is met or a particular goal is achieved. Utilizing the End API can prevent unnecessary API calls, processing, or actions that are redundant, ensuring that resources are utilized optimally and costs are minimized.

# Example Use Cases

- **Conditional End in Data Processing**: If you're processing data from an API and only need to continue if the data meets certain criteria, use the End API to stop the workflow if the conditions aren't met. This can be useful in scenarios like filtering out unwanted data before it hits your database.

- **Scheduled Job Cleanup**: In workflows where cleanup actions (like deleting temp files or removing data entries) are needed only after successful completion of prior tasks, the End API can be used to halt the workflow prematurely if an error occurs or if a task fails, preventing the cleanup actions from running unnecessarily.

- **Multi-branch Workflow Control**: When using a workflow that splits into multiple branches, you can use the End API to terminate specific branches based on the outcomes of different actions. This is useful for complex decision-making processes within a workflow, ensuring that only relevant paths are executed to completion.
