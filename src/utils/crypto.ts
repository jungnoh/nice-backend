import crypto from 'crypto';

export function createKey(length: number = 192): Promise<string> {
  return new Promise((res, rej) => {
    try {
      const data = crypto.randomBytes(length / 8);
      res(data.toString('hex'));
    } catch (err) {
      rej(err);
    }
  });
}
