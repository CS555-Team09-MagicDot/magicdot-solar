const express = require('express');
const router = express.Router();

router.route("/admin").get(async (req, res) => {
    let haserror = false;
    let isLoggedIn;
    try{
    //   if (req.session.admin) isLoggedIn = true;
    //   else isLoggedIn = false;
  
      return res.status(200).render('saleshomepage', {title: "Sales Dashboard"});
    //   return res.status(200).render('adminhomepage', {title: "Sales Dashboard", isLoggedIn : isLoggedIn, haserror:haserror});
    }catch(e){
      haserror = true; 
      return res.status(400).render('adminhomepage', { solution1: sol,title: "Flights Available", isLoggedIn : isLoggedIn,haserror:haserror,error:e });
    }
    return res.status(500).render('adminhomepage', { solution1: sol,title: "Flights Available", isLoggedIn : isLoggedIn,haserror:haserror,error:e });
    
});

module.exports = router;