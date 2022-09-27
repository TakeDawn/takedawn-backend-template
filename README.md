# takedawn-backend-template

## Usage
You can use this template as a base for a Node.js - Express - TypeScript project.  
Simply click the **Use this template** button above or clone the repo directly.

## Configuration

### .env file
Your basic .env file should look like this :  
```
PORT=yourPort
CORS_WHITELIST=yourWhiteList
DB_HOST=databaseHost
DB_SCHEMA=databaseSchema
DB_USER=databaseUser
DB_PASSWORD=databasePassword
```

### migrations
By default, the kysely implementation will look for a `migration` folder at the root of the project.  
If you want to locate your migration folder somewhere else, simply change the path of the folder in `src/global/database/index.ts`.