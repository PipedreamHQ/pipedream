import os
import openai
import logging_config
import templates.generate as templates
from langchain import LLMChain
from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_toolkits.json.toolkit import JsonToolkit
from langchain.tools.json.tool import JsonSpec
from dotenv import load_dotenv
load_dotenv()


class OpenAPIExplorerTool:
    @staticmethod
    def create_tools(docs):
        json_spec = JsonSpec(dict_=docs, max_value_length=10000)
        json_toolkit = JsonToolkit(spec=json_spec)
        tools = json_toolkit.get_tools()
        return tools


class PipedreamOpenAPIAgent:
    def __init__(self, docs, prompt):
        tools = OpenAPIExplorerTool.create_tools(docs)
        tool_names = [tool.name for tool in tools]
        llm = ChatOpenAI(model_name='gpt-4', temperature=0, request_timeout=300)
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        agent = ZeroShotAgent(llm_chain=llm_chain, allowed_tools=tool_names)
        self.agent_executor = AgentExecutor.from_agent_and_tools(
            agent=agent, tools=tools, verbose=os.environ['DEBUG'] == '1')

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


def format_result(result):
    if '```' in result:
        result = result.split('```javascript')[1].split('```')[0].strip()
    return result


def ask_agent(user_prompt, docs):
    prompt_template = ZeroShotAgent.create_prompt(
        tools=[],
        prefix=templates.with_docs_prefix,
        suffix=templates.suffix,
        format_instructions=templates.format_instructions,
        input_variables=['input', 'agent_scratchpad']
    )
    agent = PipedreamOpenAPIAgent(docs, prompt_template)
    result = agent.run(user_prompt)
    return result


def no_docs(app, prompt):
    logger = logging_config.getLogger(__name__)
    logger.debug('no docs found, calling openai directly')
    openai.api_key = os.getenv("OPENAI_API_KEY")
    system_prompt = templates.no_docs_prefix
    result = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{prompt}. The app is {app}"},
        ],
        temperature=0,
    )

    result = result.choices[0].message.content.strip()
    return format_result(result)
