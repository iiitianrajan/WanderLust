// server side schema validation
const Joi = require('joi'); // schema validation on server side

const listingSchema = Joi.object({ // This is joy schema not mongoose schema
    listing: Joi.object({ 
        title: Joi.string().required(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price: Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
})



const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating:Joi.number().required(),
        createdAt:Joi.date(),
    }).required()
});

module.exports = { listingSchema, reviewSchema };