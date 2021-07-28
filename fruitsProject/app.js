const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true,  useUnifiedTopology: true });


// const person = new Person({
//   name: "John",
//   age: 37
// });

// person.save()

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Fruit must be given a name"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);

// const pineapple = new Fruit({
//   name: "Pineapple",
//   score: 10,
//   review: "so good"
// });

// pineapple.save();

// const person = new Person({
//   name: "Amy",
//   age: 12,
//   favoriteFruit: pineapple
// });

// person.save();

const strawberry = new Fruit({
  name: "Strawberry",
  rating: 10,
  review: "2nd best"
});

// strawberry.save();

Person.updateOne({name: "John"}, {favoriteFruit: strawberry}, (err) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log("succ");
  }
});

// const fruit = new Fruit({
//   name: "Apple",
//   rating: 7,
//   review: "aight"
// });

// fruit.save()

// const kiwi = new Fruit({
//   name: "Kiwi",
//   rating: 8,
//   review: "aight too"
// });

// const orange = new Fruit({
//   name: "Orange",
//   rating: 9,
//   review: "Juice mmm"
// });

// Fruit.insertMany([kiwi, orange], (err) => {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("success");
//   }
// });

Fruit.find((err, fruits) => {
  if (err) {
    console.log(err);
  }
  else {
    mongoose.connection.close();

    fruits.forEach((obj) => console.log(obj.name));
  }
});

// const lemon = new Fruit({
//   name: "Lemon",
//   rating: 10
// });

// lemon.save();

// Fruit.updateOne({_id: "60f9d22973abca412c10cfd6"}, {review: "best"}, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("Success")
//   }
// });

// Fruit.deleteOne({_id: "60f9d2320600013488f4fe70"}, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("successfully deleted");
//   }
// });

// Person.deleteMany({name: "John"}, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("Obliterated all the Johns");
//   }
// });