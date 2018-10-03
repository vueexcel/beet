import Dexie from 'dexie';
const BeetDB = new Dexie('BeetDB');

BeetDB.version(1).stores({
    apps: `++id,appname, origin, apphash, account_id, chain, secret`,
    settings: `++id,setting, value`
}); 

export default BeetDB;