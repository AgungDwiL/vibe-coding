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
  });
