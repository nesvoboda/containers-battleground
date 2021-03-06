import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import { Link } from "react-router-dom";

function Button(props) {
  return (
    <div>
      <button
        className="button form-control bg-black btn-primary mb-3"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.text}
      </button>
    </div>
  );
}

function DangerButton(props) {
  return (
    <div>
      <button
        className="button form-control bg-black btn-danger mb-3"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.text}
      </button>
    </div>
  );
}

function SubmissionForm(props) {
  return (
    <div>
      <div class="mb-3 mt-4">
        <label htmlFor="email" className="form-label">
          Your email (won't be publicly visible)
        </label>
        <div>
          <p className="bg-secondary py-2 rounded px-3 bg-opacity-25">
            {props.session.user.email}
          </p>
        </div>
      </div>

      <div class="mb-3">
        <label htmlFor="github_url" className="form-label">
          The url to your github repository (<u>will</u> be visible)
        </label>

        {props.entrySubmitted ? (
          <div>
            <p className="bg-secondary py-2 rounded px-3 bg-opacity-25">
              {props.value}
            </p>
          </div>
        ) : (
          <input
            id="github_url"
            type="github_url"
            value={props.value}
            onChange={props.onChange}
            className="form-control bg-black text-white"
            placeholder="https://github.com/userName/repoName"
            disabled={props.entrySubmitted}
            key="submitFormInput"
          />
        )}
      </div>
    </div>
  );
}

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [github_url, setGithubUrl] = useState(null);
  const [entrySubmitted, setEntrySubmitted] = useState(null);

  useEffect(() => {
    getEntry();
  }, [session]);

  async function getEntry() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("requests")
        .select(`github_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      console.log(data);

      if (data) {
        setGithubUrl(data.github_url);
        setEntrySubmitted(true);
        // setWebsite(data.website)
        // setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitEntry(githubUrl) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const { error } = await supabase
        .from("requests")
        .insert([{ user_id: user.id, github_url: githubUrl }], {
          returning: "minimal", // Don't return the value after inserting
        });

      if (error) {
        throw error;
      }
      setEntrySubmitted(true);
    } catch (error) {
      // console.log(error);
      if (error.code === "23505") {
        alert("Sorry. A repository can only be entered only once.");
      } else if (error.code === "23514") {
        alert(
          "Repository name must be strictly in format https://github.com/username/repository"
        );
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteEntry() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      /*
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      */

      const { error } = await supabase
        .from("requests")
        .delete()
        .match({ user_id: user.id });

      if (error) {
        throw error;
      }
      setEntrySubmitted(false);
      setGithubUrl("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div className="row justify-content-center">
        <div className="col">
          <h2 className="header text-center">Entry submission</h2>
          <p className="description text-center">Enter your github url</p>
          <div className="row justify-content-center mt-5">
            <div className="col-6"></div>
          </div>
          <div className="row justify-content-center">
            <div className="col-6"></div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div class="col-8">
          <Link to="/" className="text-white">
            ??? Back to results
          </Link>

          <SubmissionForm
            session={session}
            entrySubmitted={entrySubmitted}
            value={github_url || ""}
            onChange={(e) => setGithubUrl(e.target.value)}
            key="submissionFormComp"
          />


          {entrySubmitted ? (
            <div>
            <p>Thanks! We've received your entry. Your results will appear on the main page in ~15 minutes.</p>
            <p>If you hit 'Erase your entry', we will remove the results from the main page.</p>
            <DangerButton
              onClick={() => deleteEntry()}
              disabled={loading}
              text={loading ? "Loading ..." : "Erase your entry"}
              key="DangerButton"
            />
            </div>
          ) : (
            <Button
              onClick={() => submitEntry(github_url)}
              disabled={loading}
              text={loading ? "Loading ..." : "Submit entry"}
              key="normButton"
            />
          )}

          <div>
            <button
              className="button bg-black text-white form-control"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
