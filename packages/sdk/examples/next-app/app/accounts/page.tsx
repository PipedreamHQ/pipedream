"use client"

//import CodePanel from "../CodePanel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserAccounts, serverConnectTokenCreate, makeAppRequest } from "../server"

export default function Home() {
  const [externalUserId, setExternalUserId] = useState<string | null>(null);
  const [apn, setAuthProvisionId] = useState<string | null>(null)
  const [externalAccounts, setExternalAccounts] = useState<object[] | null>(null)
  const searchParams = useSearchParams()


  // request stuff
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [responseBody, setResponseBody] = useState("");
    
  useEffect(() => {
    if (externalUserId) {
      (async () => {
        try {
          const accounts = await getUserAccounts(externalUserId, 1)
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

  const handleRadioChange = (accountId: string) => {
    setAuthProvisionId(accountId)
  }

  const makeRequest = async() => {
    const resp = await makeAppRequest(apn, url, {})
    setResponseBody(JSON.stringify(resp))
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
                  onChange={() => handleRadioChange(account.id)}
                />
                      </td>
                      <td>{account.id}</td>
                      <td>{account.app.name}</td>
                      <td>{account.app.auth_type}</td>
                    </tr>
                  ))} 
                </tbody>
              </table>
              <p>
                <span>selected account: </span>
                <span> {apn}</span>
              </p>


      <h1>Fetch Request Builder</h1>
      <form>
        <div>
          <label htmlFor="method">HTTP Method:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="headers">Headers (key: value format, each header on a new line):</label>
          <textarea
            id="headers"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={5}
          />
        </div>

        {method !== "GET" && (
          <div>
            <label htmlFor="body">JSON Body:</label>
            <textarea
              id="body"
              readOnly
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
        )}

      </form>

              <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded" onClick={makeRequest}>Make Request</button>
                <textarea value={responseBody}/>
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
