export var Drivers = /** @type {const} */ ([
  'Minio',
  'Neo4j',
  'Postgres',
])

export var DriverConnectors = {
  'Minio': instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Minio] connecting'))
        .then(() => instance.listBuckets())
        .then(buckets => console.log('[Minio] connected', buckets))
        .catch(reason => {
          console.error(`[Minio] connection failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Minio] disconnecting'))
        .then(() => console.log('[Minio] disconnected')),
  }),

  'Neo4j': instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Neo4j] connecting'))
        .then(() => instance.getServerInfo())
        .then(info => console.log('[Neo4j] connected', info))
        .catch(reason => {
          console.error(`[Neo4j] connection failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Neo4j] disconnecting'))
        .then(() => instance.close())
        .then(() => console.log('[Neo4j] disconnected')),
  }),

  'Postgres': instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Postgres] connecting'))
        .then(() => instance`select current_database()`)
        .then(info => console.log('[Postgres] connected', info))
        .catch(reason => {
          console.error(`[Postgres] failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(() => console.log('[Postgres] disconnecting'))
        .then(() => instance.end())
        .then(() => console.log('[Postgres] disconnected')),
  }),
}

/**
 * @param {typeof Drivers[number]} driver
 * @param {*} instance
 */
export var connector = (driver, instance) => {
  if (!Drivers.includes(driver))
    throw TypeError(
      `Parameter 'driver' must be one of: '${Drivers.join(', ')}'`,
    )

  return DriverConnectors[driver](instance)
}
