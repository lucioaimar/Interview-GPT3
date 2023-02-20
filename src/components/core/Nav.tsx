import { useUser } from "@auth0/nextjs-auth0/client";
import { Navbar, Avatar, Dropdown } from "flowbite-react";
import { useRouter } from "next/router";
import { LoginButton } from "./AuthButton";
import { LogoIcon } from "./Logo";

export const Nav = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const handleSignOut = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <Navbar className="fixed top-0 w-full shadow" fluid={true} rounded={true}>
      <Navbar.Brand href="/">
        <LogoIcon height={30} width={30} color="#1d4ed8"></LogoIcon>
        <span className="self-center whitespace-nowrap text-lg font-semibold text-primary dark:text-white">
          INTERVIEW GPT3
        </span>
      </Navbar.Brand>
      <Navbar.Collapse>
        <Navbar.Link href="/" active={router.pathname === "/"}>
          Home
        </Navbar.Link>
        <Navbar.Link
          href="/interview"
          active={router.pathname === "/interview"}
        >
          My Interviews
        </Navbar.Link>
      </Navbar.Collapse>
      {user ? (
        <div className="flex">
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={user.picture || ""}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                router.push("/interview");
              }}
            >
              My Interviews
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      ) : (
        <LoginButton />
      )}
    </Navbar>
  );
};
