import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h2 className="header text-center">Entry submission</h2>
        <p className="description text-center">
          Sign in via magic link with your email below
        </p>
        <div class="row justify-content-center mt-5">
          <div class="col col-md-6">
        <Link to="/" className="text-white">← Back to results</Link>
            <input
              className="form-control mb-3 mt-3 bg-black text-white"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col col-md-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              className={"form-control bg-black text-white"}
              disabled={loading}
            >
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
