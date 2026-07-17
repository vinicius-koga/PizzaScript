import pizzaJson from './pizzaJson.js';
import { renderModal } from './modal.js';
import { cart } from './cart.js';
import { updateCartIcon } from './cart.js';

// CLONE NODES FOR EACH PIZZA
let menuItem = document.querySelector('.menu-item');
pizzaJson.forEach((item, index) => {
    let menuItemNode = menuItem.cloneNode(true);
    document.querySelector('#menu-container').append(menuItemNode);

    menuItemNode.setAttribute('key', index);
    menuItemNode.querySelector('.menu-item-left img').src = item.img;
    menuItemNode.querySelector('.menu-item-left img').alt = item.name;
    menuItemNode.querySelector('.menu-item-right .menu-item-title').innerText = item.name;
    menuItemNode.querySelector('.menu-item-right .menu-item-description').innerText = item.description;
    menuItemNode.querySelector('.menu-item-right .menu-item-price span').innerText = item.price[1].toFixed(2);
});

// MENU ITEM EVENTLISTENER(CLICK)
let menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (e) => {
        
        // +CART BUTTON
        if (e.target.closest('.menu-item-btn')) {
            menuCartPush(e);
            return;
        }

        // OPEN MODAL
        let pizzaIndex = e.target.closest('.menu-item').getAttribute('key');
        renderModal(pizzaIndex);
    })
})

// CART PUSH FUNCTION
function menuCartPush(e) {
    let closestPizza = e.target.closest('.menu-item').getAttribute('key');

    let pizzaObj = {
        id: pizzaJson[closestPizza].id,
        name: pizzaJson[closestPizza].name,
        img: pizzaJson[closestPizza].img,
        amount: 1,
        price: pizzaJson[closestPizza].price[1],
        size: 1,
    }

    for(let i in cart) {
        if(cart[i].id === pizzaJson[closestPizza].id && cart[i].size === 1) {
            cart[i].amount += 1;
            updateCartIcon();
            return
        }
    }

    cart.push(pizzaObj);
    updateCartIcon();
}