<h1 align="center">
  Simple Redis Connector
  <br>
</h1>

<h4 align="center">The <a href="https://github.com/kroo-work/" target="_blank">Kroo.Work</a> PnP (Plug and Play) Redis Connector!</h4>

<p align="center">
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## How To Use

### Install
To start, install this lib in your Node project:

- With NPM:
```bash
$ npm install simple-redis-connector
```

- With Yarn
```bash
$ yarn add simple-redis-connector
```

### Setup Environment Variables

- **REDIS_HOST**: Your redis host. Default: `localhost`
- **REDIS_PORT**: Your redis port. Default: `6379`
- **REDIS_PASSWORD**: Your redis password. Default: `Empty`
- **REDIS_PREFIX**: The prefix you want to use for yout keys. Default: `Empty`
- **REDIS_CLUSTER**: Set to `true` if your Redis is running in Cluster mode. Default: `false`
- **REDIS_REQUEST_TIMEOUT**: Timeout to execute an operation in milliseconds. Default: `300`
- **REDIS_CONNECT_TIMEOUT**: Timeout to connect to Redis instance in milliseconds. Default: `200`
- **REDIS_IGNORE**: Set to `true` if you want to complete ignore Redis cache. Default: `false`

## Credits

This application uses the following open source packages:

- [ioredis](https://ioredis.readthedocs.io/en/latest/API/)
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html)

## License

ISC

---
