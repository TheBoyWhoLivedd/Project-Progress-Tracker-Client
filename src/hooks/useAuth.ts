import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useMemo } from "react";

interface CustomJwtPayload extends JwtPayload {
  UserInfo: {
    userId: string;
    userName: string;
    isAdmin: boolean;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  const decodedUserInfo = useMemo(() => {
    if (token) {
      return jwtDecode<CustomJwtPayload>(token).UserInfo;
    }
    return null;
  }, [token]);

  if (decodedUserInfo) {
    const { userId, userName, isAdmin } = decodedUserInfo;
    const status = isAdmin ? "Admin" : "Employee";

    console.log("Decoded", decodedUserInfo);

    return { userId, userName, status, isAdmin };
  }

  return { userId: "", userName: "", isAdmin: false, status: "Employee" };
};

export default useAuth;

// const useAuth = () => {
//   const token = useSelector(selectCurrentToken);
//   let isAdmin = false;
//   let status = "Employee";
//   let userName = "";
//   let userId = "";

//   if (token) {
//     const decoded = jwtDecode<CustomJwtPayload>(token);
//     console.log("Decoded", decoded);

//     userName = decoded.UserInfo.userName;
//     isAdmin = decoded.UserInfo.isAdmin;
//     userId = decoded.UserInfo.userId;

//     status = isAdmin ? "Admin" : "Employee";

//     return { userId, userName, status, isAdmin };
//   }

//   return { userId, userName, isAdmin, status };
// };
