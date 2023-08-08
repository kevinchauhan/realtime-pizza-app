import axios from "axios"  // production level library used for server requests
import initAdmin from "./admin"
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

// admin 
initAdmin()


// single-order-status-page ---------------------------------------------->
const statuses = document.querySelectorAll('.status_line')
const inputOrder = JSON.parse(document.querySelector('#hiddenInput').value)

// update status
function updateStatus(order) {
    let stepCompleted = true
    const small = document.createElement('small')

    statuses.forEach(status => {
        if (stepCompleted) {
            status.classList.add('step-completed')
            small.innerHTML = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(small)
        }

        if (status.dataset.status === order.status) {
            stepCompleted = false

            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
            if (order.status === 'completed'){
                status.classList.add('completed')
            }
        }
    })

}

updateStatus(inputOrder)