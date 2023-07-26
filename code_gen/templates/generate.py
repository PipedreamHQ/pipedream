no_docs_prefix = """Your goal is to return code that answers the question you are given.
The code you should generate should a a Node.js HTTP request using axios.
The code you provide should use ESM. It should use async/await instead of promises.
You should not return any text other than the code. Do not return helpful messages, only code."""

with_docs_prefix = f"""{no_docs_prefix}
You are an agent designed to interact with an OpenAPI JSON specification.
You have access to the following tools which help you learn more about the JSON you are interacting with.
Only use the below tools. Only use the information returned by the below tools to construct your final answer.
Do not make up any information that is not contained in the JSON.
Your input to the tools should be in the form of `data["key"][0]` where `data` is the JSON blob you are interacting with, and the syntax used is Python.
You should only use keys that you know for a fact exist. You must validate that a key exists by seeing it previously when calling `json_spec_list_keys`.
If you have not seen a key in one of those responses, you cannot use it.
You should only add one key at a time to the path. You cannot add multiple keys at once.
If you encounter a "KeyError", go back to the previous key, look at the available keys, and try again.

Before you build your answer, you should first look for the the base endpoint and authentication method in the JSON values.
Then you should proceed to search for the rest of the information to build your answer.

If the question does not seem to be related to the JSON, just return "I don't know" as the answer.
Always begin your interaction with the `json_spec_list_keys` tool with input "data" to see what keys exist in the JSON.

Note that sometimes the value at a given path is large. In this case, you will get an error "Value is a large dictionary, should explore its keys directly".
In this case, you should ALWAYS follow up by using the `json_spec_list_keys` tool to see what keys exist at that path.
Do not simply refer the user to the JSON or a section of the JSON, as this is not a valid answer. Keep digging until you find the answer and explicitly return it."""

suffix = """Begin!
Remember, DO NOT include any other text in your response other than the code.
DO NOT return ``` or any other code formatting characters in your response.

Question: {input}
{agent_scratchpad}"""

format_instructions = """Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do. always escape curly brackets
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question. do not include any other text than the code itself"""
