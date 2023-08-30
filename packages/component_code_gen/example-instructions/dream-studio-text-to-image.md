## Prompt

Generate a new image from a text prompt.

Use the app slug "dreamstudio". Auth is in this.dreamstudio.$auth.api_key.

Let me select the engine with an async options param from the "List all engines available to your organization/user" endpoint. This endpoint doesn't use pagination and just returns an array of objects (engines). Return the name property as the label and the id as the value.

When you hit the image generation endpoint, generate an image of type image/png.

Save the image to a file and return the file path.

## API docs

Here's the OpenAPI spec:

{
"openapi": "3.0.3",
"info": {
"termsOfService": "https://platform.stability.ai/docs/terms-of-service",
"description": "Welcome to the Stability.ai REST API!\n\nYour DreamStudio API key will be required for authentication: [How to find your API key](https://platform.stability.ai/docs/getting-started/authentication)\n\nAPI operations use the following versioning scheme:\n- `/v*` interface is stable and ready for production workloads\n- `/v*beta*`: interface is stable, preparing for production release\n- `/v*alpha*`: under development and the interface is subject to change\n\nNOTE: The v1alpha and v1beta endpoints from the developer preview are still available, but they\nwill disabled on May 1st, 2023. Please migrate to the v1 endpoints as soon as possible.\n\nIf you have feedback or encounter any issues with the API, please reach out:\n - [https://github.com/Stability-AI/REST-API](https://github.com/Stability-AI/REST-API)\n - [https://discord.gg/stablediffusion #API channel](https://discord.com/channels/1002292111942635562/1042896447311454361)\n",
"title": "Stability.ai REST API",
"version": "v1",
"x-logo": {
"altText": "Stability.ai REST API",
"url": "/docs/StabilityLogo.png"
}
},
"servers": [
{
"url": "https://api.stability.ai"
}
],
"tags": [
{
"name": "v1/user",
"description": "Manage your Stability.ai account, and view account/organization balances"
},
{
"name": "v1/engines",
"description": "Enumerate available engines"
},
{
"name": "v1/generation",
"description": "Generate images from text, existing images, or both"
}
],
"paths": {
"/v1/generation/{engine*id}/text-to-image": {
"post": {
"description": "Generate a new image from a text prompt",
"operationId": "textToImage",
"summary": "text-to-image",
"tags": [
"v1/generation"
],
"parameters": [
{
"$ref": "#/components/parameters/engineID"
},
{
"$ref": "#/components/parameters/accept"
},
{
"$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
},
{
"$ref": "#/components/parameters/stabilityClientVersion"
}
],
"requestBody": {
"content": {
"application/json": {
"example": {
"cfg_scale": 7,
"clip_guidance_preset": "FAST_BLUE",
"height": 512,
"width": 512,
"sampler": "K_DPM_2_ANCESTRAL",
"samples": 1,
"steps": 75,
"text_prompts": [
{
"text": "A lighthouse on a cliff",
"weight": 1
}
]
},
"schema": {
"$ref": "#/components/schemas/TextToImageRequestBody"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK response.",
            "content": {
              "application/json": {
                "schema": {
                  "description": "The result of the generation request, containing one or more images as base64 encoded strings.",
                  "items": {
                    "$ref": "#/components/schemas/Image"
},
"type": "array"
}
},
"image/png": {
"example": "PNG bytes, what did you expect?",
"schema": {
"description": "The bytes of the generated image",
"format": "binary",
"type": "string"
}
}
},
"headers": {
"Content-Length": {
"$ref": "#/components/headers/Content-Length"
              },
              "Content-Type": {
                "$ref": "#/components/headers/Content-Type"
},
"Finish-Reason": {
"$ref": "#/components/headers/Finish-Reason"
              },
              "Seed": {
                "$ref": "#/components/headers/Seed"
}
}
},
"400": {
"$ref": "#/components/responses/400FromGeneration"
          },
          "401": {
            "$ref": "#/components/responses/401"
},
"403": {
"$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
},
"500": {
"$ref": "#/components/responses/500"
}
},
"security": [
{
"STABILITY_API_KEY": []
}
],
"x-codeSamples": [
{
"lang": "Python",
"source": "import base64\nimport os\nimport requests\n\nengine_id = \"stable-diffusion-xl-1024-v1-0\"\napi_host = os.getenv('API_HOST', 'https://api.stability.ai')\napi_key = os.getenv(\"STABILITY_API_KEY\")\n\nif api_key is None:\n raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.post(\n f\"{api_host}/v1/generation/{engine_id}/text-to-image\",\n headers={\n \"Content-Type\": \"application/json\",\n \"Accept\": \"application/json\",\n \"Authorization\": f\"Bearer {api_key}\"\n },\n json={\n \"text_prompts\": [\n {\n \"text\": \"A lighthouse on a cliff\"\n }\n ],\n \"cfg_scale\": 7,\n \"height\": 1024,\n \"width\": 1024,\n \"samples\": 1,\n \"steps\": 30,\n },\n)\n\nif response.status_code != 200:\n raise Exception(\"Non-200 response: \" + str(response.text))\n\ndata = response.json()\n\nfor i, image in enumerate(data[\"artifacts\"]):\n with open(f\"./out/v1_txt2img*{i}.png\", \"wb\") as f:\n f.write(base64.b64decode(image[\"base64\"]))\n"
},
{
"label": "TypeScript",
"lang": "Javascript",
"source": "import fetch from 'node-fetch'\nimport fs from 'node:fs'\n\nconst engineId = 'stable-diffusion-xl-1024-v1-0'\nconst apiHost = process.env.API*HOST ?? 'https://api.stability.ai'\nconst apiKey = process.env.STABILITY_API_KEY\n\nif (!apiKey) throw new Error('Missing Stability API key.')\n\nconst response = await fetch(\n `${apiHost}/v1/generation/${engineId}/text-to-image`,\n {\n method: 'POST',\n headers: {\n 'Content-Type': 'application/json',\n Accept: 'application/json',\n Authorization: `Bearer ${apiKey}`,\n },\n body: JSON.stringify({\n text_prompts: [\n {\n text: 'A lighthouse on a cliff',\n },\n ],\n cfg_scale: 7,\n height: 1024,\n width: 1024,\n steps: 30,\n samples: 1,\n }),\n }\n)\n\nif (!response.ok) {\n throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface GenerationResponse {\n artifacts: Array<{\n base64: string\n seed: number\n finishReason: string\n }>\n}\n\nconst responseJSON = (await response.json()) as GenerationResponse\n\nresponseJSON.artifacts.forEach((image, index) => {\n fs.writeFileSync(\n `./out/v1_txt2img*${index}.png`,\n    Buffer.from(image.base64, 'base64')\n  )\n})\n"
          },
          {
            "lang": "Go",
            "source": "package main\n\nimport (\n\t\"bytes\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"net/http\"\n\t\"os\"\n)\n\ntype TextToImageImage struct {\n\tBase64       string `json:\"base64\"`\n\tSeed         uint32 `json:\"seed\"`\n\tFinishReason string `json:\"finishReason\"`\n}\n\ntype TextToImageResponse struct {\n\tImages []TextToImageImage `json:\"artifacts\"`\n}\n\nfunc main() {\n\t// Build REST endpoint URL w/ specified engine\n\tengineId := \"stable-diffusion-xl-1024-v1-0\"\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/generation/\" + engineId + \"/text-to-image\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\tvar data = []byte(`{\n\t\t\"text_prompts\": [\n\t\t  {\n\t\t\t\"text\": \"A lighthouse on a cliff\"\n\t\t  }\n\t\t],\n\t\t\"cfg_scale\": 7,\n\t\t\"height\": 1024,\n\t\t\"width\": 1024,\n\t\t\"samples\": 1,\n\t\t\"steps\": 30\n  \t}`)\n\n\treq, _ := http.NewRequest(\"POST\", reqUrl, bytes.NewBuffer(data))\n\treq.Header.Add(\"Content-Type\", \"application/json\")\n\treq.Header.Add(\"Accept\", \"application/json\")\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\n\t// Execute the request & read all the bytes of the body\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tif res.StatusCode != 200 {\n\t\tvar body map[string]interface{}\n\t\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t\tpanic(fmt.Sprintf(\"Non-200 response: %s\", body))\n\t}\n\n\t// Decode the JSON body\n\tvar body TextToImageResponse\n\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\tpanic(err)\n\t}\n\n\t// Write the images to disk\n\tfor i, image := range body.Images {\n\t\toutFile := fmt.Sprintf(\"./out/v1_txt2img_%d.png\", i)\n\t\tfile, err := os.Create(outFile)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\timageBytes, err := base64.StdEncoding.DecodeString(image.Base64)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif _, err := file.Write(imageBytes); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif err := file.Close(); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t}\n}\n"
          },
          {
            "lang": "cURL",
            "source": "if [ -z \"$STABILITY*API_KEY\" ]; then\n echo \"STABILITY_API_KEY environment variable is not set\"\n exit 1\nfi\n\nOUTPUT_FILE=./out/v1_txt2img.png\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image\"\n\ncurl -f -sS -X POST \"$URL\" \\\n  -H 'Content-Type: application/json' \\\n  -H 'Accept: image/png' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\" \\\n  --data-raw '{\n    \"text_prompts\": [\n      {\n        \"text\": \"A lighthouse on a cliff\"\n      }\n    ],\n    \"cfg_scale\": 7,\n    \"height\": 1024,\n    \"width\": 1024,\n    \"samples\": 1,\n    \"steps\": 30\n  }' \\\n  -o \"$OUTPUT_FILE\"\n"
}
]
}
},
"/v1/generation/{engine_id}/image-to-image": {
"post": {
"description": "Modify an image based on a text prompt",
"operationId": "imageToImage",
"summary": "image-to-image",
"tags": [
"v1/generation"
],
"parameters": [
{
"$ref": "#/components/parameters/engineID"
},
{
"$ref": "#/components/parameters/accept"
},
{
"$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
},
{
"$ref": "#/components/parameters/stabilityClientVersion"
}
],
"requestBody": {
"content": {
"multipart/form-data": {
"schema": {
"$ref": "#/components/schemas/ImageToImageRequestBody"
              },
              "examples": {
                "IMAGE_STRENGTH": {
                  "summary": "Using IMAGE_STRENGTH",
                  "description": "Request using 35% image_strength",
                  "value": {
                    "image_strength": 0.35,
                    "init_image_mode": "IMAGE_STRENGTH",
                    "init_image": "<image binary>",
                    "text_prompts[0][text]": "A dog space commander",
                    "text_prompts[0][weight]": 1,
                    "cfg_scale": 7,
                    "clip_guidance_preset": "FAST_BLUE",
                    "sampler": "K_DPM_2_ANCESTRAL",
                    "samples": 3,
                    "steps": 20
                  }
                },
                "STEP_SCHEDULE": {
                  "summary": "Using STEP_SCHEDULE",
                  "description": "Equivalent request using step_schedule_start",
                  "value": {
                    "step_schedule_start": 0.65,
                    "init_image_mode": "STEP_SCHEDULE",
                    "init_image": "<image binary>",
                    "text_prompts[0][text]": "A dog space commander",
                    "text_prompts[0][weight]": 1,
                    "cfg_scale": 7,
                    "clip_guidance_preset": "FAST_BLUE",
                    "sampler": "K_DPM_2_ANCESTRAL",
                    "samples": 3,
                    "steps": 20
                  }
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK response.",
            "content": {
              "application/json": {
                "schema": {
                  "description": "The result of the generation request, containing one or more images as base64 encoded strings.",
                  "items": {
                    "$ref": "#/components/schemas/Image"
},
"type": "array"
}
},
"image/png": {
"example": "PNG bytes, what did you expect?",
"schema": {
"description": "The bytes of the generated image",
"format": "binary",
"type": "string"
}
}
},
"headers": {
"Content-Length": {
"$ref": "#/components/headers/Content-Length"
              },
              "Content-Type": {
                "$ref": "#/components/headers/Content-Type"
},
"Finish-Reason": {
"$ref": "#/components/headers/Finish-Reason"
              },
              "Seed": {
                "$ref": "#/components/headers/Seed"
}
}
},
"400": {
"$ref": "#/components/responses/400FromGeneration"
          },
          "401": {
            "$ref": "#/components/responses/401"
},
"403": {
"$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
},
"500": {
"$ref": "#/components/responses/500"
}
},
"security": [
{
"STABILITY_API_KEY": []
}
],
"x-codeSamples": [
{
"lang": "Python",
"source": "import base64\nimport os\nimport requests\n\nengine_id = \"stable-diffusion-xl-1024-v1-0\"\napi_host = os.getenv(\"API_HOST\", \"https://api.stability.ai\")\napi_key = os.getenv(\"STABILITY_API_KEY\")\n\nif api_key is None:\n raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.post(\n f\"{api_host}/v1/generation/{engine_id}/image-to-image\",\n headers={\n \"Accept\": \"application/json\",\n \"Authorization\": f\"Bearer {api_key}\"\n },\n files={\n \"init_image\": open(\"../init_image_1024.png\", \"rb\")\n },\n data={\n \"image_strength\": 0.35,\n \"init_image_mode\": \"IMAGE_STRENGTH\",\n \"text_prompts[0][text]\": \"Galactic dog with a cape\",\n \"cfg_scale\": 7,\n \"samples\": 1,\n \"steps\": 30,\n }\n)\n\nif response.status_code != 200:\n raise Exception(\"Non-200 response: \" + str(response.text))\n\ndata = response.json()\n\nfor i, image in enumerate(data[\"artifacts\"]):\n with open(f\"./out/v1_img2img*{i}.png\", \"wb\") as f:\n f.write(base64.b64decode(image[\"base64\"]))\n"
},
{
"label": "TypeScript",
"lang": "Javascript",
"source": "import fetch from 'node-fetch'\nimport FormData from 'form-data'\nimport fs from 'node:fs'\n\nconst engineId = 'stable-diffusion-xl-1024-v1-0'\nconst apiHost = process.env.API*HOST ?? 'https://api.stability.ai'\nconst apiKey = process.env.STABILITY_API_KEY\n\nif (!apiKey) throw new Error('Missing Stability API key.')\n\n// NOTE: This example is using a NodeJS FormData library.\n// Browsers should use their native FormData class.\n// React Native apps should also use their native FormData class.\nconst formData = new FormData()\nformData.append('init_image', fs.readFileSync('../init_image_1024.png'))\nformData.append('init_image_mode', 'IMAGE_STRENGTH')\nformData.append('image_strength', 0.35)\nformData.append('text_prompts[0][text]', 'Galactic dog wearing a cape')\nformData.append('cfg_scale', 7)\nformData.append('samples', 1)\nformData.append('steps', 30)\n\nconst response = await fetch(\n `${apiHost}/v1/generation/${engineId}/image-to-image`,\n {\n method: 'POST',\n headers: {\n ...formData.getHeaders(),\n Accept: 'application/json',\n Authorization: `Bearer ${apiKey}`,\n },\n body: formData,\n }\n)\n\nif (!response.ok) {\n throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface GenerationResponse {\n artifacts: Array<{\n base64: string\n seed: number\n finishReason: string\n }>\n}\n\nconst responseJSON = (await response.json()) as GenerationResponse\n\nresponseJSON.artifacts.forEach((image, index) => {\n fs.writeFileSync(\n `out/v1_img2img*${index}.png`,\n    Buffer.from(image.base64, 'base64')\n  )\n})\n"
          },
          {
            "lang": "Go",
            "source": "package main\n\nimport (\n\t\"bytes\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"io\"\n\t\"mime/multipart\"\n\t\"net/http\"\n\t\"os\"\n)\n\ntype ImageToImageImage struct {\n\tBase64       string `json:\"base64\"`\n\tSeed         uint32 `json:\"seed\"`\n\tFinishReason string `json:\"finishReason\"`\n}\n\ntype ImageToImageResponse struct {\n\tImages []ImageToImageImage `json:\"artifacts\"`\n}\n\nfunc main() {\n\tengineId := \"stable-diffusion-xl-1024-v1-0\"\n\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/generation/\" + engineId + \"/image-to-image\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\tdata := &bytes.Buffer{}\n\twriter := multipart.NewWriter(data)\n\n\t// Write the init image to the request\n\tinitImageWriter, _ := writer.CreateFormField(\"init_image\")\n\tinitImageFile, initImageErr := os.Open(\"../init_image_1024.png\")\n\tif initImageErr != nil {\n\t\tpanic(\"Could not open init_image.png\")\n\t}\n\t_, _ = io.Copy(initImageWriter, initImageFile)\n\n\t// Write the options to the request\n\t_ = writer.WriteField(\"init_image_mode\", \"IMAGE_STRENGTH\")\n\t_ = writer.WriteField(\"image_strength\", \"0.35\")\n\t_ = writer.WriteField(\"text_prompts[0][text]\", \"Galactic dog with a cape\")\n\t_ = writer.WriteField(\"cfg_scale\", \"7\")\n\t_ = writer.WriteField(\"samples\", \"1\")\n\t_ = writer.WriteField(\"steps\", \"30\")\n\twriter.Close()\n\n\t// Execute the request\n\tpayload := bytes.NewReader(data.Bytes())\n\treq, _ := http.NewRequest(\"POST\", reqUrl, payload)\n\treq.Header.Add(\"Content-Type\", writer.FormDataContentType())\n\treq.Header.Add(\"Accept\", \"application/json\")\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tif res.StatusCode != 200 {\n\t\tvar body map[string]interface{}\n\t\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t\tpanic(fmt.Sprintf(\"Non-200 response: %s\", body))\n\t}\n\n\t// Decode the JSON body\n\tvar body ImageToImageResponse\n\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\tpanic(err)\n\t}\n\n\t// Write the images to disk\n\tfor i, image := range body.Images {\n\t\toutFile := fmt.Sprintf(\"./out/v1_img2img_%d.png\", i)\n\t\tfile, err := os.Create(outFile)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\timageBytes, err := base64.StdEncoding.DecodeString(image.Base64)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif _, err := file.Write(imageBytes); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif err := file.Close(); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t}\n}\n"
          },
          {
            "lang": "cURL",
            "source": "if [ -z \"$STABILITY*API_KEY\" ]; then\n echo \"STABILITY_API_KEY environment variable is not set\"\n exit 1\nfi\n\nOUTPUT_FILE=./out/v1_img2img.png\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image\"\n\ncurl -f -sS -X POST \"$URL\" \\\n  -H 'Content-Type: multipart/form-data' \\\n  -H 'Accept: image/png' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\" \\\n  -F 'init_image=@\"../init_image_1024.png\"' \\\n  -F 'init_image_mode=IMAGE_STRENGTH' \\\n  -F 'image_strength=0.35' \\\n  -F 'text_prompts[0][text]=A galactic dog in space' \\\n  -F 'cfg_scale=7' \\\n  -F 'samples=1' \\\n  -F 'steps=30' \\\n  -o \"$OUTPUT_FILE\"\n"
}
]
}
},
"/v1/generation/{engine_id}/image-to-image/upscale": {
"post": {
"description": "Create a higher resolution version of an input image.\n\nThis operation outputs an image with a maximum pixel count of **4,194,304**. This is equivalent to dimensions such as `2048x2048` and `4096x1024`.\n\nBy default, the input image will be upscaled by a factor of 2. For additional control over the output dimensions, a `width` or `height` parameter may be specified.\n\nFor upscaler engines that are ESRGAN-based, refer to the `RealESRGANUpscaleRequestBody` body option below. For upscaler engines that are Stable Diffusion Latent Upscaler-based, refer to the `LatentUpscalerUpscaleRequestBody` body option below.\n\nFor more details on the upscaler engines, refer to the [documentation on the Platform site.](https://platform.stability.ai/docs/features/image-upscaling?tab=python)\n",
"operationId": "upscaleImage",
"summary": "image-to-image/upscale",
"tags": [
"v1/generation"
],
"parameters": [
{
"$ref": "#/components/parameters/upscaleEngineID"
},
{
"$ref": "#/components/parameters/accept"
},
{
"$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
},
{
"$ref": "#/components/parameters/stabilityClientVersion"
}
],
"requestBody": {
"content": {
"multipart/form-data": {
"schema": {
"oneOf": [
{
"$ref": "#/components/schemas/RealESRGANUpscaleRequestBody"
},
{
"$ref": "#/components/schemas/LatentUpscalerUpscaleRequestBody"
}
]
},
"examples": {
"ESRGAN": {
"description": "Upscale input image by 2x using ESRGAN.",
"value": {
"image": "<image binary>"
}
},
"DESIRED_WIDTH": {
"description": "Upscale input image to desired width with ESRGAN or the Latent Upscaler.",
"value": {
"image": "<image binary>",
"width": 1024
}
},
"DESIRED_HEIGHT": {
"description": "Upscale input image to desired height with ESRGAN or the Latent Upscaler.",
"value": {
"image": "<image binary>",
"height": 1024
}
},
"LATENT_UPSCALER": {
"description": "Request using the Latent Upscaler. Refer to the LatentUpscalerUpscaleRequestBody for reference.",
"value": {
"seed": 5555,
"steps": 20,
"image": "<image binary>",
"text_prompts[0][text]": "A dog space commander",
"text_prompts[0][weight]": 1,
"cfg_scale": 7
}
}
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK response.",
"content": {
"application/json": {
"schema": {
"description": "The result of the generation request, containing one or more images as base64 encoded strings.",
"items": {
"$ref": "#/components/schemas/Image"
                  },
                  "type": "array"
                }
              },
              "image/png": {
                "example": "PNG bytes, what did you expect?",
                "schema": {
                  "description": "The bytes of the generated image",
                  "format": "binary",
                  "type": "string"
                }
              }
            },
            "headers": {
              "Content-Length": {
                "$ref": "#/components/headers/Content-Length"
},
"Content-Type": {
"$ref": "#/components/headers/Content-Type"
              },
              "Finish-Reason": {
                "$ref": "#/components/headers/Finish-Reason"
},
"Seed": {
"$ref": "#/components/headers/Seed"
              }
            }
          },
          "400": {
            "$ref": "#/components/responses/400FromUpscale"
},
"401": {
"$ref": "#/components/responses/401"
          },
          "403": {
            "$ref": "#/components/responses/403"
},
"404": {
"$ref": "#/components/responses/404"
          },
          "500": {
            "$ref": "#/components/responses/500"
}
},
"security": [
{
"STABILITY_API_KEY": []
}
],
"x-codeSamples": [
{
"lang": "Python",
"source": "import os\nimport requests\n\nengine_id = \"esrgan-v1-x2plus\"\napi_host = os.getenv(\"API_HOST\", \"https://api.stability.ai\")\napi_key = os.getenv(\"STABILITY_API_KEY\")\n\nif api_key is None:\n raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.post(\n f\"{api_host}/v1/generation/{engine_id}/image-to-image/upscale\",\n headers={\n \"Accept\": \"image/png\",\n \"Authorization\": f\"Bearer {api_key}\"\n },\n files={\n \"image\": open(\"../init_image.png\", \"rb\")\n },\n data={\n \"width\": 1024,\n }\n)\n\nif response.status_code != 200:\n raise Exception(\"Non-200 response: \" + str(response.text))\n\nwith open(f\"./out/v1_upscaled_image.png\", \"wb\") as f:\n f.write(response.content)\n"
},
{
"label": "TypeScript",
"lang": "Javascript",
"source": "import fetch from 'node-fetch'\nimport FormData from 'form-data'\nimport fs from 'node:fs'\n\nconst engineId = 'esrgan-v1-x2plus'\nconst apiHost = process.env.API_HOST ?? 'https://api.stability.ai'\nconst apiKey = process.env.STABILITY_API_KEY\n\nif (!apiKey) throw new Error('Missing Stability API key.')\n\n// NOTE: This example is using a NodeJS FormData library.\n// Browsers should use their native FormData class.\n// React Native apps should also use their native FormData class.\nconst formData = new FormData()\nformData.append('image', fs.readFileSync('../init_image.png'))\nformData.append('width', 1024)\n\nconst response = await fetch(\n `${apiHost}/v1/generation/${engineId}/image-to-image/upscale`,\n {\n method: 'POST',\n headers: {\n ...formData.getHeaders(),\n Accept: 'image/png',\n Authorization: `Bearer ${apiKey}`,\n },\n body: formData,\n }\n)\n\nif (!response.ok) {\n throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\nconst image = await response.arrayBuffer()\nfs.writeFileSync('./out/v1_upscaled_image.png', Buffer.from(image))\n"
},
{
"lang": "Go",
"source": "package main\n\nimport (\n\t\"bytes\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"io\"\n\t\"mime/multipart\"\n\t\"net/http\"\n\t\"os\"\n)\n\nfunc main() {\n\tengineId := \"esrgan-v1-x2plus\"\n\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/generation/\" + engineId + \"/image-to-image/upscale\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\tdata := &bytes.Buffer{}\n\twriter := multipart.NewWriter(data)\n\n\t// Write the init image to the request\n\tinitImageWriter, * := writer.CreateFormField(\"image\")\n\tinitImageFile, initImageErr := os.Open(\"../init*image.png\")\n\tif initImageErr != nil {\n\t\tpanic(\"Could not open init_image.png\")\n\t}\n\t*, _ = io.Copy(initImageWriter, initImageFile)\n\n\t// Write the options to the request\n\t_ = writer.WriteField(\"width\", \"1024\")\n\twriter.Close()\n\n\t// Execute the request\n\tpayload := bytes.NewReader(data.Bytes())\n\treq, _ := http.NewRequest(\"POST\", reqUrl, payload)\n\treq.Header.Add(\"Content-Type\", writer.FormDataContentType())\n\treq.Header.Add(\"Accept\", \"image/png\")\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tif res.StatusCode != 200 {\n\t\tvar body map[string]interface{}\n\t\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t\tpanic(fmt.Sprintf(\"Non-200 response: %s\", body))\n\t}\n\n\t// Write the response to a file\n\tout, err := os.Create(\"./out/v1*upscaled_image.png\")\n\tdefer out.Close()\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\t*, err = io.Copy(out, res.Body)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n}\n"
},
{
"lang": "cURL",
"source": "if [ -z \"$STABILITY_API_KEY\" ]; then\n echo \"STABILITY*API_KEY environment variable is not set\"\n exit 1\nfi\n\nOUTPUT_FILE=./out/v1_upscaled_image.png\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/generation/esrgan-v1-x2plus/image-to-image/upscale\"\n\ncurl -f -sS -X POST \"$URL\" \\\n  -H 'Content-Type: multipart/form-data' \\\n  -H 'Accept: image/png' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\" \\\n  -F 'image=@\"../init_image.png\"' \\\n  -F 'width=1024' \\\n  -o \"$OUTPUT_FILE\"\n"
}
]
}
},
"/v1/generation/{engine_id}/image-to-image/masking": {
"post": {
"description": "Selectively modify portions of an image using a mask",
"operationId": "masking",
"summary": "image-to-image/masking",
"tags": [
"v1/generation"
],
"parameters": [
{
"example": "stable-inpainting-512-v2-0",
"in": "path",
"name": "engine_id",
"required": true,
"schema": {
"type": "string"
}
},
{
"$ref": "#/components/parameters/accept"
},
{
"$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
},
{
"$ref": "#/components/parameters/stabilityClientVersion"
}
],
"requestBody": {
"required": true,
"content": {
"multipart/form-data": {
"schema": {
"$ref": "#/components/schemas/MaskingRequestBody"
              },
              "examples": {
                "MASK_IMAGE_BLACK": {
                  "value": {
                    "mask_source": "MASK_IMAGE_BLACK",
                    "init_image": "<image binary>",
                    "mask_image": "<image binary>",
                    "text_prompts[0][text]": "A dog space commander",
                    "text_prompts[0][weight]": 1,
                    "cfg_scale": 7,
                    "clip_guidance_preset": "FAST_BLUE",
                    "sampler": "K_DPM_2_ANCESTRAL",
                    "samples": 3,
                    "steps": 20
                  }
                },
                "MASK_IMAGE_WHITE": {
                  "value": {
                    "mask_source": "MASK_IMAGE_WHITE",
                    "init_image": "<image binary>",
                    "mask_image": "<image binary>",
                    "text_prompts[0][text]": "A dog space commander",
                    "text_prompts[0][weight]": 1,
                    "cfg_scale": 7,
                    "clip_guidance_preset": "FAST_BLUE",
                    "sampler": "K_DPM_2_ANCESTRAL",
                    "samples": 3,
                    "steps": 20
                  }
                },
                "INIT_IMAGE_ALPHA": {
                  "value": {
                    "mask_source": "INIT_IMAGE_ALPHA",
                    "init_image": "<image binary>",
                    "text_prompts[0][text]": "A dog space commander",
                    "text_prompts[0][weight]": 1,
                    "cfg_scale": 7,
                    "clip_guidance_preset": "FAST_BLUE",
                    "sampler": "K_DPM_2_ANCESTRAL",
                    "samples": 3,
                    "steps": 20
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK response.",
            "content": {
              "application/json": {
                "schema": {
                  "description": "The result of the generation request, containing one or more images as base64 encoded strings.",
                  "items": {
                    "$ref": "#/components/schemas/Image"
},
"type": "array"
}
},
"image/png": {
"example": "PNG bytes, what did you expect?",
"schema": {
"description": "The bytes of the generated image",
"format": "binary",
"type": "string"
}
}
},
"headers": {
"Content-Length": {
"$ref": "#/components/headers/Content-Length"
              },
              "Content-Type": {
                "$ref": "#/components/headers/Content-Type"
},
"Finish-Reason": {
"$ref": "#/components/headers/Finish-Reason"
              },
              "Seed": {
                "$ref": "#/components/headers/Seed"
}
}
},
"400": {
"$ref": "#/components/responses/400FromGeneration"
          },
          "401": {
            "$ref": "#/components/responses/401"
},
"403": {
"$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
},
"500": {
"$ref": "#/components/responses/500"
}
},
"security": [
{
"STABILITY_API_KEY": []
}
],
"x-codeSamples": [
{
"lang": "Python",
"source": "import base64\nimport os\nimport requests\n\nengine_id = \"stable-inpainting-512-v2-0\"\napi_host = os.getenv('API_HOST', 'https://api.stability.ai')\napi_key = os.getenv(\"STABILITY_API_KEY\")\n\nif api_key is None:\n raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.post(\n f\"{api_host}/v1/generation/{engine_id}/image-to-image/masking\",\n headers={\n \"Accept\": 'application/json',\n \"Authorization\": f\"Bearer {api_key}\"\n },\n files={\n 'init_image': open(\"../init_image.png\", 'rb'),\n 'mask_image': open(\"../mask_image_white.png\", 'rb'),\n },\n data={\n \"mask_source\": \"MASK_IMAGE_WHITE\",\n \"text_prompts[0][text]\": \"A large spiral galaxy with a bright central bulge and a ring of stars around it\",\n \"cfg_scale\": 7,\n \"clip_guidance_preset\": \"FAST_BLUE\",\n \"samples\": 1,\n \"steps\": 30,\n }\n)\n\nif response.status_code != 200:\n raise Exception(\"Non-200 response: \" + str(response.text))\n\ndata = response.json()\n\nfor i, image in enumerate(data[\"artifacts\"]):\n with open(f\"./out/v1_img2img_masking*{i}.png\", \"wb\") as f:\n f.write(base64.b64decode(image[\"base64\"]))\n"
},
{
"label": "TypeScript",
"lang": "Javascript",
"source": "import fetch from 'node-fetch'\nimport FormData from 'form-data'\nimport fs from 'node:fs'\n\nconst engineId = 'stable-inpainting-512-v2-0'\nconst apiHost = process.env.API*HOST ?? 'https://api.stability.ai'\nconst apiKey = process.env.STABILITY_API_KEY\n\nif (!apiKey) throw new Error('Missing Stability API key.')\n\n// NOTE: This example is using a NodeJS FormData library. Browser\n// implementations should use their native FormData class. React Native\n// implementations should also use their native FormData class.\nconst formData = new FormData()\nformData.append('init_image', fs.readFileSync('../init_image.png'))\nformData.append('mask_image', fs.readFileSync('../mask_image_white.png'))\nformData.append('mask_source', 'MASK_IMAGE_WHITE')\nformData.append(\n 'text_prompts[0][text]',\n 'A large spiral galaxy with a bright central bulge and a ring of stars around it'\n)\nformData.append('cfg_scale', '7')\nformData.append('clip_guidance_preset', 'FAST_BLUE')\nformData.append('samples', 1)\nformData.append('steps', 30)\n\nconst response = await fetch(\n `${apiHost}/v1/generation/${engineId}/image-to-image/masking`,\n {\n method: 'POST',\n headers: {\n ...formData.getHeaders(),\n Accept: 'application/json',\n Authorization: `Bearer ${apiKey}`,\n },\n body: formData,\n }\n)\n\nif (!response.ok) {\n throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface GenerationResponse {\n artifacts: Array<{\n base64: string\n seed: number\n finishReason: string\n }>\n}\n\nconst responseJSON = (await response.json()) as GenerationResponse\n\nresponseJSON.artifacts.forEach((image, index) => {\n fs.writeFileSync(\n `out/v1_img2img_masking*${index}.png`,\n    Buffer.from(image.base64, 'base64')\n  )\n})\n"
          },
          {
            "lang": "Go",
            "source": "package main\n\nimport (\n\t\"bytes\"\n\t\"encoding/base64\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"io\"\n\t\"mime/multipart\"\n\t\"net/http\"\n\t\"os\"\n)\n\ntype MaskingImage struct {\n\tBase64       string `json:\"base64\"`\n\tSeed         uint32 `json:\"seed\"`\n\tFinishReason string `json:\"finishReason\"`\n}\n\ntype MaskingResponse struct {\n\tImages []MaskingImage `json:\"artifacts\"`\n}\n\nfunc main() {\n\tengineId := \"stable-inpainting-512-v2-0\"\n\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/generation/\" + engineId + \"/image-to-image/masking\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\tdata := &bytes.Buffer{}\n\twriter := multipart.NewWriter(data)\n\n\t// Write the init image to the request\n\tinitImageWriter, _ := writer.CreateFormField(\"init_image\")\n\tinitImageFile, initImageErr := os.Open(\"../init_image.png\")\n\tif initImageErr != nil {\n\t\tpanic(\"Could not open init_image.png\")\n\t}\n\t_, _ = io.Copy(initImageWriter, initImageFile)\n\n\t// Write the mask image to the request\n\tmaskImageWriter, _ := writer.CreateFormField(\"mask_image\")\n\tmaskImageFile, maskImageErr := os.Open(\"../mask_image_white.png\")\n\tif maskImageErr != nil {\n\t\tpanic(\"Could not open mask_image_white.png\")\n\t}\n\t_, _ = io.Copy(maskImageWriter, maskImageFile)\n\n\t// Write the options to the request\n\t_ = writer.WriteField(\"mask_source\", \"MASK_IMAGE_WHITE\")\n\t_ = writer.WriteField(\"text_prompts[0][text]\", \"A large spiral galaxy with a bright central bulge and a ring of stars around it\")\n\t_ = writer.WriteField(\"cfg_scale\", \"7\")\n\t_ = writer.WriteField(\"clip_guidance_preset\", \"FAST_BLUE\")\n\t_ = writer.WriteField(\"samples\", \"1\")\n\t_ = writer.WriteField(\"steps\", \"30\")\n\twriter.Close()\n\n\t// Execute the request & read all the bytes of the response\n\tpayload := bytes.NewReader(data.Bytes())\n\treq, _ := http.NewRequest(\"POST\", reqUrl, payload)\n\treq.Header.Add(\"Content-Type\", writer.FormDataContentType())\n\treq.Header.Add(\"Accept\", \"application/json\")\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tif res.StatusCode != 200 {\n\t\tvar body map[string]interface{}\n\t\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t\tpanic(fmt.Sprintf(\"Non-200 response: %s\", body))\n\t}\n\n\t// Decode the JSON body\n\tvar body MaskingResponse\n\tif err := json.NewDecoder(res.Body).Decode(&body); err != nil {\n\t\tpanic(err)\n\t}\n\n\t// Write the images to disk\n\tfor i, image := range body.Images {\n\t\toutFile := fmt.Sprintf(\"./out/v1_img2img_masking_%d.png\", i)\n\t\tfile, err := os.Create(outFile)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\timageBytes, err := base64.StdEncoding.DecodeString(image.Base64)\n\t\tif err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif _, err := file.Write(imageBytes); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\n\t\tif err := file.Close(); err != nil {\n\t\t\tpanic(err)\n\t\t}\n\t}\n}\n"
          },
          {
            "lang": "cURL",
            "source": "#!/bin/sh\n\nset -e\n\nif [ -z \"$STABILITY*API_KEY\" ]; then\n echo \"STABILITY_API_KEY environment variable is not set\"\n exit 1\nfi\n\nOUTPUT_FILE=./out/v1_img2img_masking.png\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/generation/stable-inpainting-512-v2-0/image-to-image/masking\"\n\ncurl -f -sS -X POST \"$URL\" \\\n  -H 'Content-Type: multipart/form-data' \\\n  -H 'Accept: image/png' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\" \\\n  -F 'init_image=@\"../init_image.png\"' \\\n  -F 'mask_image=@\"../mask_image_white.png\"' \\\n  -F 'mask_source=MASK_IMAGE_WHITE' \\\n  -F 'text_prompts[0][text]=A large spiral galaxy with a bright central bulge and a ring of stars around it' \\\n  -F 'cfg_scale=7' \\\n  -F 'clip_guidance_preset=FAST_BLUE' \\\n  -F 'samples=1' \\\n  -F 'steps=30' \\\n  -o \"$OUTPUT_FILE\"\n"
}
]
}
},
"/v1/engines/list": {
"get": {
"description": "List all engines available to your organization/user",
"operationId": "listEngines",
"summary": "list",
"tags": [
"v1/engines"
],
"parameters": [
{
"$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
},
{
"$ref": "#/components/parameters/stabilityClientVersion"
}
],
"responses": {
"200": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/ListEnginesResponseBody"
                }
              }
            },
            "description": "OK response."
          },
          "401": {
            "$ref": "#/components/responses/401"
},
"500": {
"$ref": "#/components/responses/500"
          }
        },
        "security": [
          {
            "STABILITY_API_KEY": []
          }
        ],
        "x-codeSamples": [
          {
            "lang": "Python",
            "source": "import os\nimport requests\n\napi_host = os.getenv('API_HOST', 'https://api.stability.ai')\nurl = f\"{api_host}/v1/engines/list\"\n\napi_key = os.getenv(\"STABILITY_API_KEY\")\nif api_key is None:\n    raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.get(url, headers={\n    \"Authorization\": f\"Bearer {api_key}\"\n})\n\nif response.status_code != 200:\n    raise Exception(\"Non-200 response: \" + str(response.text))\n\n# Do something with the payload...\npayload = response.json()\n\n"
          },
          {
            "label": "TypeScript",
            "lang": "Javascript",
            "source": "import fetch from 'node-fetch'\n\nconst apiHost = process.env.API_HOST ?? 'https://api.stability.ai'\nconst url = `${apiHost}/v1/engines/list`\n\nconst apiKey = process.env.STABILITY_API_KEY\nif (!apiKey) throw new Error('Missing Stability API key.')\n\nconst response = await fetch(url, {\n  method: 'GET',\n  headers: {\n    Authorization: `Bearer ${apiKey}`,\n  },\n})\n\nif (!response.ok) {\n  throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface Payload {\n engines: Array<{\n id: string\n name: string\n description: string\n type: string\n }>\n}\n\n// Do something with the payload...\nconst payload = (await response.json()) as Payload\n"
},
{
"lang": "Go",
"source": "package main\n\nimport (\n\t\"io\"\n\t\"net/http\"\n\t\"os\"\n)\n\nfunc main() {\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/engines/list\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\t// Execute the request & read all the bytes of the response\n\treq, * := http.NewRequest(\"GET\", reqUrl, nil)\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\tbody, _ := io.ReadAll(res.Body)\n\n\tif res.StatusCode != 200 {\n\t\tpanic(\"Non-200 response: \" + string(body))\n\t}\n\n\t// Do something with the payload...\n\t// payload := string(body)\n}\n"
},
{
"lang": "cURL",
"source": "if [ -z \"$STABILITY_API_KEY\" ]; then\n echo \"STABILITY*API_KEY environment variable is not set\"\n exit 1\nfi\n\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/engines/list\"\n\ncurl -f -sS \"$URL\" \\\n  -H 'Accept: application/json' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\"\n"
          }
        ]
      }
    },
    "/v1/user/account": {
      "get": {
        "description": "Get information about the account associated with the provided API key",
        "operationId": "userAccount",
        "summary": "account",
        "tags": [
          "v1/user"
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AccountResponseBody"
}
}
},
"description": "OK response."
},
"401": {
"$ref": "#/components/responses/401"
          },
          "500": {
            "$ref": "#/components/responses/500"
}
},
"security": [
{
"STABILITY_API_KEY": []
}
],
"x-codeSamples": [
{
"lang": "Python",
"source": "import os\nimport requests\n\napi_host = os.getenv('API_HOST', 'https://api.stability.ai')\nurl = f\"{api_host}/v1/user/account\"\n\napi_key = os.getenv(\"STABILITY_API_KEY\")\nif api_key is None:\n raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.get(url, headers={\n \"Authorization\": f\"Bearer {api_key}\"\n})\n\nif response.status_code != 200:\n raise Exception(\"Non-200 response: \" + str(response.text))\n\n# Do something with the payload...\npayload = response.json()\n\n"
},
{
"label": "TypeScript",
"lang": "Javascript",
"source": "import fetch from 'node-fetch'\n\nconst apiHost = process.env.API_HOST ?? 'https://api.stability.ai'\nconst url = `${apiHost}/v1/user/account`\n\nconst apiKey = process.env.STABILITY_API_KEY\nif (!apiKey) throw new Error('Missing Stability API key.')\n\nconst response = await fetch(url, {\n method: 'GET',\n headers: {\n Authorization: `Bearer ${apiKey}`,\n },\n})\n\nif (!response.ok) {\n throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface User {\n id: string\n profile_picture: string\n email: string\n organizations?: Array<{\n id: string\n name: string\n role: string\n is_default: boolean\n }>\n}\n\n// Do something with the user...\nconst user = (await response.json()) as User\n"
},
{
"lang": "Go",
"source": "package main\n\nimport (\n\t\"io\"\n\t\"net/http\"\n\t\"os\"\n)\n\nfunc main() {\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/user/account\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\t// Build the request\n\treq, * := http.NewRequest(\"GET\", reqUrl, nil)\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\n\t// Execute the request\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\tbody, _ := io.ReadAll(res.Body)\n\n\tif res.StatusCode != 200 {\n\t\tpanic(\"Non-200 response: \" + string(body))\n\t}\n\n\t// Do something with the payload...\n\t// payload := string(body)\n}\n"
},
{
"lang": "cURL",
"source": "if [ -z \"$STABILITY_API_KEY\" ]; then\n echo \"STABILITY*API_KEY environment variable is not set\"\n exit 1\nfi\n\n# Determine the URL to use for the request\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/user/account\"\n\ncurl -f -sS \"$URL\" \\\n  -H 'Accept: application/json' \\\n  -H \"Authorization: Bearer $STABILITY_API_KEY\"\n"
          }
        ]
      }
    },
    "/v1/user/balance": {
      "get": {
        "description": "Get the credit balance of the account/organization associated with the API key",
        "operationId": "userBalance",
        "summary": "balance",
        "tags": [
          "v1/user"
        ],
        "parameters": [
          {
            "$ref": "#/components/parameters/organization"
},
{
"$ref": "#/components/parameters/stabilityClientID"
          },
          {
            "$ref": "#/components/parameters/stabilityClientVersion"
}
],
"responses": {
"200": {
"content": {
"application/json": {
"example": {
"credits": 0.6336833840314097
},
"schema": {
"$ref": "#/components/schemas/BalanceResponseBody"
                }
              }
            },
            "description": "OK response."
          },
          "401": {
            "$ref": "#/components/responses/401"
},
"500": {
"$ref": "#/components/responses/500"
          }
        },
        "security": [
          {
            "STABILITY_API_KEY": []
          }
        ],
        "x-codeSamples": [
          {
            "lang": "Python",
            "source": "import os\nimport requests\n\napi_host = os.getenv('API_HOST', 'https://api.stability.ai')\nurl = f\"{api_host}/v1/user/balance\"\n\napi_key = os.getenv(\"STABILITY_API_KEY\")\nif api_key is None:\n    raise Exception(\"Missing Stability API key.\")\n\nresponse = requests.get(url, headers={\n    \"Authorization\": f\"Bearer {api_key}\"\n})\n\nif response.status_code != 200:\n    raise Exception(\"Non-200 response: \" + str(response.text))\n\n# Do something with the payload...\npayload = response.json()\n\n"
          },
          {
            "label": "TypeScript",
            "lang": "Javascript",
            "source": "import fetch from 'node-fetch'\n\nconst apiHost = process.env.API_HOST ?? 'https://api.stability.ai'\nconst url = `${apiHost}/v1/user/balance`\n\nconst apiKey = process.env.STABILITY_API_KEY\nif (!apiKey) throw new Error('Missing Stability API key.')\n\nconst response = await fetch(url, {\n  method: 'GET',\n  headers: {\n    Authorization: `Bearer ${apiKey}`,\n  },\n})\n\nif (!response.ok) {\n  throw new Error(`Non-200 response: ${await response.text()}`)\n}\n\ninterface Balance {\n credits: number\n}\n\n// Do something with the balance...\nconst balance = (await response.json()) as Balance\n"
},
{
"lang": "Go",
"source": "package main\n\nimport (\n\t\"io\"\n\t\"net/http\"\n\t\"os\"\n)\n\nfunc main() {\n\t// Build REST endpoint URL\n\tapiHost, hasApiHost := os.LookupEnv(\"API_HOST\")\n\tif !hasApiHost {\n\t\tapiHost = \"https://api.stability.ai\"\n\t}\n\treqUrl := apiHost + \"/v1/user/balance\"\n\n\t// Acquire an API key from the environment\n\tapiKey, hasAPIKey := os.LookupEnv(\"STABILITY_API_KEY\")\n\tif !hasAPIKey {\n\t\tpanic(\"Missing STABILITY_API_KEY environment variable\")\n\t}\n\n\t// Build the request\n\treq, * := http.NewRequest(\"GET\", reqUrl, nil)\n\treq.Header.Add(\"Authorization\", \"Bearer \"+apiKey)\n\n\t// Execute the request\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\tbody, _ := io.ReadAll(res.Body)\n\n\tif res.StatusCode != 200 {\n\t\tpanic(\"Non-200 response: \" + string(body))\n\t}\n\n\t// Do something with the payload...\n\t// payload := string(body)\n}\n"
},
{
"lang": "cURL",
"source": "if [ -z \"$STABILITY_API_KEY\" ]; then\n echo \"STABILITY*API_KEY environment variable is not set\"\n exit 1\nfi\n\n# Determine the URL to use for the request\nBASE_URL=${API_HOST:-https://api.stability.ai}\nURL=\"$BASE_URL/v1/user/balance\"\n\ncurl -f -sS \"$URL\" \\\n -H 'Content-Type: application/json' \\\n -H \"Authorization: Bearer $STABILITY_API_KEY\"\n"
}
]
}
}
},
"components": {
"schemas": {
"Engine": {
"type": "object",
"properties": {
"description": {
"type": "string"
},
"id": {
"type": "string",
"x-go-name": "ID",
"description": "Unique identifier for the engine",
"example": "stable-diffusion-v1-5"
},
"name": {
"type": "string",
"description": "Name of the engine",
"example": "Stable Diffusion v1.5"
},
"type": {
"type": "string",
"description": "The type of content this engine produces",
"example": "PICTURE",
"enum": [
"AUDIO",
"CLASSIFICATION",
"PICTURE",
"STORAGE",
"TEXT",
"VIDEO"
]
}
},
"required": [
"id",
"name",
"description",
"type"
]
},
"Error": {
"type": "object",
"x-go-name": "RESTError",
"properties": {
"id": {
"x-go-name": "ID",
"type": "string",
"description": "A unique identifier for this particular occurrence of the problem.",
"example": "296a972f-666a-44a1-a3df-c9c28a1f56c0"
},
"name": {
"type": "string",
"description": "The short-name of this class of errors e.g. `bad_request`.",
"example": "bad_request"
},
"message": {
"type": "string",
"description": "A human-readable explanation specific to this occurrence of the problem.",
"example": "Header parameter Authorization is required, but not found"
}
},
"required": [
"name",
"id",
"message",
"status"
]
},
"CfgScale": {
"type": "number",
"description": "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
"default": 7,
"example": 7,
"minimum": 0,
"maximum": 35
},
"ClipGuidancePreset": {
"type": "string",
"default": "NONE",
"example": "FAST_BLUE",
"enum": [
"FAST_BLUE",
"FAST_GREEN",
"NONE",
"SIMPLE",
"SLOW",
"SLOWER",
"SLOWEST"
]
},
"UpscaleImageHeight": {
"x-go-type": "uint64",
"type": "integer",
"description": "Desired height of the output image. Only one of `width` or `height` may be specified.",
"minimum": 512
},
"UpscaleImageWidth": {
"x-go-type": "uint64",
"type": "integer",
"description": "Desired width of the output image. Only one of `width` or `height` may be specified.",
"minimum": 512
},
"DiffuseImageHeight": {
"x-go-type": "uint64",
"type": "integer",
"description": "Height of the image in pixels. Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width`≤ 1,048,576\n- For 768 engines: 589,824 ≤`height _ width`≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as`width`is not greater than 512. If`width` is greater than 512 then this can be \_at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
"multipleOf": 64,
"default": 512,
"example": 512,
"minimum": 128
},
"DiffuseImageWidth": {
"x-go-type": "uint64",
"type": "integer",
"description": "Width of the image in pixels. Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576\n- For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as `height` is not greater than 512. If `height` is greater than 512 then this can be _at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
"multipleOf": 64,
"default": 512,
"example": 512,
"minimum": 128
},
"Sampler": {
"type": "string",
"description": "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
"example": "K*DPM_2_ANCESTRAL",
"enum": [
"DDIM",
"DDPM",
"K_DPMPP_2M",
"K_DPMPP_2S_ANCESTRAL",
"K_DPM_2",
"K_DPM_2_ANCESTRAL",
"K_EULER",
"K_EULER_ANCESTRAL",
"K_HEUN",
"K_LMS"
]
},
"Samples": {
"x-go-type": "uint64",
"type": "integer",
"description": "Number of images to generate",
"default": 1,
"example": 1,
"minimum": 1,
"maximum": 10
},
"Seed": {
"type": "integer",
"x-go-type": "uint32",
"description": "Random noise seed (omit this option or use `0` for a random seed)",
"default": 0,
"example": 0,
"minimum": 0,
"maximum": 4294967295
},
"Steps": {
"x-go-type": "uint64",
"type": "integer",
"description": "Number of diffusion steps to run",
"default": 50,
"example": 75,
"minimum": 10,
"maximum": 150
},
"Extras": {
"type": "object",
"description": "Extra parameters passed to the engine.\nThese parameters are used for in-development or experimental features and may change\nwithout warning, so please use with caution."
},
"StylePreset": {
"type": "string",
"enum": [
"enhance",
"anime",
"photographic",
"digital-art",
"comic-book",
"fantasy-art",
"line-art",
"analog-film",
"neon-punk",
"isometric",
"low-poly",
"origami",
"modeling-compound",
"cinematic",
"3d-model",
"pixel-art",
"tile-texture"
],
"description": "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change."
},
"TextPrompt": {
"type": "object",
"properties": {
"text": {
"type": "string",
"description": "The prompt itself",
"example": "A lighthouse on a cliff",
"maxLength": 2000
},
"weight": {
"type": "number",
"description": "Weight of the prompt (use negative numbers for negative prompts)",
"example": 0.8167237,
"format": "float"
}
},
"description": "Text prompt for image generation",
"required": [
"text"
]
},
"TextPromptsForTextToImage": {
"title": "TextPrompts",
"type": "array",
"items": {
"$ref": "#/components/schemas/TextPrompt"
        },
        "minItems": 1,
        "description": "An array of text prompts to use for generation.\n\nGiven a text prompt with the text `A lighthouse on a cliff` and a weight of `0.5`, it would be represented as:\n\n```\n\"text_prompts\": [\n  {\n    \"text\": \"A lighthouse on a cliff\",\n    \"weight\": 0.5\n  }\n]\n```"
      },
      "TextPrompts": {
        "description": "An array of text prompts to use for generation.\n\nDue to how arrays are represented in `multipart/form-data` requests, prompts must adhere to the format `text_prompts[index][text|weight]`,\nwhere `index` is some integer used to tie the text and weight together.  While `index` does not have to be sequential, duplicate entries \nwill override previous entries, so it is recommended to use sequential indices.\n\nGiven a text prompt with the text `A lighthouse on a cliff` and a weight of `0.5`, it would be represented as:\n```\ntext_prompts[0][text]: \"A lighthouse on a cliff\"\ntext_prompts[0][weight]: 0.5\n```\n\nTo add another prompt to that request simply provide the values under a new `index`:\n\n```\ntext_prompts[0][text]: \"A lighthouse on a cliff\"\ntext_prompts[0][weight]: 0.5\ntext_prompts[1][text]: \"land, ground, dirt, grass\"\ntext_prompts[1][weight]: -0.9\n```",
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/TextPrompt"
},
"minItems": 1
},
"InputImage": {
"x-go-type": "[]byte",
"type": "string",
"example": "<image binary>",
"format": "binary"
},
"InitImage": {
"x-go-type": "[]byte",
"type": "string",
"description": "Image used to initialize the diffusion process, in lieu of random noise.",
"example": "<image binary>",
"format": "binary"
},
"InitImageStrength": {
"type": "number",
"description": "How much influence the `init_image` has on the diffusion process. Values close to `1` will yield images very similar to the `init_image` while values close to `0` will yield images wildly different than the `init_image`. The behavior of this is meant to mirror DreamStudio's \"Image Strength\" slider. <br/> <br/> This parameter is just an alternate way to set `step_schedule_start`, which is done via the calculation `1 - image_strength`. For example, passing in an Image Strength of 35% (`0.35`) would result in a `step_schedule_start` of `0.65`.\n",
"example": 0.4,
"minimum": 0,
"maximum": 1,
"format": "float",
"default": 0.35
},
"InitImageMode": {
"type": "string",
"description": "Whether to use `image_strength` or `step_schedule*_`to control how much influence the`init_image`has on the result.",
        "enum": [
          "IMAGE_STRENGTH",
          "STEP_SCHEDULE"
        ],
        "default": "IMAGE_STRENGTH"
      },
      "StepScheduleStart": {
        "type": "number",
        "description": "Skips a proportion of the start of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.  (e.g. a value of`0`would simply return you the init_image, where a value of`1`would return you a completely different image.)",
        "default": 0.65,
        "example": 0.4,
        "minimum": 0,
        "maximum": 1
      },
      "StepScheduleEnd": {
        "type": "number",
        "description": "Skips a proportion of the end of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.",
        "example": 0.01,
        "minimum": 0,
        "maximum": 1
      },
      "MaskImage": {
        "x-go-type": "[]byte",
        "type": "string",
        "description": "Optional grayscale mask that allows for influence over which pixels are eligible for diffusion and at what strength. Must be the same dimensions as the`init_image`. Use the `mask_source`option to specify whether the white or black pixels should be inpainted.",
        "example": "<image binary>",
        "format": "binary"
      },
      "MaskSource": {
        "type": "string",
        "description": "For any given pixel, the mask determines the strength of generation on a linear scale.  This parameter determines where to source the mask from:\n-`MASK_IMAGE_WHITE`will use the white pixels of the mask_image as the mask, where white pixels are completely replaced and black pixels are unchanged\n-`MASK_IMAGE_BLACK`will use the black pixels of the mask_image as the mask, where black pixels are completely replaced and white pixels are unchanged\n-`INIT_IMAGE_ALPHA`will use the alpha channel of the init_image as the mask, where fully transparent pixels are completely replaced and fully opaque pixels are unchanged"
      },
      "GenerationRequestOptionalParams": {
        "type": "object",
        "description": "Represents the optional parameters that can be passed to any generation request.",
        "properties": {
          "cfg_scale": {
            "$ref": "#/components/schemas/CfgScale"
          },
          "clip_guidance_preset": {
            "$ref": "#/components/schemas/ClipGuidancePreset"
          },
          "sampler": {
            "$ref": "#/components/schemas/Sampler"
          },
          "samples": {
            "$ref": "#/components/schemas/Samples"
          },
          "seed": {
            "$ref": "#/components/schemas/Seed"
          },
          "steps": {
            "$ref": "#/components/schemas/Steps"
          },
          "style_preset": {
            "$ref": "#/components/schemas/StylePreset"
          },
          "extras": {
            "$ref": "#/components/schemas/Extras"
          }
        }
      },
      "RealESRGANUpscaleRequestBody": {
        "type": "object",
        "properties": {
          "image": {
            "$ref": "#/components/schemas/InputImage"
          },
          "width": {
            "$ref": "#/components/schemas/UpscaleImageWidth"
          },
          "height": {
            "$ref": "#/components/schemas/UpscaleImageHeight"
          }
        },
        "required": [
          "image"
        ]
      },
      "LatentUpscalerUpscaleRequestBody": {
        "type": "object",
        "properties": {
          "image": {
            "$ref": "#/components/schemas/InputImage"
          },
          "width": {
            "$ref": "#/components/schemas/UpscaleImageWidth"
          },
          "height": {
            "$ref": "#/components/schemas/UpscaleImageHeight"
          },
          "text_prompts": {
            "$ref": "#/components/schemas/TextPrompts"
          },
          "seed": {
            "$ref": "#/components/schemas/Seed"
          },
          "steps": {
            "$ref": "#/components/schemas/Steps"
          },
          "cfg_scale": {
            "$ref": "#/components/schemas/CfgScale"
          }
        },
        "required": [
          "image"
        ]
      },
      "ImageToImageRequestBody": {
        "type": "object",
        "properties": {
          "text_prompts": {
            "$ref": "#/components/schemas/TextPrompts"
          },
          "init_image": {
            "$ref": "#/components/schemas/InitImage"
          },
          "init_image_mode": {
            "$ref": "#/components/schemas/InitImageMode"
          },
          "image_strength": {
            "$ref": "#/components/schemas/InitImageStrength"
          },
          "step_schedule_start": {
            "$ref": "#/components/schemas/StepScheduleStart"
          },
          "step_schedule_end": {
            "$ref": "#/components/schemas/StepScheduleEnd"
          },
          "cfg_scale": {
            "$ref": "#/components/schemas/CfgScale"
          },
          "clip_guidance_preset": {
            "$ref": "#/components/schemas/ClipGuidancePreset"
          },
          "sampler": {
            "$ref": "#/components/schemas/Sampler"
          },
          "samples": {
            "$ref": "#/components/schemas/Samples"
          },
          "seed": {
            "$ref": "#/components/schemas/Seed"
          },
          "steps": {
            "$ref": "#/components/schemas/Steps"
          },
          "style_preset": {
            "$ref": "#/components/schemas/StylePreset"
          },
          "extras": {
            "$ref": "#/components/schemas/Extras"
          }
        },
        "required": [
          "text_prompts",
          "init_image"
        ],
        "discriminator": {
          "propertyName": "init_image_mode",
          "mapping": {
            "IMAGE_STRENGTH": "#/components/schemas/ImageToImageUsingImageStrengthRequestBody",
            "STEP_SCHEDULE": "#/components/schemas/ImageToImageUsingStepScheduleRequestBody"
          }
        }
      },
      "ImageToImageUsingImageStrengthRequestBody": {
        "allOf": [
          {
            "type": "object",
            "properties": {
              "text_prompts": {
                "$ref": "#/components/schemas/TextPrompts"
              },
              "init_image": {
                "$ref": "#/components/schemas/InitImage"
              },
              "init_image_mode": {
                "$ref": "#/components/schemas/InitImageMode"
              },
              "image_strength": {
                "$ref": "#/components/schemas/InitImageStrength"
              }
            },
            "required": [
              "text_prompts",
              "init_image"
            ]
          },
          {
            "$ref": "#/components/schemas/GenerationRequestOptionalParams"
          }
        ]
      },
      "ImageToImageUsingStepScheduleRequestBody": {
        "allOf": [
          {
            "type": "object",
            "properties": {
              "text_prompts": {
                "$ref": "#/components/schemas/TextPrompts"
              },
              "init_image": {
                "$ref": "#/components/schemas/InitImage"
              },
              "init_image_mode": {
                "$ref": "#/components/schemas/InitImageMode"
              },
              "step_schedule_start": {
                "$ref": "#/components/schemas/StepScheduleStart"
              },
              "step_schedule_end": {
                "$ref": "#/components/schemas/StepScheduleEnd"
              }
            },
            "required": [
              "text_prompts",
              "init_image"
            ]
          },
          {
            "$ref": "#/components/schemas/GenerationRequestOptionalParams"
          }
        ]
      },
      "MaskingRequestBody": {
        "type": "object",
        "properties": {
          "init_image": {
            "$ref": "#/components/schemas/InitImage"
          },
          "mask_source": {
            "$ref": "#/components/schemas/MaskSource"
          },
          "mask_image": {
            "$ref": "#/components/schemas/MaskImage"
          },
          "text_prompts": {
            "$ref": "#/components/schemas/TextPrompts"
          },
          "cfg_scale": {
            "$ref": "#/components/schemas/CfgScale"
          },
          "clip_guidance_preset": {
            "$ref": "#/components/schemas/ClipGuidancePreset"
          },
          "sampler": {
            "$ref": "#/components/schemas/Sampler"
          },
          "samples": {
            "$ref": "#/components/schemas/Samples"
          },
          "seed": {
            "$ref": "#/components/schemas/Seed"
          },
          "steps": {
            "$ref": "#/components/schemas/Steps"
          },
          "style_preset": {
            "$ref": "#/components/schemas/StylePreset"
          },
          "extras": {
            "$ref": "#/components/schemas/Extras"
          }
        },
        "required": [
          "text_prompts",
          "init_image",
          "mask_source"
        ],
        "discriminator": {
          "propertyName": "mask_source",
          "mapping": {
            "MASK_IMAGE_BLACK": "#/components/schemas/MaskingUsingMaskImageRequestBody",
            "MASK_IMAGE_WHITE": "#/components/schemas/MaskingUsingMaskImageRequestBody",
            "INIT_IMAGE_ALPHA": "#/components/schemas/MaskingUsingInitImageAlphaRequestBody"
          }
        }
      },
      "MaskingUsingMaskImageRequestBody": {
        "allOf": [
          {
            "type": "object",
            "properties": {
              "text_prompts": {
                "$ref": "#/components/schemas/TextPrompts"
              },
              "init_image": {
                "$ref": "#/components/schemas/InitImage"
              },
              "mask_source": {
                "$ref": "#/components/schemas/MaskSource"
              },
              "mask_image": {
                "$ref": "#/components/schemas/MaskImage"
              }
            },
            "required": [
              "init_image",
              "mask_image",
              "text_prompts",
              "mask_source"
            ]
          },
          {
            "$ref": "#/components/schemas/GenerationRequestOptionalParams"
          }
        ]
      },
      "MaskingUsingInitImageAlphaRequestBody": {
        "allOf": [
          {
            "type": "object",
            "properties": {
              "text_prompts": {
                "$ref": "#/components/schemas/TextPrompts"
              },
              "init_image": {
                "$ref": "#/components/schemas/InitImage"
              },
              "mask_source": {
                "$ref": "#/components/schemas/MaskSource"
              }
            },
            "required": [
              "init_image",
              "text_prompts",
              "mask_source"
            ]
          },
          {
            "$ref": "#/components/schemas/GenerationRequestOptionalParams"
          }
        ]
      },
      "TextToImageRequestBody": {
        "type": "object",
        "allOf": [
          {
            "type": "object",
            "properties": {
              "height": {
                "$ref": "#/components/schemas/DiffuseImageHeight"
              },
              "width": {
                "$ref": "#/components/schemas/DiffuseImageWidth"
              },
              "text_prompts": {
                "$ref": "#/components/schemas/TextPromptsForTextToImage"
              }
            },
            "required": [
              "text_prompts"
            ]
          },
          {
            "$ref": "#/components/schemas/GenerationRequestOptionalParams"
          }
        ],
        "example": {
          "cfg_scale": 7,
          "clip_guidance_preset": "FAST_BLUE",
          "height": 512,
          "sampler": "K_DPM_2_ANCESTRAL",
          "samples": 1,
          "seed": 0,
          "steps": 75,
          "text_prompts": [
            {
              "text": "A lighthouse on a cliff",
              "weight": 1
            }
          ],
          "width": 512
        },
        "required": [
          "text_prompts"
        ]
      },
      "AccountResponseBody": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "description": "The user's email",
            "example": "example@stability.ai",
            "format": "email"
          },
          "id": {
            "type": "string",
            "description": "The user's ID",
            "example": "user-1234",
            "x-go-name": "ID"
          },
          "organizations": {
            "type": "array",
            "example": [
              {
                "id": "org-5678",
                "name": "Another Organization",
                "role": "MEMBER",
                "is_default": true
              },
              {
                "id": "org-1234",
                "name": "My Organization",
                "role": "MEMBER",
                "is_default": false
              }
            ],
            "items": {
              "$ref": "#/components/schemas/OrganizationMembership"
            },
            "description": "The user's organizations"
          },
          "profile_picture": {
            "type": "string",
            "description": "The user's profile picture",
            "example": "https://api.stability.ai/example.png",
            "format": "uri"
          }
        },
        "required": [
          "id",
          "email",
          "organizations"
        ]
      },
      "BalanceResponseBody": {
        "type": "object",
        "properties": {
          "credits": {
            "type": "number",
            "description": "The balance of the account/organization associated with the API key",
            "example": 0.41122252265928866,
            "format": "double"
          }
        },
        "example": {
          "credits": 0.07903292496944721
        },
        "required": [
          "credits"
        ]
      },
      "ListEnginesResponseBody": {
        "type": "array",
        "description": "The engines available to your user/organization",
        "items": {
          "$ref": "#/components/schemas/Engine"
        },
        "example": [
          {
            "description": "Stability-AI Stable Diffusion XL v1.0",
            "id": "stable-diffusion-xl-1024-v1-0",
            "name": "Stable Diffusion XL v1.0",
            "type": "PICTURE"
          },
          {
            "description": "Stability-AI Stable Diffusion XL v0.9",
            "id": "stable-diffusion-xl-1024-v0-9",
            "name": "Stable Diffusion XL v0.9",
            "type": "PICTURE"
          },
          {
            "description": "Stability-AI Stable Diffusion XL Beta v2.2.2",
            "id": "stable-diffusion-xl-beta-v2-2-2",
            "name": "Stable Diffusion v2.2.2-XL Beta",
            "type": "PICTURE"
          },
          {
            "description": "Stability-AI Stable Diffusion v2.1",
            "id": "stable-diffusion-512-v2-1",
            "name": "Stable Diffusion v2.1",
            "type": "PICTURE"
          },
          {
            "description": "Stability-AI Stable Diffusion 768 v2.1",
            "id": "stable-diffusion-768-v2-1",
            "name": "Stable Diffusion v2.1-768",
            "type": "PICTURE"
          },
          {
            "description": "Stability-AI Stable Diffusion v1.5",
            "id": "stable-diffusion-v1-5",
            "name": "Stable Diffusion v1.5",
            "type": "PICTURE"
          }
        ]
      },
      "FinishReason": {
        "type": "string",
        "description": "The result of the generation process.\n-`SUCCESS`indicates success\n-`ERROR`indicates an error\n-`CONTENT_FILTERED`indicates the result affected by the content filter and may be blurred.\n\nThis header is only present when the`Accept`is set to`image/png`.  Otherwise it is returned in the response body.",
        "enum": [
          "SUCCESS",
          "ERROR",
          "CONTENT_FILTERED"
        ]
      },
      "Image": {
        "type": "object",
        "properties": {
          "base64": {
            "type": "string",
            "description": "Image encoded in base64",
            "example": "Sed corporis modi et."
          },
          "finishReason": {
            "type": "string",
            "example": "CONTENT_FILTERED",
            "enum": [
              "SUCCESS",
              "ERROR",
              "CONTENT_FILTERED"
            ]
          },
          "seed": {
            "type": "number",
            "description": "The seed associated with this image",
            "example": 1229191277
          }
        },
        "example": [
          {
            "base64": "...very long string...",
            "finishReason": "SUCCESS",
            "seed": 1050625087
          },
          {
            "base64": "...very long string...",
            "finishReason": "CONTENT_FILTERED",
            "seed": 1229191277
          }
        ]
      },
      "OrganizationMembership": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "org-123456",
            "x-go-name": "ID"
          },
          "is_default": {
            "type": "boolean",
            "example": false
          },
          "name": {
            "type": "string",
            "example": "My Organization"
          },
          "role": {
            "type": "string",
            "example": "MEMBER"
          }
        },
        "required": [
          "id",
          "name",
          "role",
          "is_default"
        ]
      }
    },
    "responses": {
      "401": {
        "description": "unauthorized: API key missing or invalid",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "9160aa70-222f-4a36-9eb7-475e2668362a",
              "name": "unauthorized",
              "message": "missing authorization header"
            }
          }
        }
      },
      "403": {
        "description": "permission_denied: You lack the necessary permissions to perform this action",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "5cf19777-d17f-49fe-9bd9-39ff0ec6bb50",
              "name": "permission_denied",
              "message": "You do not have permission to access this resource"
            }
          }
        }
      },
      "404": {
        "description": "not_found: The requested resource was not found (e.g. specifing a model that does not exist)",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "92b19e7f-22a2-4e71-a821-90edda229293",
              "name": "not_found",
              "message": "The specified engine (ID some-fake-engine) was not found."
            }
          }
        }
      },
      "500": {
        "description": "server_error: Some unexpected server error occurred",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "f81964d6-619b-453e-97bc-9fd7ac3f04e7",
              "name": "server_error",
              "message": "An unexpected server error occurred, please try again."
            }
          }
        }
      },
      "400FromGeneration": {
        "description": "General error for invalid parameters, see below for specific errors.\n  - bad_request: one or more provided parameters are invalid (see error description for details)\n  - invalid_samples: Sample count may only be greater than 1 when the accept header is set to `application/json`\n  - invalid_height_or_width: Height and width must be specified in increments of 64\n  - invalid_file_size: The file size of one or more of the provided files is invalid\n  - invalid_mime_type: The mime type of one or more of the provided files is invalid\n  - invalid_image_dimensions: The dimensions of the provided `init_image`and`mask_image`do not match\n  - invalid_mask_image: The parameter`mask_source`was set to`MASK_IMAGE_WHITE`or`MASK_IMAGE_BLACK`but no`mask_image`was provided\n  - invalid_prompts: One or more of the prompts contains filtered words\n  - invalid_pixel_count: Incorrect number of pixels specified. Requirements:\n    - For 512 engines: 262,144 ≤`height _ width`≤ 1,048,576\n    - For 768 engines: 589,824 ≤`height \* width`≤ 1,048,576\n  - invalid_sdxl_v222_dimensions: Incorrect dimensions specified for SDXL v2-2-2 engine. Requirements:\n    - Neither`height`nor`width`may be below 128\n    - Only one of`height`or`width`may be above 512 (e.g. 512x768 is valid but 578x768 is not)\n    - Maximum dimensions supported are 512x896 or 896x512          \n  - invalid_sdxl_v1_dimensions: Incorrect dimensions specified for SDXL v0.9 or v1.0 engine. Valid dimensions:\n    - 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "296a972f-666a-44a1-a3df-c9c28a1f56c0",
              "name": "bad_request",
              "message": "init_image: is required"
            }
          }
        }
      },
      "400FromUpscale": {
        "description": "General error for invalid parameters, see below for specific errors.\n\n  - bad_request: one or more provided parameters are invalid (see error description for details)\n  - invalid_file_size: The file size of one or more of the provided files is invalid\n  - invalid_mime_type: The mime type of one or more of the provided files is invalid\n  - invalid_pixel_count: The requested image would exceed the maximum pixel count of 4,194,304",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "id": "296a972f-666a-44a1-a3df-c9c28a1f56c0",
              "name": "bad_request",
              "message": "image: is required"
            }
          }
        }
      }
    },
    "parameters": {
      "upscaleEngineID": {
        "in": "path",
        "name": "engine_id",
        "required": true,
        "schema": {
          "type": "string"
        },
        "examples": {
          "ESRGAN_X2_PLUS": {
            "description": "ESRGAN x2 Upscaler",
            "value": "esrgan-v1-x2plus"
          },
          "LATENT_UPSCALER_X4": {
            "description": "Stable Diffusion x4 Latent Upscaler",
            "value": "stable-diffusion-x4-latent-upscaler"
          }
        }
      },
      "engineID": {
        "example": "stable-diffusion-v1-5",
        "in": "path",
        "name": "engine_id",
        "required": true,
        "schema": {
          "example": "stable-diffusion-v1-5",
          "type": "string"
        }
      },
      "organization": {
        "allowEmptyValue": false,
        "description": "Allows for requests to be scoped to an organization other than the user's default.  If not provided, the user's default organization will be used.",
        "example": "org-123456",
        "in": "header",
        "name": "Organization",
        "x-go-name": "OrganizationID",
        "schema": {
          "type": "string"
        }
      },
      "stabilityClientID": {
        "allowEmptyValue": false,
        "description": "Used to identify the source of requests, such as the client application or sub-organization. Optional, but recommended for organizational clarity.",
        "example": "my-great-plugin",
        "in": "header",
        "name": "Stability-Client-ID",
        "schema": {
          "type": "string"
        }
      },
      "stabilityClientVersion": {
        "allowEmptyValue": false,
        "description": "Used to identify the version of the application or service making the requests. Optional, but recommended for organizational clarity.",
        "example": "1.2.1",
        "in": "header",
        "name": "Stability-Client-Version",
        "schema": {
          "type": "string"
        }
      },
      "accept": {
        "allowEmptyValue": false,
        "in": "header",
        "name": "Accept",
        "description": "The format of the response.  Leave blank for JSON, or set to 'image/png' for a PNG image.",
        "schema": {
          "default": "application/json",
          "enum": [
            "application/json",
            "image/png"
          ],
          "type": "string"
        }
      }
    },
    "headers": {
      "Content-Length": {
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      "Content-Type": {
        "required": true,
        "schema": {
          "enum": [
            "application/json",
            "image/png"
          ],
          "type": "string"
        }
      },
      "Finish-Reason": {
        "schema": {
          "$ref": "#/components/schemas/FinishReason"
        }
      },
      "Seed": {
        "example": 3817857576,
        "schema": {
          "example": 787078103,
          "type": "integer"
        },
        "description": "The seed used to generate the image.  This header is only present when the`Accept`is set to`image/png`. Otherwise it is returned in the response body."
}
},
"securitySchemes": {
"STABILITY_API_KEY": {
"type": "apiKey",
"name": "Authorization",
"in": "header"
}
}
}
}
