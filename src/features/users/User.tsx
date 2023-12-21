import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { RootState } from "@/app/store";
import { memo } from "react";

const User = ({ userId }: { userId: string }) => {
  const user = useSelector((state: RootState) => selectUserById(state, userId));
  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    const userRolesString = user.roles.join(", ");
    const cellStatus = user.active ? "" : "bg-gray-200";

    return (
      <tr className="">
        <td className={`px-4 py-2 border ${cellStatus}`}>{user.username}</td>
        <td className={`px-4 py-2 border ${cellStatus}`}>{userRolesString}</td>
        <td className={`px-4 py-2 border ${cellStatus} flex justify-center`}>
          <Button
            className="text-4xl text-gray-800 bg-transparent border-none focus:outline-none focus:ring transform hover:scale-125"
            onClick={handleEdit}
            variant="ghost"
          >
            <Pencil1Icon />
          </Button>
        </td>
      </tr>
    );
  } else {
    return null;
  }
};

const memoizedUser = memo(User);

export default memoizedUser;
