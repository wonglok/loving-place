import { useState } from "@hookstate/core";
import * as RT from "../../pages-code/api/realtime";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const username = useState("");
  const email = useState("");
  const password = useState("");
  const errorMsg = useState("");

  const onSubmit = () => {
    errorMsg.set("");

    RT.register({
      username: username.value,
      email: email.value,
      password: password.value,
    }).then(
      (res) => {
        console.log(res);
        RT.AuthState.user.set(res.user);
        RT.AuthState.jwt.set(res.jwt);
        RT.AuthState.flush();

        setTimeout(() => {
          router.push("/home");
        }, 300);
      },
      (err) => {
        RT.AuthState.clean();
        errorMsg.set(err.message);
      }
    );
  };

  return (
    <div className={"p-3"}>
      <h1 className={" text-2xl"}>Register</h1>
      <form
        className={" "}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <table>
          <tbody>
            <tr>
              <td className={" text-right"}>Username</td>
              <td>
                <input
                  type="text"
                  className={" p-3 m-2"}
                  placeholder={"your username"}
                  value={username.value}
                  onInput={(t) => {
                    username.set(t.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <td className={" text-right"}>Emal</td>
              <td>
                <input
                  type="text"
                  className={" p-3 m-2"}
                  placeholder={"your email"}
                  value={email.value}
                  onInput={(t) => {
                    email.set(t.target.value);
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
                  Register
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
                <Link href="/login">Switch to Login</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
