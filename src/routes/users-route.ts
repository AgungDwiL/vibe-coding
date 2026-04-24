import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post("/users", async ({ body, set }) => {
    const result = await usersService.registerUser(body);
    
    if (result.error) {
      set.status = 400;
    }
    
    return result;
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  })
  .post("/login", async ({ body, set }) => {
    const result = await usersService.loginUser(body);
    
    if (result.error) {
      set.status = 401;
    }
    
    return result;
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    })
  })
  .get("/users/current", async ({ headers, set }) => {
    const authHeader = headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const result = await usersService.getCurrentUser(token);

    if (result.error) {
      set.status = 401;
    }

    return result;
  });
