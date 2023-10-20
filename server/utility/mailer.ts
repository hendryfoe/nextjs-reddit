import { OAuth2Client } from 'google-auth-library';
import { createTransport } from 'nodemailer';

// const templates = new Map();
// templates.set('REDDIT_NEWSLETTER_LAYOUT', );

export async function sendMail(
  to: string | string[] = 'expressmartkp@gmail.com',
  subject = 'Reddit Free App List',
  body = 'I hope this message gets through!'
) {
  const { accessToken } = await getGoogleAccessToken();

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      accessToken
    }
  });

  return transporter.sendMail({
    from: process.env.GMAIL_EMAIL,
    to,
    subject,
    html: body
  });
}

// https://levelup.gitconnected.com/multi-purposes-mailing-api-using-nodemailer-gmail-google-oauth-28de49118d77
async function getGoogleAccessToken(): Promise<{ accessToken: string }> {
  const oAuth2Client = new OAuth2Client(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const { token } = await oAuth2Client.getAccessToken();

  return { accessToken: token };
}
