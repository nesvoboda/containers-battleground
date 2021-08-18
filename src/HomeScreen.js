
import "./App.css";

import "./index.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import { Link } from "react-router-dom";

export default function HomeScreen() {
  const [results, setResults] = useState(null);

  function timeSum(element) {
    let sum;
    if (element.map === -1 || element.vector === -1 || element.stack === -1)
      sum = Number.MAX_SAFE_INTEGER;
    else sum = element.map + element.vector + element.stack;
    return sum;
  }

  function timeSumTable(element) {
    if (element.map === -1 || element.vector === -1 || element.stack === -1)
      return "KO";
    else return (element.map + element.vector + element.stack).toFixed(4);
  }

  function timeDisplay(resultValue) {
    if (resultValue === -1) return "KO";
    return resultValue.toFixed(4);
  }

  async function getResults() {
    const { data } = await supabase.from("results").select();

    if (data) {
      data.sort((firstEl, secondEl) => {
        let firstSum = timeSum(firstEl);
        let secondSum = timeSum(secondEl);
        return firstSum - secondSum;
      });
      setResults(data);
    }
  }

  useEffect(() => {
    getResults();
  });

  return (
    <div>
      <h3 className="description text-center mb-3 heading-font-size">
        A benchmark for ft_containers (WIP)
      </h3>
      <div className="text-center">
        <Link to="/account" className="text-white">
          <strong>Submit your own version</strong>
        </Link>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col col-md-8">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">URL</th>
                <th scope="col">Total</th>
                <th scope="col" className="table-details">
                  map
                </th>
                <th scope="col" className="table-details">
                  vector
                </th>
                <th scope="col" className="table-details">
                  stack
                </th>
              </tr>
            </thead>
            <tbody>
              {results ? (
                results.map((result, index) => {
                  return (
                    <tr key={result.id}>
                      <td>{index + 1}</td>
                      <td>{result.url.slice(
                          result.url.indexOf("github.com/") + 11)}
                      </td>
                      <td>{timeSumTable(result)}</td>
                      <td className="table-details">
                        {timeDisplay(result.map)}
                      </td>
                      <td className="table-details">
                        {timeDisplay(result.vector)}
                      </td>
                      <td className="table-details">
                        {timeDisplay(result.stack)}
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </tbody>
          </table>
          <div className="pt-5">
            <h4 className="mt-5 text-center">How does it work?</h4>
            <div className="row justify-content-center">
              <div className="col col-md-8 mt-3 text-center fs-8">
                <p>The benchmark used is <a href="https://github.com/nesvoboda/containers-benchmark" className="text-white">containers-benchmark</a>.</p>
                <p><a href="https://github.com/nesvoboda/containers-battleground" className="text-white">Code of this site</a>, <a href="https://github.com/nesvoboda/containers-battleground-backend" className="text-white">backend code</a>.</p>
              </div>
            </div>
          </div>
          <div className="pb-5">
            <h4 className="mt-5 text-center">Notes</h4>
            <div className="row justify-content-center">
              <div className="col col-md-8 mt-3 text-center fs-8">
                <p>The time indicated is CPU seconds.</p>
                <p>'KO' is either timeout or compilation failure.</p>
                <p>Results can change as the benchmarks evolve.</p>
                <p>Use the e-mail below for questions, requests etc.</p>
              </div>
              <a
                className="mt-5 pb-5 text-center text-white"
                href="mailto:containers-battleground@altmails.com"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default App;
