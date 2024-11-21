import { defer, partial } from '@yurkimus/functions'

export let Drivers = /** @type {const} */ ({
  Minio: 'Minio',
  Neo4j: 'Neo4j',
  Postgres: 'Postgres',
})

let DriverConnectors = {
  [Drivers.Minio]: instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[minio] connecting`))
        .then(() => instance.listBuckets())
        .then(partial(console.log, `[minio] connected\n`))
        .catch(reason => {
          console.log(`[minio] failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[minio] disconnecting`))
        .then(defer(console.log, `[minio] disconnected`)),
  }),

  [Drivers.Neo4j]: instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[neo4j] connecting`))
        .then(() => instance.getServerInfo())
        .then(partial(console.log, `[neo4j] connected\n`))
        .catch(reason => {
          console.log(`[neo4j] failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[neo4j] disconnecting`))
        .then(() => instance.close())
        .then(defer(console.log, `[neo4j] disconnected`)),
  }),

  [Drivers.Postgres]: instance => ({
    connect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[postgres] connecting`))
        .then(() => instance`select current_database()`)
        .then(partial(console.log, `[postgres] connected\n`))
        .catch(reason => {
          console.log(`[postgres] failed\n`, reason)
          throw reason
        }),

    disconnect: () =>
      Promise
        .resolve()
        .then(defer(console.log, `[postgres] disconnecting`))
        .then(() => instance.end())
        .then(defer(console.log, `[postgres] disconnected`)),
  }),
}

/**
 * @param {keyof typeof Drivers} driver
 * @param {*} instance
 */
export let connector = (driver, instance) => {
  switch (driver) {
    case Drivers.Minio:
    case Drivers.Neo4j:
    case Drivers.Postgres:
      return DriverConnectors[driver](instance)

    default:
      throw new TypeError(
        `'driver' must be one of: `
          + `'${Object.values(Drivers).join(', ')}'.`,
      )
  }
}
