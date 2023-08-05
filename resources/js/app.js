import axios from "axios"  // production level library used for server requests
import initAdmin from "./admin"

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cart-counter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
    .then(res => cartCounter.innerText = res.data.totalQty)
    .catch(err=>console.log(err))
}

addToCart.forEach((addBtn) => {
    addBtn.addEventListener('click', (e) => {
        let pizza = JSON.parse(addBtn.dataset.pizza)
        updateCart(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.style.display = 'none' 
    },2000)
}

console.log(initAdmin)
// admin
initAdmin()