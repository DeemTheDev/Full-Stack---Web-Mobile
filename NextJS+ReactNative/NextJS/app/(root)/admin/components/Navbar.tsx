// components/Navbar.tsx
import { auth, signIn, signOut } from "@/auth";
import { images } from "@/constant";
import { SearchInput } from "./SearchInput";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="navbar bg-base-300 text-neutral-content z-10">
      {session?.user?.email == "ziaeetechnologies@gmail.com" &&
      session?.user ? (
        <>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Admin - {session.user.name}</a>
          </div>
          <div className="flex-none gap-2">
            <div className="form-control">
              <SearchInput />
            </div>
            <div className="dropdown dropdown-end z-50">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt={`${session.user.name} profile`}
                    src={`${session.user.image}`}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a href="https://dashboard.clerk.com/apps/app_2oXA6hwMvkgeHAV0kVOyCJPB0tW/instances/ins_2oXA6gtwDlhD1RtHLxoeZR70VYJ">
                    Clerk
                  </a>
                </li>
                <li>
                  <a href="https://console.neon.tech/app/projects/ancient-lab-24255351/branches/br-raspy-violet-a5owqymr/tables?database=neondb">
                    Neon
                  </a>
                </li>
                <li>
                  <a href="https://dashboard.stripe.com/test/payments/pi_3QNcMMH4dVpTeKr50ZMux7eS">
                    Stripe
                  </a>
                </li>
                <li>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button type="submit">Sign Out</button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Admin - {""}</a>
          </div>
          <div className="flex-none gap-2">
            <div className="form-control">
              <SearchInput />
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="default profile" src={`${images.noResult}`} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("github");
                    }}
                  >
                    <button type="submit">Login - GitHub</button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
