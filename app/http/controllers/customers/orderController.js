const moment = require('moment/moment')
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
                delete req.session.cart
                res.redirect('/customer/orders')
            }).catch(err => {
                console.log(err)
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            })
        },

        // customer order page
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })

            // to remove order success alert on back and forward button 
            res.header('Cache-Control', 'no-cache,private,no-this.store,must-revalidate,max-stale=0,post-cehck=0,precheck=0')

            res.render('customer/orders', { orders, moment: moment })
        },

        // single order page
        async show(req, res) {
            try {
                // fetching order from db
                const order = await Order.findById(req.params.id)
                
                // Authenticate(same customer or not)
                if (req.user.id.toString() === order.customerId.toString()) {
                    // single order status page for matched item
                    return res.render('customer/singleOrder', { order })
                }

                return res.redirect('/') // 404 error

            } catch (err) {
                return res.redirect('/') // 404 error
            }
        }
    }
}

module.exports = orderController