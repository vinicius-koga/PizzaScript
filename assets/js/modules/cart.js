import pizzaJson from "./pizzaJson.js";

// ELEMENTS
const cartIcon = document.querySelector('.cart-icon');
const cartIconTooltip = document.querySelector('.cart-icon-tolltip');
const cartArea = document.querySelector('.cart-area');
const cartWindow = document.querySelector('.cart');
const closeBtn = document.querySelector('.cart .closeBtn');
const cartItem = document.querySelector('.cart-item');
const cartBody = document.querySelector('.cart-body');
const cartCheckout = document.querySelector('.cart-checkout');
const increaseBtn = document.querySelector('.cart-item .increase');
const orderBtn = document.querySelector('.order-btn');

// VARIABLES
export let cart = [];
const discountPercentage = 10;

// CART RENDER FUNCTIONS
function openCart() {
    renderCart();
    if(cart.length > 0) {
        cartArea.style.display = 'block';
        cartArea.style.opacity = 0;
        setTimeout(() => {
            cartArea.style.opacity = 1;
        })
        cartWindow.style.transform = 'translateX(320px)';
        setTimeout(() => {
            cartWindow.style.transform = 'translateX(0)';
        })
    }
}
function renderCart() {
    cart.forEach((item, index) => {
        let cartItemNode = cartItem.cloneNode(true);
        cartBody.append(cartItemNode);

        cartItemNode.setAttribute('key', index)
        cartItemNode.querySelector('img').src = item.img;
        cartItemNode.querySelector('.amount').innerText = item.amount;
        cartItemNode.querySelector('p').innerHTML = `${item.name}&nbsp;<span>(${renderPizzaSize(item.size).toUpperCase()})</span>`;        
    
        cartItemNode.querySelector('.increase').addEventListener('click', (e) => {
            increaseItemAmount(e);
        })
        cartItemNode.querySelector('.decrease').addEventListener('click', (e) => {
            decreaseItemAmount(e);
        })
    })

    cartCheckout.querySelector('.subtotal span').innerHTML = `R$${calcSubtotal()}`;
    cartCheckout.querySelector('.discount span').innerHTML = `R$${calcDiscount()}`;
    cartCheckout.querySelector('.total span').innerHTML = `R$${calcTotal()}`;
}
function closeCart() {
    cartWindow.style.transform = 'translateX(320px)';
    cartArea.style.opacity = 0;
    setTimeout(() => {
        cartArea.style.display = 'none';
    }, 300)
    cartBody.innerHTML = '';
}
function renderPizzaSize(sizeIndex) {
    switch (sizeIndex) {
        case 0:
            return 'pequena'
            break;

        case 1:
            return 'média'
            break;
        case 2:
            return 'grande'
            break
    }
}
function calcSubtotal() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    return total.toFixed(2)
}
function calcDiscount() {
    const discount = calcSubtotal() * (discountPercentage / 100);
    return discount.toFixed(2)
}
function calcTotal() {
    const total = calcSubtotal() - calcDiscount();
    return total.toFixed(2);
}

// CART FUNCTIONS
export function updateCartIcon() {
    let cartLength = cart.reduce((acc, item) => acc + item.amount , 0);
    if (cart.length > 0) {
        cartIconTooltip.innerText = cartLength
        cartIconTooltip.style.display = 'block';
    } else if (cart.length <= 0) {
        cartIconTooltip.style.display = 'none';
    }
}
function increaseItemAmount(e) {
    let cartItemIndex = e.target.closest('.cart-item').getAttribute('key');
    let pizzaStandardPrice = cart[cartItemIndex].price / cart[cartItemIndex].amount;

    cart[cartItemIndex].amount++;
    cart[cartItemIndex].price = cart[cartItemIndex].amount * pizzaStandardPrice;
    cartBody.innerHTML = '';
    renderCart();
}
function decreaseItemAmount(e) {
    let cartItemIndex = e.target.closest('.cart-item').getAttribute('key');

    if(cart[cartItemIndex].amount > 1) {
        let pizzaStandardPrice = cart[cartItemIndex].price / cart[cartItemIndex].amount;

        cart[cartItemIndex].amount--;
        cart[cartItemIndex].price = cart[cartItemIndex].amount * pizzaStandardPrice;
        cartBody.innerHTML = '';
        renderCart();

    } else if (cart[cartItemIndex].amount === 1) {
        cart.splice(cartItemIndex, 1);
        cartBody.innerHTML = '';
        renderCart();
    }
    
    if (cart.length === 0) {
        closeCart();
        cartIconTooltip.style.display = 'none';
    }
}

// CART EVENT LISTENERS
cartIcon.addEventListener('click', () => {
    openCart();
})
closeBtn.addEventListener('click', () => {
    closeCart();
})
cartArea.addEventListener('click', (e) => {
    if(e.target.classList.contains('backdrop')) {
        closeCart();
    }
})
orderBtn.addEventListener('click', () => {
    // ALERT THE ORDER
    let list = ''
    for(let i of cart) {
        list += `• ${i.amount} ${i.name} (${renderPizzaSize(i.size).toUpperCase()})\n`
    }
    alert(`Pedido:\n${list}\nTotal: ${calcTotal()}`)

    // POST SIMULATION
    fetch("...", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cart)
    });
})