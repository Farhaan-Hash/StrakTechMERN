import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("98765", 10),
    isAdmin: true,
  },
  {
    name: "Jon Wick",
    email: "jon@email.com",
    password: bcrypt.hashSync("98765", 10),
    isAdmin: false,
  },
  {
    name: "Alex Meat",
    email: "alex@email.com",
    password: bcrypt.hashSync("98765", 10),
    isAdmin: false,
  },
];

export default users;
