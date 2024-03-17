import * as Joi from 'joi';

export const envVariablesSchema = Joi.object({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'stg').required(),
    PORT: Joi.number(),
    MYSQL_DB_HOST: Joi.string().required().description('MySQL Database Hostname'),
    MYSQL_DB_PORT: Joi.string().required().description('MySQL Database Port'),
    MYSQL_DB_USERNAME: Joi.string()
      .required()
      .description('MySQL Database Username'),
    MYSQL_DB_PASSWORD: Joi.string()
      .required()
      .description('MySQL Database Password'),
})
.options({
    abortEarly: false,
  })
.unknown();
