export type ID = number | string;

export interface ApiError {
  statusCode: number;
  errorMessage?: string;
}

export interface ApiHeaders {
  [key: string]: string;
}
export interface IApiBase<T> {
  getAllAsync: (url: string) => Promise<T[] | T | ApiError>;

  getAsync: (url: string) => Promise<T | ApiError>;

  postAsync: (url: string, values: T) => Promise<T | ApiError>;

  putAsync: (
    id: ID,
    values: T,
    url: string,
    headers: any,
  ) => Promise<T | ApiError>;

  putAllAsync(values: T, url: string): Promise<T | ApiError>;

  deleteAsync: (id: ID, url: string) => Promise<void | ApiError>;

  deleteAllAsync(values: T, url: string): Promise<T | ApiError>;
}
