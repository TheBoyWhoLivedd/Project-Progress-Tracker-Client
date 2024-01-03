import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  UserInfo: {
    userName: string;
    isAdmin: boolean;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let status = "Employee";
  let userName = "";

  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    console.log("Decoded", decoded);

    userName = decoded.UserInfo.userName;
    isAdmin = decoded.UserInfo.isAdmin;

    status = isAdmin ? "Admin" : "Employee";

    return { userName, status, isAdmin };
  }

  return { userName, isAdmin, status };
};

export default useAuth;
