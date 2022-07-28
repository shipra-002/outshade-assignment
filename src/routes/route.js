const express= require('express')
const router=express.Router();
const userController= require('../Controllers/userController')
const eventController=require('../controllers/eventController')
const middleware=require('../middleware/auth')

router.post('/createUser', userController.createUser)
router.post('/login', userController.login)
router.put('/logout', userController.logoutUser)
router.put('/resetPassword/:userId', userController.resetPassword)




router.post('/createEvent',middleware.authentication, eventController.createEvent)
router.get('/eventDetails/:eventId',middleware.authentication,middleware.authorisation, eventController.getEventById)
router.get('/events', eventController.getEvent)
router.put('/updateEvent/:eventId',middleware.authentication,middleware.authorisation, eventController.updateEvent)


module.exports=router;