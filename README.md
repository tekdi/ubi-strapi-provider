# A) How base Strapi Project was setup in this repo?

## Use node 18
```
nvm use 18;
```

## Create strapi project
```
npx create-strapi@5.12.6 strapi
```

## Strapi project was initilized with these options
```
? Please log in or sign up. Skip

? Do you want to use the default database (sqlite) ? No

? Choose your default database client postgres
? Database name: uba_provider

? Host: 127.0.0.1

? Port: 5432

? Username: strapi_db_user

? Password: **************

? Enable SSL connection: No

? Start with an example structure & data? No

? Start with Typescript? Yes

? Install dependencies with npm? Yes

? Initialize a git repository? No
```

## Open strapi admin URL, create admin account, login

## Create custom collection
Later, a custom collection was created using Strapi admin UI. The files generated for custom collection were added to git repo

## Reference docs used
- https://docs.strapi.io/cms/quick-start
- https://docs.strapi.io/cms/installation/docker


# B) Running Strappi locally without docker
## Start postgres database on docker
```docker-compose up postgres -d```

##
```
cd strapi;
nvm use 18;
npm install;
```

## Update .env as needed to update DB details
```
nano .env
```

## Start in DEV mode
```
npm run dev
```


# C) Running Strappi locally with docker
## Update .env for docker
Example .env

```
# Strapi DB
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=uba_provider
DATABASE_USERNAME=strapi_db_user
DATABASE_PASSWORD=strapi_db_pass

# Strapi Secrets
JWT_SECRET=
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=

# Strai misc
NODE_ENV=production

# PGAdmin
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

## Start postgres, pgadmin database on docker
```
docker-compose up postgres pgadmin -d
```

## Build Strapi image locally
```
docker-compose build --no-cache strapi 
```

## Start Strapi service on docker
```
docker-compose up strapi -d
```

# D) Strapi Details
## If you want to access all components details for each record for collection pass `?populate=*`
```
http://localhost:1337/api/<collection>?populate=*
```