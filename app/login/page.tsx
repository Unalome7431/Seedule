"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sprout, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const GoogleLogo = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Check if there's an error passed from oauth callback in URL
  const urlError = searchParams.get("error");
  const getErrorMessage = () => {
    if (urlError === "OAuthCallbackError" || urlError === "CallbackRouteError") {
      return "Gagal melakukan verifikasi masuk melalui Google.";
    }
    return urlError ? "Terjadi kesalahan verifikasi masuk." : null;
  };

  const activeError = error || getErrorMessage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError("Email atau kata sandi salah!");
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        console.error("Login client error:", err);
        setError("Terjadi kesalahan sistem saat mencoba masuk.");
      }
    });
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/40 p-4 font-sans relative overflow-hidden">
      {/* Background blobs for premium design */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-sage-200/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-sage-200 shadow-xl space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-2xl bg-primary-100 text-primary-600 shadow-inner flex items-center justify-center">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-sage-950 tracking-tight font-sans">Masuk ke Seedule</h1>
          <p className="text-xs text-sage-500 max-w-[260px] leading-relaxed">
            Silakan masuk untuk mengelola rekomendasi rotasi tanam agribisnis Anda.
          </p>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-xs text-red-700 items-start animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-700">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                placeholder="charles@domain.com"
                className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-700">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                disabled={isPending}
                placeholder="Kata sandi akun Anda"
                className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary-600 p-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-600/10 disabled:opacity-50 mt-2"
          >
            {isPending ? "Memproses..." : "Masuk"}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-sage-200 w-full" />
          <span className="absolute bg-white px-3 text-[10px] uppercase font-bold text-sage-400">Atau masuk dengan</span>
        </div>

        {/* OAuth Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full rounded-xl border border-sage-300 p-3 text-sm font-semibold text-sage-700 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <GoogleLogo />
          <span>Google OAuth</span>
        </button>

        {/* Register Redirection */}
        <div className="pt-2 text-center text-xs text-sage-500 border-t border-sage-100">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Daftar gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sage-50/40 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
