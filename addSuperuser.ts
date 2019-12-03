  // tslint:disable: no-console
import {createConnection, getManager} from 'typeorm';
import User from './src/models/user';
import {hash} from './src/utils/password';

const username = 'admin';
const password = 'asdf';
const email = 'asdf@asdf.com';

console.log('[-] Connecting');
createConnection().then(async (conn) => {
  console.log('[+] Synchronized');
  const user = new User();
  user.email = email;
  user.password = await hash(password);
  user.username = username;
  user.isSuperuser = true;
  console.log('[-] Saving');
  await getManager().save(user);
  console.log('[+] Add complete');
});
