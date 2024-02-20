import React, {
  useState, useEffect,
} from "react";
import rawMappings from "./python-mappings.json";

const PythonMappings = () => {
  const [
    mappings,
    setMappings,
  ] = useState([]);
  const [
    query,
    setQuery,
  ] = useState("");

  useEffect(() => {
    setMappings(Object.entries(rawMappings));
  }, []);

  useEffect(() => {
    search(query);
  }, [
    query,
  ]);

  const search = (query) => {
    if (query === "") {
      setMappings(Object.entries(rawMappings));
    } else {
      const filteredMappings = mappings.filter((mapping) =>
        new RegExp(query, "i").test(mapping[0]));
      setMappings(filteredMappings);
    }
  };

  return (
    <div className="m-auto">
      <div className="m-auto my-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by package name"
          className="
            my-3
            px-3
            py-3
            placeholder-slate-300
            relative
            rounded
            text-sm
            border-0
            shadow
            outline-none
            focus:outline-none focus:ring
            w-full
            m-auto
          "
        />
      </div>

      <table className="m-auto table w-full">
        <thead>
          <tr>
            <th className="text-center align-middle pb-2">PyPI Package Name</th>
            <th className="text-center align-middle pb-2">Import into Pipedream with</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping, index) => (
            <tr key={index}>
              <td className="text-center align-middle py-2">
                <a
                  target="_blank"
                  className="external"
                  href={`https://pypi.org/project/${mapping[0]}`}
                >
                  <span className="font-mono">{`# pipedream add-package ${mapping[0]}`}</span>
                </a>
              </td>
              <td className="text-center align-middle py-2">
                <span className="font-mono">import {mapping[1]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PythonMappings;
