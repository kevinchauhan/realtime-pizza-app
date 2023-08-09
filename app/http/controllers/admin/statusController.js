const order = require('../../../models/order')

function statusConrtoller() {
    return {
        update(req, res) {
            order.updateOne({ _id: req.body.orderId },{status: req.body.status})
            .then(data=>{
                // emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                
                res.redirect('/admin/orders')
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
}

module.exports = statusConrtoller