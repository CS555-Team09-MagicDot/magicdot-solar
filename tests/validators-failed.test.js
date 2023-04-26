const validators = require("../validators");
const ObjectId = require("mongodb").ObjectId;

test("Should throw for invalid string", () => {
	expect(() => validators.validateString(4545, "A field")).toThrow();
});

test("Should throw for invalid object ID", () => {
	expect(() => validators.validateId("adkjfhgbj879809", "Test ID")).toThrow();
});

test("Should throw for invalid first name", () => {
	expect(() => validators.validateName("John^&*", "first name")).toThrow();
});

test("Should throw for invalid last name", () => {
	expect(() => validators.validateName("oujhy80", "last name")).toThrow();
});

test("Should throw for invalid role name", () => {
	expect(() => validators.validateRole("Project Manager")).toThrow();
});

test("Should throw for invalid email", () => {
	expect(() => validators.validateEmail("B4zvIxample.com")).toThrow();
});

test("Should throw for invalid phone number", () => {
	expect(() => validators.validatePhone("Hi John")).toThrow();
});

test("Should throw for invalid Subject", () => {
	expect(() => validators.validateSubject()).toThrow();
});

test("Should throw for invalid Message", () => {
	expect(() => validators.validateMessage(8789809)).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("test@123")).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("test123")).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("test")).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("TEST")).toThrow();
});


test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("TEST123")).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword("@")).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword(['abc'])).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword(12345)).toThrow();
});

test("Should throw for invalid password", () => {
	expect(() => validators.validatePassword()).toThrow();
});
