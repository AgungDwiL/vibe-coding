import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Vibe Coding API',
        version: '1.0.0',
        description: 'Dokumentasi API untuk aplikasi Vibe Coding'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .use(usersRoute)
  .get("/", () => ({
    message: "Hello Elysia",
    status: "online",
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
