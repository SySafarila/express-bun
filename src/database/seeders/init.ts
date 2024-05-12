import { store } from "../../models/user";
import DB from "../../utils/database";

const seedInit = async () => {
  const user = await store({
    full_name: "Super Admin",
    email: "super.admin@admin.com",
    password: Bun.password.hashSync("password"),
  });
  await DB.role.create({
    data: {
      name: "super-admin",
      permissions: {
        create: [
          {
            name: "roles-create",
          },
          {
            name: "roles-read",
          },
          {
            name: "roles-update",
          },
          {
            name: "roles-delete",
          },
        ],
      },
      users: {
        connect: {
          id: user.id,
        },
      },
    },
  });
};

await seedInit();
