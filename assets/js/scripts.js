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
window.addToCart = function(name, description) {
    const existingItem = cart.find(item => item.name === name);

    if (!existingItem) {
        cart.push({
            name: name,
            description: description || ''
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
    
    // Atualizar badge - mostrar número de produtos
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
        // Limitar descrição a 300 caracteres
        const description = item.description || '';
        const truncatedDescription = description.length > 300 
            ? description.substring(0, 300) + '...' 
            : description;

        return `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                ${truncatedDescription ? `<p class="cart-item-description">${truncatedDescription}</p>` : ''}
            </div>
            <div class="cart-item-controls">
                <button onclick="removeFromCart(${index})" class="cart-remove-btn" title="Remover">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `}).join('');
    
    // Calcular total de itens
    document.getElementById('cartTotalPrice').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
}

// Remover do carrinho
window.removeFromCart = function(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
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
        message += `${index + 1}. ${item.name}%0A`;
    });

    message += '%0A-------------------------------------%0A';
    message += 'Gostaria de informações sobre disponibilidade e valores!';

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
            const description = (product.getAttribute('data-description') || '').toLowerCase();
            
            const categoryMatch = currentCategory === 'todos' || category === currentCategory;
            const searchMatch = name.includes(searchTerm) || description.includes(searchTerm);
            
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