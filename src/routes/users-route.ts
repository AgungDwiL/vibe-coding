import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .derive(({ headers }) => {
    const authHeader = headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    return { token };
  })
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
  .get("/users/current", async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const result = await usersService.getCurrentUser(token);

    if (result.error) {
      set.status = 401;
    }

    return result;
  })
  .delete("/users/logout", async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const result = await usersService.logoutUser(token);

    if (result.error) {
      set.status = 401;
    }

    return result;
  });
