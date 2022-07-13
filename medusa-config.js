const dotenv = require('dotenv');

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
  case 'prod':
    ENV_FILE_NAME = '.env';
    break;
  case 'local':
    ENV_FILE_NAME = '.env';
    break;
  default:
    ENV_FILE_NAME = '.env';
    break;
}

dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });

const DATABASE_URL =
  process.env.DATABASE_URL;

const REDIS_URL = process.env.REDIS_URL;

const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  `medusa-plugin-restock-notification`,
  {
    resolve: `medusa-plugin-strapi`,
    options: {
      strapi_medusa_user: 'roicoroy@yahoo.com.br',
      strapi_medusa_password: 'Rwbento123!',
      strapi_url: 'http://localhost',
      strapi_port: '1337'
    }
  },
  {
    resolve: `medusa-plugin-nodemailer`,
    options: {
      fromEmail: "noreply@mercadoamigao.com",

      host: process.env.GOOGLE_SMTP_HOST,
      port: process.env.GOOGLE_SMTP_PORT,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_SENDER_ADDRESS,
        pass: process.env.EMAIL_SENDER_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
      requireTLS: true,
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: `medusa-file-cloudinary`,
    options: {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    },
  },
];

const ADMIN_CORS = process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001,http://localhost:7002,http://localhost:1337,http://localhost:9000,http://localhost:9001';
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8100,http://localhost:8101,http://localhost:8000,http://localhost:8001,capacitor://localhost,http://localhost:1337,http://localhost:4200,http://localhost:4201,http://localhost:9000,http://localhost:9001';

module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
  },
  plugins,
};
