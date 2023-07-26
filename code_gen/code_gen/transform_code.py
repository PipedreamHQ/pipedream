import os
import openai
import templates.transform as templates
from dotenv import load_dotenv
load_dotenv()


def transform(code):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": templates.transform_instructions},
            {"role": "user", "content": f"This is the code: {code}"},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
