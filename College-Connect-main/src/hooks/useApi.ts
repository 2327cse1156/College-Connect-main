import { useEffect, useState } from "react";
import api from "../services/api";

interface UseApiOptions {
  autoFetch?: boolean;
}

export const useApi = <T>(
  url: string,
  options: UseApiOptions = { autoFetch: true }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
