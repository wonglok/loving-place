import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as RT from "../api/realtime";
import { useState as useHookState } from "@hookstate/core";
export function StackedLayout({ children, title = "Dashboard" }) {
  let user = useHookState(RT.AuthState.user);
  let name = useHookState("");
  let [openNav, setOpenNav] = useState(false);
  let [openProfile, setOpenProfile] = useState(false);
  let router = useRouter();

  let tabs = [
    {
      href: "/home",
      name: "Projects",
    },
  ];

  let onSignOut = () => {
    RT.AuthState.clean();
    router.push("/login");
  };

  useEffect(() => {
    name.set(user.value?.username || "");
  }, [user.value?.username]);

  return (
    <>
      <div>
        <nav className="bg-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href={"/"}>
                    <img
                      className="h-8 w-8 cursor-pointer"
                      src={"/brand/effectnode-logo.svg"}
                      alt="EffectNode"
                    />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                    {tabs.map((e) => {
                      return (
                        <a
                          key={e.href + e.name}
                          href={e.href}
                          className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {e.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* <!-- Profile dropdown --> */}
                  <div className="ml-3 relative">
                    <div>
                      <button
                        onClick={() => {
                          setOpenProfile((s) => !s);
                        }}
                        type="button"
                        className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        id="user-menu"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        {/* <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        /> */}
                        <svg
                          className="h-8 w-8 rounded-full"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill={"black"}
                            d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* <!--
                  Dropdown menu, show/hide based on menu state.

                  Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                  Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                --> */}
                    {openProfile && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg pt-0 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-400"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        {/* <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Your Profile
                        </a>

                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Settings
                        </a> */}

                        <span
                          href="#"
                          className="block px-4 py-2 text-sm bg-gray-600 text-white border-b rounded-t-md border-gray-100"
                        >
                          {name.get() || ""}
                        </span>

                        <a
                          href="#"
                          onClick={(ev) => {
                            ev.preventDefault();
                            // signOut({ callbackUrl: "/", redirect: true });

                            onSignOut();
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="-mr-2 flex md:hidden">
                {/* <!-- Mobile menu button --> */}
                <button
                  onClick={() => {
                    setOpenNav((s) => !s);
                  }}
                  type="button"
                  className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {/* <!--
                Heroicon name: outline/menu

                Menu open: "hidden", Menu closed: "block"
              --> */}
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {/* <!--
                Heroicon name: outline/x

                Menu open: "block", Menu closed: "hidden"
              --> */}
                  <svg
                    className="hidden h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Mobile menu, show/hide based on menu state. --> */}
          {openNav && (
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}

                {tabs.map((e) => {
                  return (
                    <a
                      key={e.href + e.name + "tabs"}
                      href={e.href}
                      className="bg-blue-800 text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {e.name}
                    </a>
                  );
                })}

                {/* <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Team
              </a>

              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Projects
              </a>

              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Calendar
              </a>

              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Reports
              </a> */}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    /> */}
                    <svg
                      className="h-10 w-10 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill={"white"}
                        d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {name.get() || "User"}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      Welcome Back!
                    </div>
                  </div>
                  {/* <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button> */}
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Your Profile
                  </a>

                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Settings
                  </a>

                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* <!-- Replace with your content --> */}
            <div className="px-4 py-6 sm:px-0">{children}</div>
            {/* <!-- /End replace --> */}
          </div>
        </main>
      </div>
    </>
  );
}
