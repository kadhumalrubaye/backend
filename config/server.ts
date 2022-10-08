
import cornTasks from "./corn-tasks";
export default ({ env }) => ({

  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array("APP_KEYS", ["testKey1", "testKey2"]),
  },
  cron: {
    enabled: true,
    tasks: cornTasks,
  },
});
