import { Endpoint } from '@constant/endpoint.constant';
import { Headers } from 'node-fetch';
import { request } from './server-request';
import { camelCaseObject } from './utility';

export interface Authentication {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

export interface AuthenticationError {
  error: number | string;
  message?: string;
}

export async function authenticate(
  clientId: string,
  clientSecret: string
): Promise<AuthenticationError | Authentication | Error> {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  );
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const payload = new URLSearchParams();
  payload.append('grant_type', 'client_credentials');

  const requestOptions = {
    headers: myHeaders,
    body: payload
  };

  try {
    const response = await request(
      `${Endpoint.BASE_URL}/api/v1/access_token`,
      'POST',
      requestOptions
    );
    const result = await response.json();

    if (response.ok && Object.keys(result).includes('access_token')) {
      return camelCaseObject(result) as Authentication;
    } else {
      throw result as AuthenticationError;
    }
  } catch (error: unknown | AuthenticationError) {
    throw error as AuthenticationError | Error;
  }
}

export async function getAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = (await authenticate(
    clientId,
    clientSecret
  )) as Authentication;
  return response.accessToken;
}
