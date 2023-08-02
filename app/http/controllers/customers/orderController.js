const Order = require('../../../models/order')

function orderController() {
    return {
        // storing into database
        store(req, res) {
            const { phone, address } = req.body
            // checking
            if (!phone || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                req.flash('success', 'Order placed successfully')
                res.redirect('/')
            }).catch(err => {
                console.log(err)
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            })
        },

        // customer orrder page
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id })
            console.log(orders)
        }
    }
}

module.exports = orderController