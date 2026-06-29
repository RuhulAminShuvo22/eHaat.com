"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaHeart,
  FaShoppingCart,
  FaBell,
  FaStore,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

import {
  MdDashboard,
} from "react-icons/md";

import { authClient } from "@/lib/auth-client";

const NavbarSearch = dynamic(
  () => import("./NavbarSearch"),
  {
    ssr: false,
  }
);

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Brands",
    href: "/brands",
  },
  {
    name: "Offers",
    href: "/offers",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

const categories = [
  "Electronics",
  "Fashion",
  "Groceries",
  "Beauty",
  "Home & Living",
  "Sports",
  "Books",
  "Furniture",
  "Health",
  "Baby Care",
];

export default function Navbar() {

  const router = useRouter();

  const pathname = usePathname();

  const userMenuRef = useRef(null);

  const categoryMenuRef = useRef(null);

  const notificationRef = useRef(null);

  const [mounted, setMounted] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [
    wishlistCount,
    setWishlistCount,
  ] = useState(0);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [darkMode, setDarkMode] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {

    const handleScroll = () => {

      setScrolled(
        window.scrollY > 10
      );

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const session =
          await authClient.getSession();

        if (!session?.data?.user) {

          setUser(null);

          return;

        }

        const currentUser =
          session.data.user;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${currentUser.email}`
        );

        const dbUser =
          await res.json();

        setUser(dbUser);

        setCartCount(
          dbUser.cartCount || 0
        );

        setWishlistCount(
          dbUser.wishlistCount || 0
        );

        setNotificationCount(
          dbUser.notificationCount || 0
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchUser();

    window.addEventListener(
      "user-auth-changed",
      fetchUser
    );

    return () =>
      window.removeEventListener(
        "user-auth-changed",
        fetchUser
      );

  }, []);

  const handleSearch = () => {

    if (!search.trim()) return;

    router.push(
      `/shop?search=${encodeURIComponent(
        search
      )}`
    );

    setMenuOpen(false);

  };

  const handleLogout = async () => {

    await authClient.signOut();

    setUser(null);

    setUserMenuOpen(false);

    router.push("/");

  };

  if (!mounted) {

    return null;

  }

  return (
        <header
      className={`
        sticky
        top-0
        z-50
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-[#D6EAF8]"
            : "bg-[#F0F8FF]"
        }
      `}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          mx-auto
          max-w-7xl
          px-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            h-[82px]
          "
        >
          {/* ================= Logo ================= */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              shrink-0
            "
          >
            <Image
              src="/logo.png"
              alt="ShopSphere"
              width={180}
              height={55}
              priority
              className="
                h-[52px]
                w-auto
                object-contain
              "
            />

            <div className="hidden xl:block">

              <h2
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-[#0F172A]
                "
              >
                ShopSphere
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Smart Shopping Everyday
              </p>

            </div>

          </Link>

          {/* ================= Desktop Navigation ================= */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-8
              ml-10
            "
          >
            {navLinks.map((link) => (

              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative
                  font-semibold
                  transition-all
                  duration-300
                  hover:text-[#0284C7]
                  ${
                    pathname === link.href
                      ? "text-[#0284C7]"
                      : "text-[#0F172A]"
                  }
                `}
              >
                {link.name}

                {pathname === link.href && (

                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-[3px]
                      w-full
                      rounded-full
                      bg-[#0284C7]
                    "
                  />

                )}

              </Link>

            ))}

            {/* ================= Category Button ================= */}

            <div
              ref={categoryMenuRef}
              className="relative"
            >

              <button
                onClick={() =>
                  setCategoryOpen(!categoryOpen)
                }
                className="
                  flex
                  items-center
                  gap-2
                  font-semibold
                  text-[#0F172A]
                  hover:text-[#0284C7]
                  transition
                "
              >

                Categories

                <FaChevronDown
                  className={`
                    transition-transform
                    duration-300
                    ${
                      categoryOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>

              {/* Mega Menu এখানে Part-4 এ আসবে */}

            </div>

          </nav>

          {/* ================= Search ================= */}

          <div
            className="
              hidden
              lg:flex
              flex-1
              max-w-[420px]
              mx-8
            "
          >

            <NavbarSearch />

          </div>

          {/* ================= Become Seller ================= */}

          <Link
            href="/become-seller"
            className="
              hidden
              xl:flex
              items-center
              gap-2
              rounded-full
              bg-[#0284C7]
              hover:bg-[#0369A1]
              text-white
              px-5
              py-3
              font-semibold
              transition-all
              duration-300
              shadow-md
            "
          >

            <FaStore />

            Become Seller

          </Link>
          