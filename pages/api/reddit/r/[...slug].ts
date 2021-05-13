import { Endpoint } from '@constant/endpoint.constant';
import { get } from '@utility/server-request';
import { sendMail } from '@utility/mailer';
import type { NextApiRequest, NextApiResponse } from 'next';

type ThreadEntity = {
  id: string;
  title: string;
  link: string;
  createdDate: any;
};

type Data = {
  data: ThreadEntity[];
  after: string;
  before: string;
  kind: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // console.log(req.query);
  const { slug, mail, limit = 25 } = req.query;
  const path = (slug as string[]).join('/');

  try {
    const response = await get(`/r/${path}`, {
      queryParams: { limit }
    });
    const result = transformResponse(response);

    if (mail) {
      await sendMail();
    }

    res.status(200).json(result);
  } catch (error) {
    // console.log('errro ', error);
    res.status(400).json(error);
  }
};

function transformResponse(payload: any): Data {
  const data = getThreadEntities(payload);

  const {
    kind,
    data: { after, before }
  } = payload;

  return { kind, data, after, before };
}

function getThreadEntities(payload: any): ThreadEntity[] {
  return (payload?.data?.children as any[]).map((value) => {
    const { id, title, permalink, created_utc } = value.data;
    return {
      id,
      title,
      link: `${Endpoint.BASE_URL}${permalink}`,
      createdDate: new Date(created_utc * 1000).valueOf()
    };
  });
}
