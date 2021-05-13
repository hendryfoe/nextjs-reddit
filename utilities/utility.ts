import { camelCase } from 'lodash';

export function camelCaseObject(payload: any): any {
  const result = {};

  Object.keys(payload).forEach((key: string) => {
    result[camelCase(key)] = payload[key];
  });

  return result;
}
