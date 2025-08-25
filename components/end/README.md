# Overview

The End API on Pipedream allows users to terminate a workflow before its natural completion point based on specific conditions or criteria. This capability is critical for managing flow control and ensuring that unnecessary steps are skipped when certain conditions are met, thereby optimizing workflow execution and resource usage.

# Example Use Cases

- **Conditional Content Distribution**: If a workflow processes content and checks its relevance or compliance before distribution, the End API could terminate the process early if the content does not meet the specified criteria, preventing irrelevant or non-compliant content from being distributed.

- **User Verification Process**: In workflows where user verification is required before proceeding (e.g., email verification, age verification), the End API can halt the workflow prematurely if the user fails the verification checks, thus ensuring that only verified users proceed.

- **Resource Threshold Monitoring**: For workflows monitoring resource usage (like API calls or compute time), the End API can end the workflow if the usage exceeds a predetermined threshold, helping to avoid overuse and reduce costs.
