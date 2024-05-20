# Mern chat App!

Aplicación de mensajería instantánea.

## Instrucciones:

0. Crear cuenta gratuita en https://cloudinary.com/ para almacenar avatares de usuario.
1. Clonar proyecto
2. Instalar dependecias para chat-app-backend y chat-app-frontend: npm install
3. En la raiz de chat-app-frontend crear archivo .env y crea las siguientas variables:
   VITE_BASE_URL = http://localhost:5000/chat-app-api/v1
   VITE_SOCKET_URL = http://localhost:5000

4. En la raiz de chat-app-back-backend crear archivo .env y crea las siguientes variables:
   MONGO_URI = tu mongo uri
   ACCESS_TOKEN_KEY = tu access token key
   REFRESH_TOKEN_KEY = tu refresh token key
   NODE_ENV = dev o production
   ACCESS_TOKEN_EXP = 15m
   REFRESH_TOKEN_EXP = 2d
   CLOUDINARY_CLOUD_NAME = tu cloudinary cloud name
   CLOUDINARY_API_KEY = tu cloudinary api key
   CLOUDINARY_API_SECRET_KEY = tu cloudinary api secret key
   ORIGIN = https://dirección-de-mi-frontend-en-la-web/chat-app-api/v1 (*solo producción)

   KEEP_ALIVE_URL = 'http://dirección-de-mi-backend-en-la-web/chat-app-api/v1/keep-alive' (*solo si es requerido)

5. En chat-app-backend: npm run dev
6. En chat-app-frontend: npm run dev
