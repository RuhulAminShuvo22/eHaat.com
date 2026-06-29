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
                    {/* ================= Right Side ================= */}

          <div
            className="
              hidden
              lg:flex
              items-center
              gap-3
            "
          >

            {/* Wishlist */}

            <Link
              href="/wishlist"
              className="
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                bg-white
                border
                border-[#D6EAF8]
                text-[#0F172A]
                hover:bg-[#E0F2FE]
                hover:text-[#0284C7]
                transition-all
                duration-300
              "
            >

              <FaHeart size={18} />

              {wishlistCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    w-5
                    h-5
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                >
                  {wishlistCount}
                </span>

              )}

            </Link>

            {/* Cart */}

            <Link
              href="/cart"
              className="
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                bg-white
                border
                border-[#D6EAF8]
                text-[#0F172A]
                hover:bg-[#E0F2FE]
                hover:text-[#0284C7]
                transition-all
              "
            >

              <FaShoppingCart size={18} />

              {cartCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    w-5
                    h-5
                    rounded-full
                    bg-[#0284C7]
                    text-white
                    text-[10px]
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                >
                  {cartCount}
                </span>

              )}

            </Link>

            {/* Notifications */}

            <div
              ref={notificationRef}
              className="relative"
            >

              <button
                onClick={() =>
                  setNotificationOpen(
                    !notificationOpen
                  )
                }
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  border
                  border-[#D6EAF8]
                  text-[#0F172A]
                  hover:bg-[#E0F2FE]
                  hover:text-[#0284C7]
                  transition-all
                "
              >

                <FaBell size={18} />

                {notificationCount > 0 && (

                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      w-5
                      h-5
                      rounded-full
                      bg-red-500
                      text-white
                      text-[10px]
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {notificationCount}
                  </span>

                )}

              </button>

              {/* Notification Dropdown Part-6 */}

            </div>

            {/* Dark Mode */}

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                bg-white
                border
                border-[#D6EAF8]
                hover:bg-[#E0F2FE]
                transition-all
              "
            >

              {darkMode ? (

                <FaSun
                  className="
                    text-yellow-500
                  "
                />

              ) : (

                <FaMoon
                  className="
                    text-[#0F172A]
                  "
                />

              )}

            </button>

            {/* User */}

            {user ? (

              <div
                ref={userMenuRef}
                className="relative"
              >

                <button
                  onClick={() =>
                    setUserMenuOpen(
                      !userMenuOpen
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-full
                    pl-2
                    pr-4
                    py-2
                    bg-white
                    border
                    border-[#D6EAF8]
                    hover:border-[#0284C7]
                    transition-all
                  "
                >

                  {user.image ? (

                    <Image
                      src={user.image}
                      alt={user.name}
                      width={42}
                      height={42}
                      className="
                        rounded-full
                        object-cover
                      "
                    />

                  ) : (

                    <FaUserCircle
                      size={42}
                      className="
                        text-[#0284C7]
                      "
                    />

                  )}

                  <div
                    className="
                      text-left
                    "
                  >

                    <h4
                      className="
                        text-sm
                        font-bold
                        text-[#0F172A]
                      "
                    >
                      {user.name}
                    </h4>

                    <p
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      {user.role}
                    </p>

                  </div>

                  <FaChevronDown />

                </button>

                {/* User Dropdown Part-5 */}

              </div>

            ) : (

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Link
                  href="/login"
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    border
                    border-[#0284C7]
                    text-[#0284C7]
                    font-semibold
                    hover:bg-[#E0F2FE]
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-[#0284C7]
                    hover:bg-[#0369A1]
                    text-white
                    font-semibold
                    transition
                  "
                >
                  Register
                </Link>

              </div>

            )}

            {/* Mobile Menu */}

            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="
                lg:hidden
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-xl
                bg-white
                border
                border-[#D6EAF8]
              "
            >

              {menuOpen ? (

                <FaTimes size={20} />

              ) : (

                <FaBars size={20} />

              )}

            </button>

          </div>
          