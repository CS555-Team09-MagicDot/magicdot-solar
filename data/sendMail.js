const nodemailer = require("nodemailer");
const usersData = require("./users");
const salesInquiryData = require("./salesInquiry");
const collections = require("../config/mongoCollections");
const salesInquiry = collections.salesInquiry;
const ObjectId = require("mongodb").ObjectId;

const generateRandomPassword = async () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "@1";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const generateCredentialsandsendmail = async (id) => {
  try {
    console.log(id);
    const inquiryData = await salesInquiryData.getInquiryById(id);
    // console.log(inquiryData);

    const password = await generateRandomPassword();
    let phoneNumber = inquiryData.customerPhoneNumber;
    phoneNumber = phoneNumber.replace("-", "");
    // console.log("UpdatesPhoneNumber" + phoneNumber);
    // console.log("password" + password);
    //const password1=password
    const newUser = await usersData.createUser(
      inquiryData.customerName,
      inquiryData.customerName,
      "customer",
      inquiryData.customerEmail,
      inquiryData.customerPhoneNumber,
      password
    );

    console.log(newUser);
    console.log(newUser._id.toString());

    const salesInquiryCollection = await salesInquiry();
    const updateInquiry = await salesInquiryCollection.updateOne({ _id: new ObjectId(id) }, { $set: { customerid: newUser._id.toString() } });

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "magicdot555@outlook.com",
        pass: "Agile@123",
      },
    });

    let mailoptions = {
      from: "magicdot555@outlook.com",
      to: inquiryData.customerEmail,
      subject: "New Account Credentials",
      html: `Hello ${inquiryData.customerName},<br><br>
                Your account has been created successfully. Here are your login credentials:<br>
                Email: ${inquiryData.customerEmail}<br>
                Password: ${password}<br><br>
                Best regards,<br>
                MagicDot`,
    };
    transporter.sendMail(mailoptions, function (error, info) {
      if (error) console.log(error);
    });

    return true;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  generateCredentialsandsendmail,
};
