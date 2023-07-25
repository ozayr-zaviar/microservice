const { User, Magazine, Subscription } = require("./models");
const { addYears } = require("date-fns");

async function populateUsers() {
  await User.sync({ force: true });

  await User.bulkCreate([
    {
      username: "john_doe",
      email: "john_doe@example.com",
      password: "password",
    },
    {
      username: "jane_smith",
      email: "jane_smith@example.com",
      password: "password",
    },
  ]);

  console.log("Users populated!");
}

async function populateMagazines() {
  await Magazine.sync({ force: true });

  await Magazine.bulkCreate([
    { name: "Magazine A", publisher: "Publisher A" },
    { name: "Magazine B", publisher: "Publisher B" },
  ]);

  console.log("Magazines populated!");
}

async function populateSubscriptions() {
  await Subscription.sync({ force: true });
  const users = await User.findAll();
  const magazines = await Magazine.findAll();

  await Subscription.bulkCreate([
    {
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-12-31"),
      UserId: users[0].id,
      MagazineId: magazines[0].id,
    },
    {
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-12-31"),
      UserId: users[1].id,
      MagazineId: magazines[1].id,
    },
  ]);

  console.log("Subscriptions populated!");
}

async function populateAll() {
    await populateUsers();
    await populateMagazines();
    await populateSubscriptions();
    console.log("Data populated successfully.");
  }
  
populateAll();
