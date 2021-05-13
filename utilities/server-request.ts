import { Endpoint } from '@constant/endpoint.constant';
import fetch, { Headers, Response } from 'node-fetch';
import { getAccessToken } from './authentication';
import { Request, RequestOption, RequestPayload } from './server-request.interface';

export async function request(
  endpoint: string,
  method: string,
  options: Request
): Promise<Response> {
  const { url, requestOptions } = prepareRequestPayload(
    endpoint,
    method,
    options
  );

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    return response;
  }

  throw await response.json();
}

export async function requestWithCredential(
  endpoint: string,
  method: string,
  options: Request
): Promise<Response> {
  const { url, requestOptions } = prepareRequestPayload(
    `${Endpoint.OAUTH_URL}${endpoint}`,
    method,
    options
  );

  // always append access token
  requestOptions.headers = await appendAccessToken(
    new Headers(requestOptions.headers)
  );

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    return response;
  }

  throw await response.json();
}

export async function get<T>(
  endpoint: string,
  options?: RequestOption
): Promise<T> {
  const response = await requestWithCredential(endpoint, 'GET', options);
  return (await response.json()) as T;
}

export async function post<T>(
  endpoint: string,
  body: any,
  options?: RequestOption
): Promise<T> {
  const response = await requestWithCredential(endpoint, 'POST', {
    ...options,
    body
  });
  return (await response.json()) as T;
}

function prepareRequestPayload(
  endpoint: string,
  method: string,
  options: Request
): RequestPayload {
  const url = new URL(endpoint);

  if (options?.queryParams) {
    const queryParams = options.queryParams;

    Object.keys(queryParams).forEach((key: string) => {
      url.searchParams.append(key, queryParams[key]);
    });
  }

  const body =
    options?.body && options.body instanceof URLSearchParams
      ? options.body
      : JSON.stringify(options?.body);

  const requestOptions = {
    method,
    headers: options.headers,
    body
  };

  return { url, requestOptions };
}

async function appendAccessToken(headers: Headers) {
  const accessToken = await getAccessToken(
    process.env.REDDIT_CLIENT_ID,
    process.env.REDDIT_CLIENT_SECRET
  );
  headers.append('Authorization', `Bearer ${accessToken}`);

  return headers;
}
