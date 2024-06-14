const { promisify } = require('util');
const redis = require('ioredis');
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
let client;

client = new redis(REDIS_PORT, REDIS_HOST);
client.client('SETNAME', 'cacheClient', function(err, res) {
  // console.log("-----------------------arguments-------------------------",arguments);
});
client.on('connect', () => console.log('Client connected to redis...'));
client.on('ready', () => console.log('Client connected to redis and ready to use...'));
client.on('error', (error) => console.log(error.message));
client.on('end', () => console.log('Client disconnected from redis'));

// When we want to stop reids(when we hit Ctrl+C)
// process.on('SIGINT', () => client.quit());

const getAsync = promisify(client.get).bind(client);
const getSetMembers = promisify(client.smembers).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const delAsync = promisify(client.del).bind(client);

const hgetAsync = promisify(client.hget).bind(client);
// const hexistsAsync = promisify(client.hexists).bind(client);
const hmgetAsync = promisify(client.hmget).bind(client);
const hsetAsync = promisify(client.hset).bind(client);
const hmsetAsync = promisify(client.hmset).bind(client);
const hincrbyAsync = promisify(client.hincrby).bind(client);
const hincrbyfloatAsync = promisify(client.hincrbyfloat).bind(client);
const setAsync = promisify(client.set).bind(client);
const setExAsync = promisify(client.setex).bind(client);

const incrAsync = promisify(client.incr).bind(client);


const hgetallAsync = promisify(client.hgetall).bind(client);
const hkeysAsync = promisify(client.hkeys).bind(client);
const lpush = promisify(client.lpush).bind(client);
const lrange = promisify(client.lrange).bind(client);
const lpop = promisify(client.lpop).bind(client);
const lpos = promisify(client.lpos).bind(client);
const rpop = promisify(client.rpop).bind(client);
const llen = promisify(client.llen).bind(client);
const ttl = promisify(client.ttl).bind(client);
const lrem = promisify(client.lrem).bind(client);
const lindex = promisify(client.lindex).bind(client);
// const hvalsAsync = promisify(client.hvals).bind(client);
// const hlenAsync = promisify(client.hlen).bind(client);
const hdelAsync = promisify(client.hdel).bind(client);

// Set
const saddAsync = promisify(client.sadd).bind(client);
const sremAsync = promisify(client.srem).bind(client);
const smembersAsync = promisify(client.smembers).bind(client);
const scardAsync = promisify(client.scard).bind(client); // Returns the set cardinality (number of elements) of the set

module.exports = {
  client,
  getAsync,
  getSetMembers,
  keysAsync,
  delAsync,
  hgetAsync,
  // hexistsAsync,
  hmgetAsync,
  hsetAsync,
  hmsetAsync,
  hincrbyAsync,
  hincrbyfloatAsync,
  hgetallAsync,
  hkeysAsync,
  setExAsync,
  incrAsync,
  // hvalsAsync,
  // hlenAsync,
  hdelAsync,
  lpush,
  lrange,
  lpop,
  lpos,
  llen,
  setAsync,
  lrem,
  lindex,
  rpop,
  ttl,
  // get: client.get,
  // set: client.set,
  // set: (client.set).bind(client),
  saddAsync,
  sremAsync,
  smembersAsync,
  scardAsync,
};
