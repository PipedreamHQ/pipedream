"use client"

import CodePanel from "../CodePanel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserAccounts, serverConnectTokenCreate, makeAppRequest, getTestRequest } from "../server"

export default function Home() {
  const [externalUserId, setExternalUserId] = useState<string | null>(null);
  const [apn, setAuthProvisionId] = useState<string | null>(null)
  const [nameSlug, setNameSlug] = useState<string | null>(null)
  const [externalAccounts, setExternalAccounts] = useState<object[] | null>(null)
  const [testRequestConfig, setTestRequestConfig] = useState<object | null>(null)
  const searchParams = useSearchParams()


  // request stuff
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  //const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [headersArray, setHeadersArray] = useState([])


    
  useEffect(() => {
    if (externalUserId) {
      (async () => {
        try {
          const accounts = await getUserAccounts(externalUserId)
          setExternalAccounts(accounts)
        } catch (error) {
          console.error("Error fetching data:", error)
          // Handle error appropriately
        }
      })()


    } else {
      setExternalAccounts(null);
    }
  }, [externalUserId]);

  useEffect(() => {
    const uuid = searchParams.get("uuid") ? searchParams.get("uuid") : crypto.randomUUID()
    setExternalUserId(uuid);
  }, []);

  useEffect(() => {
    if (nameSlug) {
      (async () => {
        try {
    const testRequest = await getTestRequest(nameSlug)
    console.log("setting test request")
    console.log("testRequest", testRequest)
    setTestRequestConfig(testRequest)

          // set some other stuff now?
          setUrl(testRequest.url || "")
          setMethod(testRequest.method || "GET")
          const headers = Object.entries(testRequest.config.headers).reduce((acc, [key, value]) => {
            if (key.toLowerCase() != "authorization") {
              acc.push({ name: key, value:value })
            }
            return acc
          }, [])
          setHeadersArray([...headers])
        } catch (error) {
          console.error("Error fetching data:", error)
          // Handle error appropriately
        }
      })()

    }

  }, [nameSlug])

  const handleRadioChange = (account) => {
    setAuthProvisionId(account.id)
    setNameSlug(account.app.name_slug)
  }

  const makeRequest = async() => {
    const headers = headersArray.reduce((acc, header) => {
      if (header.name && header.value) {
        acc[header.name] = header.value
      }
      return acc
    }, {})
    const resp = await makeAppRequest(apn, url, nameSlug, {
      method,
      headers,
      body,
    })
    setResponseBody(JSON.stringify(resp, null, 2))
  }

  const addHeader = () => {
    //headersArray.push({})
    setHeadersArray([...headersArray, {}])
  }

  const inputStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
  }

  const onChangeHeaderName = (e) => {
    //debugger
    headersArray[e.target.id].name = e.target.value
    setHeadersArray([...headersArray])
  }

  const onChangeHeaderValue = (e) => {
    headersArray[e.target.id].value = e.target.value
    setHeadersArray([...headersArray])
  }


  return (
    <main className="p-5 flex flex-col gap-2 max-w-5xl">
      {
        externalUserId && 
        <div className="mb-48">
          {externalAccounts ?
            <div>
              <h1>Accounts List</h1>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th/>
                    <th>pd id</th>
                    <th>app</th>
                    <th>app slug</th>
                    <th>auth type</th>
                  </tr>
                </thead>
                <tbody>
                  {externalAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                <input
                  type="radio"
                  name="userSelection"
                  value={account.id}
                  checked={apn === account.id}
                  onChange={() => handleRadioChange(account)}
                />
                      </td>
                      <td>{account.id}</td>
                      <td>{account.app.name}</td>
                      <td>{account.app.name_slug}</td>
                      <td>{account.app.auth_type}</td>
                    </tr>
                  ))} 
                </tbody>
              </table>
              <p>
                <span>selected account: </span>
                <span> {apn}</span>
              </p>
            {testRequestConfig && false &&
            <CodePanel
              language="typescript"
              code={
`// this is an example of the fetch request for the app
${testRequestConfig.authType === "bearer" ? "// use the oauth_access_token for your account in the authorization header": "use the given values for your account in the authorization header with Basic auth"}
const config = {
  method: "${testRequestConfig.config.method}",
  headers: ${JSON.stringify(testRequestConfig.config.headers, null, 2).replace(/\n/g, '\n  ')},
}
const resp = await fetch("${testRequestConfig.url}", config)
`}
            />}



      <h1>Fetch Request Builder</h1>
        <div style={{display: "flex", alightItems: "center", gap: "10px"}}>
          <label htmlFor="method">Method:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={inputStyle}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="headersArray">Headers:</label>
          <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded" onClick={addHeader}>Add Header</button>
          {headersArray.map((header, index) => (
            <div key={`header_${index}`}>
              <span class="mr-2">Name</span>
              <input key={`name_${index}`} id={index} value={headersArray[index].name} style={inputStyle} class="mr-2" onChange={onChangeHeaderName}/>
              <span class="mr-2">Value</span>
              <input key={`value_${index}`} id={index} value={headersArray[index].value} style={inputStyle} class="mr-2" onChange={onChangeHeaderValue}/>
            </div>
          ))}
        </div>



        {method !== "GET" && (
          <div>
            <label htmlFor="body">JSON Body:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
        )}

              <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded" onClick={makeRequest}>Make Request</button>
              {
                responseBody &&
                <div>
                  <span>Response Body:</span>
                  <pre>{responseBody}</pre>
                </div>
              }
            </div>
            : <div>
              <p className="mb-8">
              </p>
            </div>
          }
        </div>
      }
    </main>
  );
}
