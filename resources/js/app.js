import axios from "axios"  // production level library used for server requests
import { initAdmin } from "./admin"
import moment from "moment"

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cart-counter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
        .then(res => cartCounter.innerText = res.data.totalQty)
        .catch(err => console.log(err))
}

addToCart.forEach((addBtn) => {
    addBtn.addEventListener('click', (e) => {
        let pizza = JSON.parse(addBtn.dataset.pizza)
        updateCart(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.style.display = 'none'
    }, 2000)
}

// single-order-status-page ---------------------------------------------->
const statuses = document.querySelectorAll('.status_line')
const inputOrder = document.querySelector('#hiddenInput')

const small = document.createElement('small')

// update status
function updateStatus(order) {
    let stepCompleted = true

    // clear old classes
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    statuses.forEach(status => {
        if (stepCompleted) {
            status.classList.add('step-completed')
        }

        if (status.dataset.status === order.status) {
            stepCompleted = false
            small.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(small)

            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }

            if (order.status === 'completed') {
                status.classList.add('completed')
            }
        }
    })

}
let order
if (inputOrder) {
    order = JSON.parse(inputOrder.value)
    updateStatus(order)
}


// Socket
let socket = io()

// customer join
if (order) {
    socket.emit('join', `order_${order._id}`)
}
// admin join
let adminAreaPath = window.location.pathname
if (adminAreaPath.includes('admin')) {
    // admin 
    initAdmin(socket)

    socket.emit('join', 'adminRoom')
}

// listening event from socket
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...inputOrder }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status

    updateStatus(updatedOrder)
})
