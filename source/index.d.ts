/**
 * @typedef {(typeof Drivers)[number]} Driver
 */
export const Drivers: readonly ["Minio", "Neo4j", "Postgres"];
/**
 * @type {Record<Driver, Record<'connect' | 'disconnect', () => Promise>>}
 */
export const DriverConnectors: Record<Driver, Record<"connect" | "disconnect", () => Promise<any>>>;
export function connect(driver: Driver, instance: any): (typeof DriverConnectors)[Driver];
export type Driver = (typeof Drivers)[number];
