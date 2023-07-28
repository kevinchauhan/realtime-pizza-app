const Menu = require('../../models/menu')
function homeController() {
    return {
        async index(req, res) {
            // method - 1
            // Menu.find().then((pizzas) => {
            //     console.log(pizzas)
            //     return res.render('home', { pizzas })
            // })

            // method - 2
            const pizzas = await Menu.find()
            return res.render('home', { pizzas })
        }
    }
}

module.exports = homeController