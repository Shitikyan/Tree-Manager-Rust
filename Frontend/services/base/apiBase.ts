import Axios, { AxiosInstance } from 'axios';
import { ApiError, ApiHeaders, IApiBase, ID } from './types';

export default class ApiBase<T> implements IApiBase<T> {
  public axiosInstance: AxiosInstance;
  protected baseApiUrl: string;
  private headers?: ApiHeaders;

  constructor(baseApiUrl?: string, headers?: ApiHeaders) {
    this.baseApiUrl = baseApiUrl || '';
    this.axiosInstance = Axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    };
  }

  protected isError(response: any): boolean {
    return 'statusCode' in response && 'message' in response;
  }

  protected createError(e: any): ApiError {
    return {
      statusCode: e?.response?.status,
      errorMessage: e?.response?.data?.error ?? 'Server Error',
    };
  }

  public async getAllAsync(
    url: string = this.baseApiUrl,
  ): Promise<T[] | T | ApiError> {
    try {
      const { data } = await this.axiosInstance.get(`${url}`);
      if (!data) throw new Error('Data not found');

      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async getAsync(url: string = this.baseApiUrl): Promise<T | ApiError> {
    try {
      const { data } = await this.axiosInstance.get(`${url}`);
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async postAsync(
    url: string = this.baseApiUrl,
    values?: T,
    headers?: any,
  ): Promise<T | ApiError> {
    try {
      const { data } = await this.axiosInstance.post(`${url}`, values, {
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async putAllAsync(
    values: T,
    url: string = this.baseApiUrl,
    headers?: ApiHeaders,
  ): Promise<T | ApiError> {
    try {
      const { data } = await this.axiosInstance.put(`${url}`, values, {
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async putAsync(
    id: ID,
    values: T,
    url: string = this.baseApiUrl,
    headers?: any,
  ): Promise<T | ApiError> {
    try {
      const { data } = await this.axiosInstance.put(`${url}/${id}`, values, {
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async deleteAsync(
    id: ID,
    url: string = this.baseApiUrl,
  ): Promise<void | ApiError> {
    try {
      const { data } = await this.axiosInstance.delete(`${url}/${id}`);
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }

  public async deleteAllAsync(
    values: T,
    url: string = this.baseApiUrl,
  ): Promise<T | ApiError> {
    try {
      const { data } = await this.axiosInstance.delete(`${url}`, {
        data: values,
      });
      return data;
    } catch (e) {
      return this.createError(e);
    }
  }
}
