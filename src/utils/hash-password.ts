import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

export const hashPassword = (p: string) => {
  const hmac = crypto.createHmac('sha512', process.env.HASH_PWD_SALT);
  hmac.update(p);
  return hmac.digest('hex');
};
