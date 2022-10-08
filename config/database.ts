export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'ec2-18-209-78-11.compute-1.amazonaws.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'd62in1ub8k2oga'),
      user: env('DATABASE_USERNAME', 'ualsnyqswvctwl'),
      password: env('DATABASE_PASSWORD', 'a5abaa29607240b1dcf19172093c55c51dfd633231c19683ec409553caf438e7'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
