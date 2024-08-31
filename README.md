## Base nest app

## Setting up environments
1. Copy `.env.registry` into `.env`
    ```
    cp .env.registry .env
    ```

2. Prepare docker envs
    ```
    cp .env.defaults docker/env/.env.backend
    cp docker/env/.env.defaults.database docker/env/.env.database
    cp docker/env/.env.defaults.database docker/env/.env.test-database
    ```

## Generate migration file inside docker container

  docker exec -it base_nest_be env name=<migration file name> npm run migration:generate 

## Testing
1. To run all test suites: `npm run docker:test`,
2. To run single test suite: `docker exec -it base_nest_be npm run test -- test/modules/<file_name>.spec.ts`