const express = require('express')
const cors = require('cors')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

const app = express()
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5500'
}))
app.use(express.static('public'))
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn English Phonetics" }],
    [2, { priceInCents: 20000, name: "Learn Basic English Grammar" }]
]);

//Indian Test Visa Card: 4000 0035 6000 0008
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'INR',
                        product_data: { name: storeItem.name },
                        unit_amount: storeItem.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success.html`,
            cancel_url: `${process.env.CLIENT_URL}/error.html`
        })
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});