from dotenv import load_dotenv
load_dotenv()

import openai
from config.config import config
from langchain import LLMChain
from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_toolkits.json.toolkit import JsonToolkit
from langchain.tools.json.tool import JsonSpec


class OpenAPIExplorerTool:
    @staticmethod
    def create_tools(docs):
        json_spec = JsonSpec(dict_=docs)
        json_toolkit = JsonToolkit(spec=json_spec)
        tools = json_toolkit.get_tools()
        return tools


class PipedreamOpenAPIAgent:
    def __init__(self, docs, templates):
        tools = OpenAPIExplorerTool.create_tools(docs)
        tool_names = [tool.name for tool in tools]
        prompt_template = ZeroShotAgent.create_prompt(
            tools=tools,
            prefix=format_template(templates.with_docs_system_instructions),
            suffix=templates.suffix,
            format_instructions=templates.format_instructions,
            input_variables=['input', 'agent_scratchpad']
        )
        llm = ChatOpenAI(model_name=config["model"], temperature=0, request_timeout=300)
        llm_chain = LLMChain(llm=llm, prompt=prompt_template)
        agent = ZeroShotAgent(llm_chain=llm_chain, allowed_tools=tool_names)
        verbose = True if config['logging']['level'] == 'DEBUG' else False
        self.agent_executor = AgentExecutor.from_agent_and_tools(
            agent=agent, tools=tools, verbose=verbose)

    def run(self, input):
        try:
            result = self.agent_executor.run(input)
        except Exception as e:
            result = str(e)
            if "I don't know" in result:
                return "I don't know"
            if '```' not in result:
                raise e

        return format_result(result)


def format_template(text):
    return text.replace("{", "{{").replace("}", "}}") # escape curly braces


def format_result(result):
    if '```' in result:
        result = result.split('```javascript')[1].split('```')[0].strip()
    return result


def ask_agent(user_prompt, docs, templates):
    agent = PipedreamOpenAPIAgent(docs, templates)
    result = agent.run(user_prompt)
    return result


def no_docs(app, prompt, templates):
    openai.api_key = config['openai']['api_key']
    result = openai.ChatCompletion.create(
        model=config["model"],
        messages=[
            {"role": "system", "content": format_template(templates.no_docs_system_instructions)},
            {"role": "user", "content": templates.no_docs_user_prompt % (prompt, app)},

        ],
        temperature=0,
    )

    result = result.choices[0].message.content.strip()
    return format_result(result)
