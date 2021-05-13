import { BodyInit, Headers, RequestInit } from 'node-fetch';

export interface RequestOption {
  headers?: Headers;
  queryParams?: any;
}
export interface Request extends RequestOption {
  body?: BodyInit;
}
export interface RequestPayload {
  url: URL | string;
  requestOptions: RequestInit;
}
