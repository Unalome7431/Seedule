"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { registerUser } from "./actions";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Konfirmasi sandi tidak sesuai!");
      return;
    }

    startTransition(async () => {
      const res = await registerUser(null, formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    });
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
          <h1 className="text-2xl font-bold text-sage-950 tracking-tight">Daftar Akun Seedule</h1>
          <p className="text-xs text-sage-500 max-w-[260px] leading-relaxed">
            Bergabunglah untuk menyimpan riwayat analisis kesesuaian lahan dan rotasi tanam Anda.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-xs text-red-700 items-start animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2 text-xs text-green-700 items-start animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Pendaftaran berhasil! Mengalihkan ke login...</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-700">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                disabled={isPending || success}
                placeholder="cth. Charles Deriksen"
                className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-700">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                disabled={isPending || success}
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
                disabled={isPending || success}
                placeholder="Min. 6 karakter"
                minLength={6}
                className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-sage-700">Ulangi Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                required
                disabled={isPending || success}
                placeholder="Konfirmasi kata sandi"
                minLength={6}
                className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || success}
            className="w-full rounded-xl bg-primary-600 p-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-600/10 disabled:opacity-50 mt-2"
          >
            {isPending ? "Mendaftarkan..." : "Daftar Akun"}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Login Redirection */}
        <div className="pt-2 text-center text-xs text-sage-500 border-t border-sage-100">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
