"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, User, ChevronRight, LayoutDashboard, ShoppingBag } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setSessionUser(data.user);
        }
      } catch (e) {
        // guest
      }
    }
    checkAuth();
  }, []);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Top Up Game", href: "/#katalog-game" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "News", href: "/#news" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Brand / Logo */}
        <Link
          href="#home"
          className="flex items-center gap-space-sm shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} Logo`}
              width={40}
              height={40}
              priority
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold bg-gradient-to-r from-on-surface via-primary to-secondary bg-clip-text">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden lg:flex items-center gap-space-md"
        >
          {navLinks.map((link, idx) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors font-label-action text-label-action px-3 py-1.5 rounded-lg ${
                idx === 0
                  ? "bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(142,30,162,0.3)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {sessionUser && (
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 transition-colors font-label-action text-label-action px-3 py-1.5 rounded-lg text-secondary hover:text-secondary-fixed hover:bg-surface-container font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesanan Anda</span>
            </Link>
          )}
        </nav>

        {/* Actions (Login / User / Dashboard) */}
        <div className="hidden sm:flex items-center gap-space-md shrink-0">
          {sessionUser?.role === "admin" ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-all shadow-[0_0_16px_-2px_rgba(152,232,222,0.3)] font-label-action text-label-action font-semibold group gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Admin</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-all shadow-[0_0_16px_-2px_rgba(152,232,222,0.3)] font-label-action text-label-action font-semibold group"
            >
              <span>{sessionUser ? sessionUser.name : "Masuk / Login"}</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          <Link
            href={sessionUser?.role === "admin" ? "/dashboard" : "/login"}
            aria-label="Menu Akun"
            className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href={sessionUser?.role === "admin" ? "/dashboard" : "/login"}
            aria-label="Akun"
            className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-sm font-bold"
          >
            <User className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigasi menu"
            className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container border-b border-outline-variant/40 px-margin-mobile py-space-md shadow-2xl animate-in slide-in-from-top-2">
          <nav aria-label="Navigasi Mobile" className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-space-md py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-action text-label-action font-medium flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-outline" />
              </Link>
            ))}

            {sessionUser && (
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-space-md py-3 rounded-lg text-secondary bg-surface-container-high font-label-action text-label-action font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pesanan Anda</span>
                </div>
                <ChevronRight className="w-4 h-4 text-secondary" />
              </Link>
            )}
            <div className="pt-2 border-t border-outline-variant/20">
              <Link
                href={sessionUser?.role === "admin" ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-space-md py-3 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold shadow-md"
              >
                {sessionUser?.role === "admin" ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Buka Dashboard Admin</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>{sessionUser ? `Profil (${sessionUser.name})` : "Masuk / Login Akun"}</span>
                  </>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
