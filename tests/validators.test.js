const validators = require("../validators");
const ObjectId = require("mongodb").ObjectId;

test("Should return the processed string", () => {
	expect(validators.validateString("String Value", "A field")).toBe("String Value");
});

let testID = new ObjectId();
testID = testID.toString();

test("Should return string value of object ID", () => {
	expect(validators.validateId(testID, "Test ID")).toBe(testID);
});

test("Should return first name string", () => {
	expect(validators.validateName("John", "first name")).toBe("John");
});

test("Should return last name string", () => {
	expect(validators.validateName("Doe", "last name")).toBe("Doe");
});

test("Should return role string in lowercase for valid role name", () => {
	expect(validators.validateRole("Operational Manager")).toBe("operational manager");
});

test("Should return email string value", () => {
	expect(validators.validateEmail("B4zvI@example.com")).toBe("b4zvi@example.com");
});

test("Should return valid phone number", () => {
	expect(validators.validatePhone("1234567890")).toBe("1234567890");
});

test("Should return string value of valid Subject", () => {
	expect(validators.validateSubject("Test Subject")).toBe("Test Subject");
});

test("Should return string value of valid Message", () => {
	expect(validators.validateMessage("Test Message with five words")).toBe("Test Message with five words");
});

test("Should return string value of valid Password", () => {
	expect(validators.validatePassword("Test@123")).toBe("Test@123");
});
