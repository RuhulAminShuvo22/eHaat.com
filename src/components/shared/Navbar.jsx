"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHeart,
  FaShoppingCart,
  FaBell,
  FaMoon,
  FaSun,
  FaStore,
  FaUser,
  FaUserCircle,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaThLarge,
  FaAngleDown,
} from "react-icons/fa";

import {
  MdDashboard,
  MdFavorite,
  MdOutlineInventory2,
} from "react-icons/md";

import {
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
} from "react-icons/hi";

import { authClient } from "@/lib/auth-client";

const NavbarSearch = dynamic(
  () => import("./NavbarSearch"),
  {
    ssr: false,
  }
);

const NotificationDropdown = dynamic(
  () => import("./NotificationDropdown"),
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
    name: "Categories",
    href: "/categories",
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
  "Home & Living",
  "Beauty",
  "Sports",
  "Books",
  "Groceries",
  "Baby Care",
  "Health",
  "Automobile",
];

export default function Navbar() {
  const router = useRouter();

  const pathname = usePathname();

  const userMenuRef = useRef(null);

  const categoryRef = useRef(null);

  const notificationRef = useRef(null);

  const [mounted, setMounted] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [user, setUser] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [notificationCount, setNotificationCount] =
    useState(0);

  const [scrolled, setScrolled] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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

        const dbUser = await res.json();

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

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target
        )
      ) {
        setUserMenuOpen(false);
      }

      if (
        categoryRef.current &&
        !categoryRef.current.contains(
          event.target
        )
      ) {
        setCategoryOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeDropdown
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeDropdown
      );
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;

    setMenuOpen(false);

    router.push(
      `/shop?search=${encodeURIComponent(
        search
      )}`
    );
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setUser(null);

      router.push("/");

      setUserMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!mounted) return null;
  