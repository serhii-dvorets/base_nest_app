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