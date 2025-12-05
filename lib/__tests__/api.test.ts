import axios from 'axios';
import { getCoins, getCoinDetails, getCoinHistory, getCoinsByIds } from '../api';

// Mock axios before importing api module
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    create: jest.fn(() => mockAxiosInstance),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = (axios.create as jest.Mock)();

describe('API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoins', () => {
    it('should fetch coins', async () => {
      const mockData = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000 },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      const result = await getCoins(1, 20);
      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));
      await expect(getCoins(1, 20)).rejects.toThrow('Network error');
    });
  });

  describe('getCoinsByIds', () => {
    it('should fetch coins by IDs', async () => {
      const mockData = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000 },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      const result = await getCoinsByIds(['bitcoin']);
      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin',
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
    });

    it('should return empty array when no IDs provided', async () => {
      const result = await getCoinsByIds([]);
      expect(result).toEqual([]);
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('getCoinDetails', () => {
    it('should fetch coin details', async () => {
      const mockData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        image: { small: 'https://example.com/bitcoin.png' },
        market_data: { current_price: { usd: 50000 } },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      const result = await getCoinDetails('bitcoin');
      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin', {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });
    });
  });

  describe('getCoinHistory', () => {
    it('should fetch coin price history', async () => {
      const mockData = {
        prices: [[1000000000000, 50000], [1000000100000, 51000]],
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      const result = await getCoinHistory('bitcoin', '7');
      expect(result).toEqual(mockData.prices);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: '7',
        },
      });
    });
  });
});

