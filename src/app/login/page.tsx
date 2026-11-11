"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Lock, Mail, User, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Gagal masuk. Periksa kembali email dan password.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Login berhasil! Mengalihkan ke sistem...");

      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMsg("Koneksi gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Pendaftaran gagal. Periksa data Anda.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Akun Anda aktif.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMsg("Koneksi gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-primary-container/25 via-secondary-container/20 to-secondary-fixed/15 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary-fixed text-sm mb-6 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 mb-2">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h1 className="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface">
            Portal Akun {siteConfig.name}
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1">
            Akses dashboard manajemen transaksi dan voucher game
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-surface-container-high p-1 mb-6 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === "login"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Masuk / Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === "register"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/50 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-secondary-container/40 border border-secondary/50 text-secondary text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Login */}
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-bold text-sm shadow-[0_0_16px_rgba(227,181,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
            </button>
          </form>
        ) : (
          /* Form Register */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ryan Gamers"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Password (min. 6 karakter)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-bold text-sm shadow-[0_0_16px_rgba(227,181,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Mendaftarkan..." : "Daftar Akun"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
