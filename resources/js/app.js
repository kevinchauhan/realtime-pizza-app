let addToCart = document.querySelectorAll('.add-to-cart')

addToCart.forEach((addBtn)=>{
    addBtn.addEventListener('click',(e)=>{
        console.log(addBtn.dataset.pizza)
    })
})