const mongoose=require('mongoose')

const eventSchema=new mongoose.schema({
    eventName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    eventDate: {
        type: Date,
        default: Date.now()

    },
    createdBy: {
        type: String,
        required: true

    },
    invitees: {
        type: [String]
    },

    isDeleted: {
    type: Boolean,
    defult: false
}
  },  { timestamp: true });
module.exports = mongoose.model('event', eventSchema);
