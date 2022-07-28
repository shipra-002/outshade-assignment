const eventModel = require('../model/eventModel')
const userModel = require('../model/userModel')
const mongoose = require('mongoose')
const {isValidRequestBody,isValid,isValidObjectId} = require('../validation/validator');



const createEvent = async function(req,res){

let data = req.body

const {eventName, description, eventDate, createdBy, invitees} = data
if (!isValidRequestBody(data))
return res.status(400).send({ status: false, msg: "Please Enter some data" })

const allInvaitees = await userModel.find().select({email:1, _id:0})
// console.log(allInvaitees)
let arr = []
for(let i = 0; i<allInvaitees.length;i++){
    if(allInvaitees[i]){
        arr.push(allInvaitees[i].email)
    //    (temp)
    
  }
}
console.log(arr)

const finalData = await eventModel.create({eventName, description,eventDate:Date.now(), createdBy, invitees:arr})

return res.status(201).send(finalData)
}


const getEventById = async function(req,res){
    let eventId = req.params.eventId
    
    if (!isValid(eventId)) {
        return  res.status(400).send({ status: false, message: "Please , provide event id path params" })
        }
        if(!isValidObjectId(eventId)){
            return res.status(400).send({status:false,message:"Id is invalid"})
        }
       
    let findEvent = await eventModel.findById({_id:eventId})
    return res.status(200).send({status:true, data:findEvent})

}


const getEvent = async function(req,res){
   const getData = req.query
   const{eventName, sortData}=getData
let filter ={}
   if (getData.eventName) {

    let newOne = await eventModel.find().select({eventName:1, _id:0})
    let arr=[]
    for (let i = 0; i < newOne.length; i++) {
        let element = newOne[i].eventName
        let checkVar = element.includes(eventName)
        
    if(checkVar){
         arr.push(newOne[i].eventName)

       }
       console.log(arr)
      
     }
     filter['eventName']=arr
      let findData= await eventModel.find(filter)
  
  return res.status(200).send({status:true, data:findData})
    }
 


   if(sortData ==1){
    const sortedData = await eventModel.find().sort({eventName:1})
    return res.send({data:sortedData})
   }
   if(sortData ==-1){
    const sortedData = await eventModel.find().sort({eventName:-1})
    return res.send({data:sortedData})
   }

    // const eventData = await eventModel.find()
    // return res.send(eventData)
    let page = req.query.page 
    let limit = 10;
    const pages = await eventModel.find().skip((page * limit) - limit).limit(limit)
    
    return res.status(200).send(pages)

   
  }



  const updateEvent = async function (req, res) {

        try {
          const eventId = req.params.eventId
          const data = req.body
      
          if (!isValid(eventId)) {
            res.status(400).send({ status: false, message: "Please , provide eventId in path params" })
            return
          }
    
          if(!isValidObjectId(eventId)){
              return res.status(400).send({status:false,msg:'please provide a valid eventId'})
          }

      
          const event= await eventModel.findOne({ _id: eventId, isDeleted: false })  
          if(!isValidRequest(dataForUpdation)) {
            return res.status(400).send({status: false, message: 'please provide data for updation'})
          }
    
          const {eventName} = data
      
            if (!isValid(eventName)) {
              res.status(400).send({ status: false, message: 'please provide title' })
              return
            }
      
            const duplicateTitle = await eventModel.findOne({eventName: eventName})
            if (duplicateTitle) {
              res.status(400).send({ status: false, message: "This title already in use ,please provide another one" })
              return
            }
          
           
    
            const updateData = {eventName:eventName}
       
          const updatedBook = await eventModel.findOneAndUpdate({ _id: eventId }, {...updateData}, { new: true })
          //let x = updatedBook.length
          return res.status(200).send({ status: true, message: "Book updated successfully", data: updatedBook })
        }
        catch (err) {
          console.log(err)
          res.status(500).send({ status: false, msg: err.message })
        }
      }
    

module.exports.createEvent=createEvent;
module.exports. getEventById=getEventById;
module.exports. getEvent=getEvent;
module.exports.updateEvent= updateEvent;
