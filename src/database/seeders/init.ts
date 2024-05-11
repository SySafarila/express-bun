import { store } from "../../models/user";
import DB from "../../utils/database";

const seedInit = async () => {
  const user = await store({
    full_name: "Super Admin",
    email: "super.admin@admin.com",
    password: Bun.password.hashSync("password"),
  });
  const role = await DB.role.create({
    data: {
      name: "super-admin",
    },
  });
  let prepareRoleHasPermissions: Array<{
    permission_id: number;
    role_id: number;
  }> = [];
  await DB.permission.createMany({
    data: [
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
  });
  const rolePermissions = await DB.permission.findMany({
    where: {
      name: {
        contains: "roles",
      },
    },
    select: {
      id: true,
    },
  });
  rolePermissions.forEach((permission) => {
    prepareRoleHasPermissions.push({
      permission_id: permission.id,
      role_id: role.id,
    });
  });

  await DB.roleHasPermission.createMany({
    data: prepareRoleHasPermissions,
  });
  await DB.userHasRole.create({
    data: {
      user_id: user.id,
      role_id: role.id,
    },
  });
};

await seedInit();
