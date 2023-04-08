const collections = require("../config/mongoCollections");
const paymentDetails = collections.paymentDetails;
const ObjectId = require("mongodb").ObjectId;
const validators = require("../validators");


const newPayment = async (customerId, paymentPlan, date, ammount) =>{

    customerId = customerId;
    paymentPlan = paymentPlan;
    date = date;
    ammount = ammount;

    payment = {
    customerId : customerId,
    paymentPlan : paymentPlan,
    date : date,
    ammount : ammount,


    }

    const paymentDetailsCollection  = await paymentDetails();
    const insertPayment = await paymentDetailsCollection.insertOne(payment)
    if (!insertPayment.acknowledged || !insertPayment.insertedId) throw { status: 500, message: "Could not create payment" };

	return true;

}

const getPayments = async(customerId)=>{

    customerId = customerId;
    const paymentDetailsCollection  = await paymentDetails();
    const payments = await paymentDetailsCollection.find({ customerId : customerId }).toArray();
    
    return payments;


};

const getTransaction = async(paymentId)=>{
    paymentId = paymentId;
    const paymentDetailsCollection  = await paymentDetails();
    const transaction = await paymentDetailsCollection.findOne({ _id : new ObjectId(paymentId) })
    return transaction



};


module.exports={
    newPayment,
    getPayments,
    getTransaction,
}