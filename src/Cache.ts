import Bluebird from 'bluebird';
import IORedis, {
  Cluster,
  ClusterNode,
  Redis,
  ClusterOptions,
  RedisOptions,
} from 'ioredis';

export interface CacheOptions extends RedisOptions {
  nodes?: ClusterNode[];
  options?: ClusterOptions;
}

export interface CacheCredentials {
  host: string;
  port: number;
  keyPrefix?: string;
  password?: string;
  isCluster: boolean;
  requestTimeout?: number;
  connectTimeout?: number;
  ignore: boolean;
}

export const cacheConfig: CacheCredentials = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  keyPrefix: process.env.REDIS_PREFIX,
  password: process.env.REDIS_PASSWORD,
  isCluster: (process.env.REDIS_CLUSTER == 'true'),
  requestTimeout: Number(process.env.REDIS_REQUEST_TIMEOUT) || 300,
  connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 200,
  ignore: (process.env.REDIS_IGNORE == 'true'),
};


export class Cache {
  static #redisInstance: Redis | Cluster;
  static #isCluster = false;
  static #requestTimeout = 300;

  static get redisInstance(): Redis | Cluster {
    return this.#redisInstance;
  }

  static set redisInstance(newInstance: Redis | Cluster) {
    this.#redisInstance = newInstance;
  }

  static get isCluster(): boolean {
    return this.#isCluster;
  }

  static set isCluster(newValue: boolean) {
    this.#isCluster = newValue;
  }

  static get requestTimeout(): number {
    return this.#requestTimeout;
  }

  static set requestTimeout(newValue: number) {
    this.#requestTimeout = newValue;
  }

  static getConfig(): CacheOptions {
    const credentials = {...cacheConfig}

    const { isCluster, requestTimeout } = credentials;

    this.#isCluster = isCluster;
    this.#requestTimeout = requestTimeout;

    delete credentials.isCluster;
    delete credentials.requestTimeout;

    const redisOptions: CacheOptions = {
      ...credentials,
      retryStrategy: () => null,
      reconnectOnError: () => false,
      connectTimeout: 200,
      keepAlive: 1000,
    };

    if (!this.isCluster) {
      return redisOptions;
    }

    delete redisOptions.host;
    delete redisOptions.port;

    const clusterOptions: ClusterOptions = {
      clusterRetryStrategy: () => null,
      scaleReads: 'slave',
      redisOptions: redisOptions,
    };

    const finalOptions: CacheOptions = {
      nodes: [{ host: credentials.host, port: credentials.port }],
      options: clusterOptions,
    };

    return finalOptions;
  }

  static getInstance(): Redis | Cluster {
    try {
      if (cacheConfig.ignore) {
        return null;
      }
      
      if (!this.redisInstance) {
        const config = this.getConfig();

        // @ts-ignore
        IORedis.Promise = Bluebird;

        if (this.isCluster) {
          this.redisInstance = new Cluster(config.nodes, config.options);
        } else {
          this.redisInstance = new IORedis(config as RedisOptions);
        }

        this.redisInstance.on('error', (error) => this.handleError(error));
        this.redisInstance.on('close', () => this.disconnect());
      }

      return this.redisInstance;
    } catch (ex) {
      return null;
    }
  }

  static async get(key: string): Promise<any> {
    try {
      const redisInstance = this.getInstance();

      if (!redisInstance || redisInstance.status !== 'ready') {
        return null;
      }

      const redisPromise = (redisInstance.get(key) as Bluebird<string>).timeout(
        this.requestTimeout,
        'ERR_TIMEOUT',
      );

      const data = await redisPromise;

      const decodedData: any = JSON.parse(data);

      return decodedData;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async set(
    key: string,
    data: any,
    secondsToExpire: number = 7200): Promise<'OK'> {
    try {
      const redisInstance = this.getInstance();

      if (!redisInstance || redisInstance.status !== 'ready') {
        return null;
      }

      const encodedData: string = JSON.stringify(data);

      const redisPromise = (
        redisInstance.set(
          key,
          encodedData,
          'EX',
          secondsToExpire,
        ) as Bluebird<'OK'>
      ).timeout(this.requestTimeout, 'ERR_TIMEOUT');

      return redisPromise;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async del(key: string): Promise<number> {
    try {
      const redisInstance = this.getInstance();

      if (!redisInstance || redisInstance.status !== 'ready') {
        return null;
      }

      const redisPromise = (redisInstance.del(key) as Bluebird<number>).timeout(
        this.requestTimeout,
        'ERR_TIMEOUT',
      );

      return redisPromise;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError(error) {
    if (error.message !== 'ERR_TIMEOUT') {
      this.disconnect()
    }
    return null;
  }

  private static disconnect() {
      this.#redisInstance = null;
  }
}