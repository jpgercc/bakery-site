// ============================
// GLOBAL VARIABLES
// ============================
let currentSlide = 0;
let currentCategory = 'todos';

// ============================
// CAROUSEL FUNCTIONALITY
// ============================
function initCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return; // Exit if no carousel on page

    function showSlide(index) {
        // Remove active from all
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Add active to current
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Make goToSlide available globally
    window.goToSlide = function(index) {
        showSlide(index);
    };

    // Initialize first slide
    showSlide(0);

    // Auto-advance carousel every 5 seconds
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
// MOBILE MENU TOGGLE
// ============================
window.toggleMenu = function() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
};

// ============================
// PRODUCTS FILTERING
// ============================
function initProductsFilters() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return; // Exit if not on products page

    window.filterByCategory = function(category) {
        currentCategory = category;
        
        // Update active button
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

        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
    };
}

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initNavbar();
    initProductsFilters();
});