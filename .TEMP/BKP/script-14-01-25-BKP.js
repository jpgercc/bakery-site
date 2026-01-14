// ============================
// 'GLOBAL' VARIABLES (currentCategory SÓ EXISTE EM PRODUTOSHTML)
// ============================
let currentSlide = 0;
let currentCategory = 'todos';
let cart = [];

// ============================
// CART PERSISTENCE FUNCTIONS
// ============================

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('bocattoCart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('bocattoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ============================
// CART FUNCTIONS
// ============================

// Adicionar produto ao carrinho
window.addToCart = function(name, price, unit) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        if (unit === 'kg') {
            existingItem.quantity += 500; // Incremento de 0.5kg = 500g
        } else {
            existingItem.quantity += 1;
        }
    } else {
        cart.push({
            name: name,
            price: Math.round(price * 100), // Armazenar preço em centavos
            unit: unit,
            quantity: unit === 'kg' ? 1000 : 1 // Para kg, quantidade inicial em gramas (1kg = 1000g)
        });
    }

    saveCart();
    updateCart();
    showNotification(`${name} adicionado ao carrinho!`);
};

// Atualizar carrinho
function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartBadge = document.getElementById('cartBadge');
    
    // Atualizar badge - mostrar número de produtos diferentes, não quantidade total
    const totalItems = cart.length;
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Se carrinho vazio
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        return;
    }
    
    // Mostrar itens
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const unitLabel = item.unit === 'kg' ? 'kg' : item.unit === 'unidade' ? 'un' : item.unit;
        const quantityKg = item.unit === 'kg' ? (item.quantity / 1000).toFixed(1) : item.quantity;
        const quantityLabel = item.unit === 'kg' ? `${quantityKg} kg (${item.quantity}g)` : `${item.quantity} ${unitLabel}`;
        const pricePerUnit = (item.price / 100).toFixed(2); // Converter centavos para reais
        const subtotal = Math.round((item.price * item.quantity) / (item.unit === 'kg' ? 1000 : 1)); // Subtotal em centavos

        return `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${pricePerUnit} por ${item.unit}</p>
            </div>
            <div class="cart-item-controls">
                <div class="cart-quantity-controls">
                    <button onclick="decreaseQuantity(${index})" class="cart-qty-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                    </button>
                    <div class="cart-qty-display">
                        <input
                            type="number"
                            value="${quantityKg}"
                            min="${item.unit === 'kg' ? '0.1' : '1'}"
                            step="${item.unit === 'kg' ? '0.1' : '1'}"
                            class="cart-qty-input"
                            onchange="updateQuantity(${index}, this.value)"
                        >
                        <span class="cart-qty-label">${item.unit === 'kg' ? 'kg' : item.unit === 'unidade' ? 'un' : item.unit}</span>
                    </div>
                    <button onclick="increaseQuantity(${index})" class="cart-qty-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </button>
                </div>
                <button onclick="removeFromCart(${index})" class="cart-remove-btn" title="Remover">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
            <div class="cart-item-subtotal">
                ${item.unit === 'kg' ? `Peso: ${quantityLabel} | ` : `Quantidade: ${item.quantity} ${unitLabel} | `}Subtotal: R$ ${(subtotal / 100).toFixed(2)}
            </div>
        </div>
    `}).join('');
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + Math.round((item.price * item.quantity) / (item.unit === 'kg' ? 1000 : 1)), 0);
    document.getElementById('cartTotalPrice').textContent = `R$ ${(total / 100).toFixed(2)}`;
}

// Diminuir quantidade
window.decreaseQuantity = function(index) {
    if (cart[index].unit === 'kg') {
        cart[index].quantity = Math.max(100, cart[index].quantity - 500); // Mínimo 100g, decremento de 500g
    } else {
        cart[index].quantity = Math.max(1, cart[index].quantity - 1);
    }
    saveCart();
    updateCart();
};

// Aumentar quantidade
window.increaseQuantity = function(index) {
    if (cart[index].unit === 'kg') {
        cart[index].quantity += 500; // Incremento de 500g = 0.5kg
    } else {
        cart[index].quantity += 1;
    }
    saveCart();
    updateCart();
};

// Atualizar quantidade manualmente
window.updateQuantity = function(index, value) {
    const quantity = parseFloat(value);
    if (quantity > 0) {
        if (cart[index].unit === 'kg') {
            cart[index].quantity = Math.max(100, Math.round(quantity * 1000)); // Converter kg para gramas, mínimo 100g
        } else {
            cart[index].quantity = Math.max(1, Math.round(quantity));
        }
    } else {
        cart[index].quantity = cart[index].unit === 'kg' ? 100 : 1; // Mínimo 100g para kg
    }
    saveCart();
    updateCart();
};

// Remover do carrinho
window.removeFromCart = function(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCart();
    showNotification(`${itemName} removido do carrinho`);
};

// Toggle cart modal
window.toggleCart = function() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        const isActive = cartModal.classList.contains('active');
        if (isActive) {
            cartModal.classList.remove('active');
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            cartModal.classList.add('active');
            cartModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
};

// Finalizar compra via WhatsApp
window.finalizarCompra = function() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }

    let message = '*BOCATTO - Novo Pedido*%0A%0A';
    message += '*Itens do Pedido:*%0A%0A';

    cart.forEach((item, index) => {
        const unitText = item.unit === 'kg' ? 'kg' : item.unit === 'unidade' ? 'un' : item.unit;
        const quantityDisplay = item.unit === 'kg' ? (item.quantity / 1000).toFixed(1) : item.quantity;
        const pricePerUnit = (item.price / 100).toFixed(2);
        const subtotal = Math.round((item.price * item.quantity) / (item.unit === 'kg' ? 1000 : 1)) / 100;
        message += `${index + 1}. *${item.name}*%0A`;
        message += `   Quantidade: ${quantityDisplay} ${unitText}%0A`;
        message += `   Preço unitário: R$ ${pricePerUnit} / ${unitText}%0A`;
        message += `   Subtotal: R$ ${subtotal.toFixed(2)}%0A%0A`;
    });

    const total = cart.reduce((sum, item) => sum + Math.round((item.price * item.quantity) / (item.unit === 'kg' ? 1000 : 1)), 0) / 100;
    message += `*TOTAL: R$ ${total.toFixed(2)}*%0A%0A`;
    message += '-------------------------------------%0A';
    message += 'Aguardo confirmação do pedido!';

    const phoneNumber = '5532421628';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Limpar carrinho após finalizar compra
    cart = [];
    saveCart();
    updateCart();

    window.open(whatsappUrl, '_blank');
};

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2500);
}

// ============================
// MOBILE MENU TOGGLE
// ============================
window.toggleMenu = function() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
};

// ============================
// CAROUSEL FUNCTIONALITY
// ============================
function initCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    window.goToSlide = function(index) {
        showSlide(index);
    };

    showSlide(0);
    setInterval(nextSlide, 5000);
}

// ============================
// NAVBAR SCROLL EFFECT
// ============================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================
// PRODUCTS FILTERING
// ============================
function initProductsFilters() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;

    window.filterByCategory = function(category) {
        currentCategory = category;
        
        document.querySelectorAll('.produtos-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        filterProducts();
    };

    window.filterProducts = function() {
        const searchTerm = searchInput.value.toLowerCase();
        const products = document.querySelectorAll('.produtos-card');
        let visibleCount = 0;

        products.forEach(product => {
            const category = product.getAttribute('data-category');
            const name = product.getAttribute('data-name').toLowerCase();
            
            const categoryMatch = currentCategory === 'todos' || category === currentCategory;
            const searchMatch = name.includes(searchTerm);
            
            if (categoryMatch && searchMatch) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };
}

// ============================
// CLOSE CART ON OUTSIDE CLICK
// ============================
document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    if (cartModal && e.target === cartModal) {
        toggleCart();
    }
});

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initCarousel();
    initNavbar();
    initProductsFilters();
    updateCart();
});
