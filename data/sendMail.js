const nodemailer = require("nodemailer");
const usersData = require("./users");
const salesInquiryData = require("./salesInquiry");


const generateRandomPassword = async() => {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "@";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const generateCredentialsandsendmail = async (id) => {
  try {
    console.log(id)
    const inquiryData = await salesInquiryData.getInquiryById(id);
    console.log(inquiryData);

    const password = await generateRandomPassword()
    //const password1=password
    const newUser = await usersData.createUser(inquiryData.customerName, inquiryData.customerName, "customer", inquiryData.customerEmail, 
    inquiryData.customerPhoneNumber, password);



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