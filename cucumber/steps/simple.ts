const { Then, Given } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

let numberOfPens = 0;
let total = 0;

Given("I buy {int} pens", async (num: number) => {
  numberOfPens = num;
});

Given("Each pen cost {int} vnd", async (price: number) => {
  total = numberOfPens * price;
});

Given("I have a coupon {int} vnd", async (discount: number) => {
  total = total - discount;
});

Then("Total amount should be equal {int} vnd", async (amount: number) => {
  expect(total).toEqual(amount);
});
