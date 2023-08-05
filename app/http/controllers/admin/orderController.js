const order = require("../../../models/order")

function orderController() {
    return {

        index(req, res) {
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
                .populate('customerId', '-password')
                .exec()
                .then(orders => {
                    if(req.xhr){
                        return res.json(orders)
                    }
                    res.render('admin/orders')
                })
                .catch(err => console.log(err))
        }

    }
}

module.exports = orderController