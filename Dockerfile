FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Asegurar que la carpeta de subidas existe
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
