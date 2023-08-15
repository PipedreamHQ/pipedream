from dotenv import load_dotenv
load_dotenv()

import litellm
from config.config import config
from litellm import completion


def transform(code, templates):
    litellm.api_key = config['openai']['api_key']
    response = completion(
        model="gpt-4",
        messages=[
            {"role": "system", "content": templates.system_instructions},
            {"role": "user", "content": f"This is the code: {code}"},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
