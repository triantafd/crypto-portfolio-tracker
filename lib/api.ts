import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor to log API calls
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to log API responses
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : "object",
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return Promise.reject(error);
  }
);

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDetail extends Omit<Coin, "image"> {
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
}

export const getCoins = async (page = 1, perPage = 20): Promise<Coin[]> => {
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: "24h",
    },
  });
  return data;
};

export const getCoinsByIds = async (ids: string[]): Promise<Coin[]> => {
  if (ids.length === 0) return [];
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      ids: ids.join(","),
      order: "market_cap_desc",
      per_page: 250,
      page: 1,
      sparkline: true,
      price_change_percentage: "24h",
    },
  });
  return data;
};

export const getCoinDetails = async (id: string): Promise<CoinDetail> => {
  const { data } = await api.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: true,
    },
  });
  return data;
};

export const getCoinHistory = async (id: string, days: string) => {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: "usd",
      days,
    },
  });
  return data.prices as [number, number][];
};
