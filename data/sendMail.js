const nodemailer = require("nodemailer");
const usersData = require("./users");
const salesInquiryData = require("./salesInquiry");

const generateCredentialsandsendmail = async (id) => {
  try {
    console.log(id)
    const inquiryData = await salesInquiryData.getInquiryById(id);
    console.log(inquiryData);
    
    const newUser = await usersData.createUser(inquiryData.customerName, inquiryData.customerName, "customer", inquiryData.customerEmail, 
    inquiryData.customerPhoneNumber, "abc@123");

    // Decrypt pw here

    const password = "abc@123";

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "magicdot555@outlook.com",
            pass: "Agile@123",
        },
    });
    
    let  mailoptions ={
        from : "magicdot555@outlook.com",
        to: inquiryData.customerEmail,
        subject : "New Account Credentials",
        html: `Hello ${inquiryData.customerName},<br><br>
                Your account has been created successfully. Here are your login credentials:<br>
                Email: ${inquiryData.customerEmail}<br>
                Password: ${password}<br><br>
                Best regards,<br>
                MagicDot`
    };
    
    transporter.sendMail(mailoptions, function(error,info){
        if(error)
        console.log(error);
    });

    return true;

  } catch (e) {
    console.log(e);
  }
};

module.exports = {
    generateCredentialsandsendmail
};