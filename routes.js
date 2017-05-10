const router = require('express').Router();

router.get('/',(req,res,next)=>{
  res.send('Hi api here');
})


module.exports = router;
