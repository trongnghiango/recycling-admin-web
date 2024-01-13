print('Start #################################################################');

function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');
  db.createCollection('roles');

  db.api_keys.insert({
    key: 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj',
    permissions: ['GENERAL'],
    comments: ['To be used by the xyz vendor'],
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  db.roles.insertMany([
    {
      code: 'LEARNER',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'WRITER',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'EDITOR',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'TECHNICIAN',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'CUSTOMMER_CARE',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'ACCOUNTANT',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'RECEPTIONIST',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'DESIGN_DOCTOR',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'CLINICAL_DOCTOR',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'ADMIN',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  db.users.insert({
    name: 'Admin',
    email: 'admin@teethapp.com',
    password: '$2b$10$k5DypIx3nkUWWcOOohw4GuW4ajV9.OUoHWogMmTgdcIPXVq/f2Qn.', // hash of password: changeit
    roles: db.roles
      .find({})
      .toArray()
      .map((role) => role._id),
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

seed('teeth-db', 'phonguser', 'Changeit');

print('END #################################################################');