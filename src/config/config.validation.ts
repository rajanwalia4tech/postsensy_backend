import * as Joi from 'joi';

export const envVariablesSchema = Joi.object({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'stg').required(),
    PORT: Joi.number(),
    MYSQL_DB_HOST: Joi.string().required().description('MySQL Database Hostname'),
    MYSQL_DB_PORT: Joi.string().required().description('MySQL Database Port'),
    MYSQL_DB_USERNAME: Joi.string().required().description('MySQL Database Username'),
    MYSQL_DB_PASSWORD: Joi.string().required().description('MySQL Database Password'),
    PRIMARY_EMAIL: Joi.string().required().description('primary email for sending emails'),
    MAIL_JET_PUBLIC_KEY: Joi.string().required().description('mailjet public key'),
    MAIL_JET_PRIVATE_KEY: Joi.string().required().description('mailjet private key'),
    // front end base url
    FRONTEND_BASE_URL: Joi.string().required().description('Frontend base url'),
    
    // linkedin 
    LINKEDIN_CLIENT_ID: Joi.string().required().description('linkedin clientId'),
    LINKEDIN_CLIENT_SECRET: Joi.string().required().description('linkedin client secret'),
    LINKEDIN_REDIRECT_URL : Joi.string().required().description('linkedin redirect url while connecting linkedin'),
})
.options({
    abortEarly: false,
  })
.unknown();
