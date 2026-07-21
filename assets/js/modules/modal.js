import pizzaJson from './pizzaJson.js';
import { cart } from './cart.js';
import { updateCartIcon } from './cart.js';

// ELEMENTS
const modal = document.querySelector('.modal-area');
const modalBox = modal.querySelector('.modal');
const closeBtn = modal.querySelector('.closeBtn');
const decreaseBtn = modal.querySelector('.decrease');
const increaseBtn = modal.querySelector('.increase');
const sizeBtns = modal.querySelectorAll('.size-btn');
const modalPrice = modal.querySelector('.modal-price');
const modalAmount = modal.querySelector('.qt');
const modalAdd2CartBtn = modal.querySelector('.modalAdd2CartBtn');

// VARIABLES
let selectedPizza;
let pizzaPrice;
let pizzaImg;
let selectedSize = 1;
let selectedAmount = 1;

// MODAL RENDER FUNCTIONS
function openModal() {
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    })
    modalBox.style.opacity = '0';
    setTimeout(() => {
        modalBox.style.opacity = '1';
    })
    modalBox.style.transform = 'translateY(-30px)';
    setTimeout(() => {
        modalBox.style.transform = 'translateY(0)';
    })
}
export function renderModal(pizzaIndex) {
    selectedPizza = pizzaIndex;
    pizzaPrice = pizzaJson[selectedPizza].price[selectedSize];
    pizzaImg = pizzaJson[selectedPizza].img;
    openModal();

    modal.querySelector('img').src = pizzaImg;
    modal.querySelector('h1').innerText = pizzaJson[selectedPizza].name;
    modal.querySelector('p').innerText = pizzaJson[selectedPizza].description;
    modal.querySelector('.modal-price').innerText = `R$${pizzaPrice.toFixed(2)}`;
    modal.querySelector('.qt').innerText = selectedAmount;
    modal.querySelectorAll('.size').forEach((size, index) => {
        size.innerText = `(${pizzaJson[selectedPizza].sizes[index]})`
    })
    sizeBtns[selectedSize].classList.add('selected');
    sizeBtns.forEach((item, index) => {
        item.setAttribute('key', index)
    })
}
function closeModal() {
    selectedSize = 1;
    selectedAmount = 1;

    modal.querySelector('.selected').classList.remove('selected');

    modal.style.opacity = '0';
    modalBox.style.opacity = '0';
    modalBox.style.transform = 'translateY(-30px)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300)
}

// MODAL FUNCTIONS
function changePizzaSize(e) {
    const sizeKey = Number(e.target.closest('.size-btn').getAttribute('key'));

    modal.querySelector('.selected').classList.remove('selected');
    sizeBtns[sizeKey].classList.add('selected');

    selectedSize = sizeKey;
    pizzaPrice = pizzaJson[selectedPizza].price[selectedSize];

    selectedAmount = 1;

    modalAmount.innerText = selectedAmount;
    modalPrice.innerText = `R$${pizzaPrice.toFixed(2)}`;
}
function increasePizzaAmount() {
    selectedAmount++;

    modalAmount.innerText = selectedAmount;
    modalPrice.innerText = `R$${(pizzaPrice * selectedAmount).toFixed(2)}`;   
}
function decreasePizzaAmount() {
    selectedAmount--;

    if (selectedAmount === 0) {
        selectedAmount = 1;
        return
    }

    modalAmount.innerText = selectedAmount;
    modalPrice.innerText = `R$${(pizzaPrice * selectedAmount).toFixed(2)}`;
}
function modalCartPush() {
    let pizzaObj = {
        id: pizzaJson[selectedPizza].id,
        name: pizzaJson[selectedPizza].name,
        img: pizzaImg,
        amount: selectedAmount,
        price: pizzaPrice * selectedAmount,
        size: selectedSize,
    }

    for(let i in cart) {
        if(cart[i].id === pizzaJson[selectedPizza].id && cart[i].size === selectedSize) {
            cart[i].amount += selectedAmount;
            updateCartIcon();
            closeModal();
            return
        }
    }

    cart.push(pizzaObj);
    updateCartIcon();
    closeModal();
}

// MODAL EVENT LISTENERS
sizeBtns.forEach(size => {
    size.addEventListener('click', (e) => {
        changePizzaSize(e)
    })
})
increaseBtn.addEventListener('click', () => {
    increasePizzaAmount();
})
decreaseBtn.addEventListener('click', () => {
    decreasePizzaAmount();
})
modalAdd2CartBtn.addEventListener('click', () => {
    modalCartPush();
})
modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-area')) {
        closeModal();
    }
})
closeBtn.addEventListener('click', () => {
    closeModal();
})