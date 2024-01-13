import { getUserAction } from "@/redux/features/users/userSlice";
import { StateType } from "@/redux/rootReducers";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage: React.FC = () => {

  const { data, isLoading } = useSelector((state: StateType) => state.users.user);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserAction('h'));
  }, []);

  return (
    <div>
      {
        isLoading
          ?
          (<span>Loading...</span>)
          :
          data
            ?
            (<div>Hi, I'm {JSON.stringify(data)}</div>)
            :
            (<span>No user found!</span>)
      }
    </div>
  )
}

export default ProfilePage