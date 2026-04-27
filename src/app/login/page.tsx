"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const snapshot = await getDocs(collection(db, "admins"));
      const isAdmin = snapshot.docs.some((doc) => doc.data().email === user.email);
      if (!isAdmin) {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4ee] px-4 font-[family-name:var(--font-dm-sans)]">
      <div className="w-full max-w-3xl flex rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10">

        {/* ── Left Panel ── */}
        <div className="hidden md:flex flex-col justify-between bg-[#1a3d22] p-10 w-80 shrink-0 relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#2e5c35]/40" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#2e5c35]/30" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#2e5c35] flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#7fcf7f]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-[#a8d5a8] text-[11px] tracking-[2px] uppercase font-semibold mb-2">NGO Command</p>
            <h2 className="text-white text-2xl leading-snug" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
              Manage with <em className="text-[#7fcf7f]">purpose</em> and clarity
            </h2>
          </div>

          <div className="relative z-10">
            <p className="text-[#7aad7a] text-xs leading-relaxed">
              Your central hub for operations, volunteers, and impact reporting.
            </p>
            <div className="flex gap-1.5 mt-4">
              <span className="w-5 h-1.5 rounded-full bg-[#7fcf7f]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3a6b3a]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3a6b3a]" />
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 bg-white px-8 py-10 flex flex-col justify-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#eaf4ea] text-[#2e5c35] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a9a4a]" />
            Admin Portal
          </span>

          <h1 className="text-2xl font-semibold text-[#1a2e1a] mb-1">Welcome back</h1>
          <p className="text-sm text-[#7a927a] mb-7">Sign in to access the dashboard</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-semibold text-[#4a6a4a] tracking-wide uppercase mb-2">
                Email address
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ab89a]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,12 2,6" />
                </svg>
                <input
                  type="email"
                  placeholder="admin@ngo.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-[1.5px] border-[#ddeedd] bg-[#f8fbf8] rounded-xl text-sm text-[#1a2e1a] placeholder-[#b0c8b0] outline-none focus:border-[#4a9a4a] focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a6a4a] tracking-wide uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ab89a]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-[1.5px] border-[#ddeedd] bg-[#f8fbf8] rounded-xl text-sm text-[#1a2e1a] placeholder-[#b0c8b0] outline-none focus:border-[#4a9a4a] focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-br from-[#1a3d22] to-[#2e6435] text-white text-sm font-semibold tracking-wide hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="flex items-center justify-center gap-1.5 text-[#9ab89a] text-[11px] mt-6">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secured with Firebase Auth · Admin only
          </p>
        </div>
      </div>
    </div>
  );
}