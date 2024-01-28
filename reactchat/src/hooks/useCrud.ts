/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BASE_URL } from "../config";
import useAxiosWithInterceptor from "../helpers/jwtinterceptor";
import { useState } from "react";

interface IuseCrud<T> {
  dataCRUD: T[];
  fetchData: () => Promise<void>;
  error: Error | null;
  isLoading: boolean;
}

const useCrud = <T>(initalData: T[], apiURL: string): IuseCrud<T> => {
  const jwtAxios = useAxiosWithInterceptor();
  const [dataCRUD, setDataCRUD] = useState<T[]>(initalData);
  const [error, setError] = useState<Error | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {});
      const data = await response.data;
      setDataCRUD(data);
      setError(null);
      return data;
    } catch (error: any) {
      if (error.response && error.response?.status === 400) {
        setError(new Error("400"));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, dataCRUD, error, isLoading };
};

export default useCrud;
