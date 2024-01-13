import axios from "axios";
import environment from "environment";

export const getUsers = async (): Promise<unknown[]> => {
  const response = await axios.get(environment.app.users);
  return response.data;
};

export const getUser = async (id: string): Promise<unknown> => {
  const url = environment.app.users;
  const params = { id };
  console.log({ url });
  const response = await axios.get(url, { params });
  return response.data;
};
