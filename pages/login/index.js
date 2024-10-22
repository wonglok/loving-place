import { useState } from "@hookstate/core";
import * as RT from "../../pages-code/api/realtime";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState as useReactState } from "react";

export default function Login() {
  const router = useRouter();
  const identity = useState("");
  const password = useState("");
  const errorMsg = useState("");
  const [labelLogin, setLoginLabel] = useReactState("Login");
  const onSubmit = () => {
    errorMsg.set("");

    setLoginLabel("Loading....");
    RT.login({
      identity: identity.value,
      password: password.value,
    }).then(
      (res) => {
        // console.log(res.user, res.jwt);
        RT.AuthState.user.set(res.user);
        RT.AuthState.jwt.set(res.jwt);
        RT.AuthState.flush();
        setLoginLabel("Logging you in...");

        setTimeout(() => {
          router.push("/home");
        }, 100);
      },
      (err) => {
        RT.AuthState.clean();
        errorMsg.set(err.message);

        setLoginLabel("Login");
      }
    );
  };

  return (
    <div className={"p-3"}>
      <h1 className={" text-2xl"}> Login</h1>

      <Link href="/">
        <h2 className={" text-sm text-gray-600"}>← Go Back Home</h2>
      </Link>

      <form
        className={" "}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <table>
          <tbody>
            <tr>
              <td className={" text-right"}>Username or Emal</td>
              <td>
                <input
                  type="text"
                  className={" p-3 m-2"}
                  placeholder={"email or username"}
                  value={identity.value}
                  onInput={(t) => {
                    identity.set(t.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <td className={" text-right"}>Password</td>
              <td>
                <input
                  type="password"
                  className={" p-3 m-2"}
                  placeholder={"*****"}
                  value={password.value}
                  onInput={(t) => {
                    password.set(t.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <td className={" text-right"}></td>
              <td>
                <button onClick={onSubmit} className={" p-3 m-2 bg-gray-200"}>
                  {labelLogin}
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className={" text-left text-red-500 p-3"} colSpan={2}>
                {errorMsg.value}
              </td>
            </tr>
            <tr>
              <td></td>
              <td
                className={" text-left text-gray-500 text-sm underline p-3"}
                colSpan={2}
              >
                <Link href="/register">Switch to Register</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
