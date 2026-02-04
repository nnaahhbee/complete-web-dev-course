document.addEventListener('DOMContentLoaded', () => {

    // Sample product data
    const products = [
        {id: 1, name: "Product 1", price: 56.980},
        {id: 2, name: "Product 2", price: 73.99},
        {id: 3, name: "Product 3", price: 90.670},
    ];

  
  // Load cart from localStorage
   let cart = JSON.parse(localStorage.getItem('cart')) || [];


   // Save cart to localStorage
   function saveCart() {
     localStorage.setItem('cart', JSON.stringify(cart));
   };


   // DOM elements
   const productList = document.getElementById("product-lists");
   const cartItems = document.getElementById("cart-item");
   const emptyCart = document.getElementById("empty-cart");
   const cartTotal = document.getElementById("cart-total");
   const totalPriceDisplay = document.getElementById("total-price");
   const checkOutBtn = document.getElementById("checkout-btn");


   // Render products
   products.forEach(product => {
     const productDiv =  document.createElement('div')
     productDiv.classList.add('product')
     productDiv.innerHTML = `<span>${product.name} - $${product.price.toFixed(2)}</span>
     <button data-id = "${product.id}">Add to cart</button>
     `;
     productList.appendChild(productDiv);
     saveCart();
     renderCart();
   });


   // Add to cart event listener
   productList.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
     const productId = parseInt(e.target.getAttribute('data-id'));
     const product = products.find(p => p.id === productId);
     addToCart(product)
     saveCart();
    }

   });


   // Add product to cart
   function addToCart(product){
    cart.push(product);
    saveCart();
    renderCart();
   }


   // Render cart items
   function renderCart(){
     cartItems.innerHTML = "";
     let totalPrice = 0;

     if(cart.length > 0){
      emptyCart.classList.add('hidden');
      cartTotal.classList.remove('hidden');
      cart.forEach((item, index) => {
        totalPrice += item.price;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');
        cartItem.innerHTML = `
         <span> ${item.name} - $${item.price.toFixed(2)} </span> <button data-id = ${item.id}>Remove</button>
        `
        cartItems.appendChild(cartItem);
        totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
        saveCart();
      });

     }else{
      emptyCart.classList.remove('hidden'); 
      cartTotal.classList.add('hidden');
      totalPriceDisplay.textContent = "$0.00"; 
     }
   }


   // Remove from cart event listener
   cartItems.addEventListener('click', (e) => {
    if(e.target.tagName === "BUTTON"){
      const itemId = parseInt(e.target.getAttribute('data-id'));
      removeFromCart(itemId);
      saveCart();
    }

   })


   // Remove item from cart
   function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if(itemIndex > -1) {
      cart.splice(itemIndex, 1);
      saveCart();
      renderCart();
    }
   }


   // Checkout button event listener
   checkOutBtn.addEventListener('click', () => {
    cart.length = 0;
    alert("Checkout successfully!");
    renderCart();
    console.log(cart);
   })
   
});

     