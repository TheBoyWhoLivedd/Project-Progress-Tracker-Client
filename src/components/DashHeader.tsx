import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useSendLogoutMutation } from "@/features/auth/authApiSlice";
// import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const DashHeader = () => {
  const navigate = useNavigate();

  const [sendLogout, { isError, error }] = useSendLogoutMutation();

  const sendLogoutHandler = async () => {
    try {
      await sendLogout({}).unwrap();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    // try {
    //   await sendLogout({});
    //   navigate("/");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // const sendLogoutHandler = async () => {
  //   try {
  //     const response = await sendLogout({});
  //     console.log(response);
  //     if ("data" in response && (response.data === null || response.data)) {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // const response = await sendLogout({});
  //   // console.log(response);
  //   // // navigate("/");
  //   // console.log(isSuccess);
  // };

  // useEffect(() => {
  //   if (isSuccess) navigate("/");
  // }, [isSuccess, navigate]);
  // useEffect(() => {
  //   console.log("Effect status:", status);
  //   if (status === "fulfilled") {
  //     console.log('Navigating to "/"...');
  //     navigate("/");
  //   }
  // }, [status, navigate]);

  if (isError) {
    let errorMessage = "An error occurred";

    if (error && "status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        errorMessage = (fetchError.data as { message: string }).message;
      }
    }

    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <header className="sticky top-0 z-10 bg-background p-2 border-b border-border">
      <div className="flex flex-row justify-between items-center">
        <Link to="/dash">
          <h1 className="text-xl">techNotes</h1>
        </Link>
        <nav className="flex flex-row gap-2">
          <ModeToggle />
          <Button onClick={sendLogoutHandler} size="icon" variant="link">
            <ExitIcon />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default DashHeader;
