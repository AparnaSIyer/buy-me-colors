const express =  require('express')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

const app = express()
app.use(express.json());

const storeItems = new Map([
    [1,{priceInCents: 10000, name: "Learn English Phonetics"}],
    [2,{priceInCents: 20000, name: "Learn Basic English Grammar"}]
]);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})