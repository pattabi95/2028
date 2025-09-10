FROM public.ecr.aws/docker/library/node:18-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY /frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:stable-alpine
COPY --from=builder /app/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]