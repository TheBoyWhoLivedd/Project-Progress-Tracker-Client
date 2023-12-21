import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";

const DashFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { username, status } = useAuth();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;
  if (pathname !== "/dash") {
    goHomeButton = (
      <Button
        // className="flex items-center justify-center w-12 h-12 text-4xl bg-transparent border-none text-foreground hover:scale-110 focus:visible:scale-110 disabled:invisible"
        title="Home"
        onClick={onGoHomeClicked}
        size="icon"
      >
        <HomeIcon />
      </Button>
    );
  }

  return (
    <footer className="sticky bottom-0 z-10 bg-background p-2 border-t border-border flex flex-row gap-4 justify-start">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
};

export default DashFooter;
