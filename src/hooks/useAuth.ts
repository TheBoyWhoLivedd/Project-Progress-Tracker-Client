import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  UserInfo: {
    username: string;
    isAdmin: boolean;
  };
}
const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    console.log("Token to Decode", token);
    console.log("Token type:", typeof token);
    const decoded = jwtDecode<CustomJwtPayload>(token);

    const { username, isAdmin: hasAdminRights } = decoded.UserInfo;

    isManager = hasAdminRights;
    isAdmin = hasAdminRights;

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, status, isManager, isAdmin };
  }

  return { username: "", isManager, isAdmin, status };
};
export default useAuth;
