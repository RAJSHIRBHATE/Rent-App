// script.js - ready to replace your existing file

// Internal version - bump this number whenever you change product data in the code
const PRODUCTS_VERSION = 2; // <-- bump to 3,4... when you update images/data in code

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    loadPageContent();
});

// Initialize default data in localStorage (version-aware)
function initializeData() {
    // code-level product list (the authoritative source when version bumps)
    const products = [
        {
            id: 1,
            name: 'Refrigerator',
            image: 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/jioretailer/products/pictures/item/free/original/nXN30Oqz1l-kelvinator-krf-g280rbvmmz-refrigerators-492911301-i-1-1200wx1200h.jpeg',
            price: 1500,
            deposit: 5000,
            description: 'Energy-efficient double door refrigerator with advanced cooling technology. Perfect for families.',
            offer: 'Get 10% off on 6+ months rental',
            offerType: 'discount_10_6months',
            features: ['Double Door', 'Frost Free', 'Energy Star Rated', 'LED Display']
        },
        {
            id: 2,
            name: 'Washing Machine',
            image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FzaGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D',
            price: 1200,
            deposit: 4000,
            description: 'Fully automatic front-loading washing machine with multiple wash programs.',
            offer: 'Free delivery and installation',
            offerType: 'free_delivery',
            features: ['Front Load', '8kg Capacity', 'Multiple Programs', 'Energy Efficient']
        },
        {
            id: 3,
            name: 'Television',
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
            price: 2000,
            deposit: 8000,
            description: '55-inch 4K Ultra HD Smart TV with HDR support and built-in streaming apps.',
            offer: 'No deposit on 12+ months',
            offerType: 'no_deposit_12months',
            features: ['55 inch', '4K UHD', 'Smart TV', 'HDR Support']
        },
        {
            id: 4,
            name: 'Microwave Oven',
            image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop',
            price: 800,
            deposit: 2000,
            description: 'Convection microwave oven with grill function and multiple cooking modes.',
            offer: '20% off on first month',
            offerType: 'discount_20_firstmonth',
            features: ['Convection', 'Grill Function', 'Auto Cook', 'Child Lock']
        },
        {
            id: 5,
            name: 'Iron',
            image: 'https://images.unsplash.com/photo-1540544093-b0880061e1a5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXJvbnxlbnwwfHwwfHx8MA%3D%3D',
            price: 300,
            deposit: 500,
            description: 'Steam iron with non-stick soleplate and auto shut-off feature for safety.',
            offer: 'No deposit required',
            offerType: 'no_deposit',
            features: ['Steam Function', 'Non-Stick', 'Auto Shut-off', 'Lightweight']
        },
        {
            id: 6,
            name: 'Air Conditioner',
            image: 'https://static.godrejenterprises.com/ac_selector_banner_cat_m_7e74b805de.webp',
            price: 2500,
            deposit: 10000,
            description: '1.5 ton split AC with inverter technology and 5-star energy rating.',
            offer: 'Free installation and service',
            offerType: 'free_installation',
            features: ['1.5 Ton', 'Inverter', '5 Star Rated', 'WiFi Enabled']
        },
        {
            id: 7,
            name: 'Water Purifier',
            image: 'https://www.pureitwater.com/media/catalog/product/1/_/1_7_3.jpg?optimize=medium&fit=bounds&height=295&width=315&auto=webp&format=png',
            price: 600,
            deposit: 3000,
            description: 'RO + UV water purifier with 7-stage purification and mineral retention.',
            offer: 'Free maintenance for 3 months',
            offerType: 'free_maintenance',
            features: ['RO + UV', '7 Stage', 'Mineral Retention', 'Low Maintenance']
        }
    ];

    // Check stored version
    const storedVersion = parseInt(localStorage.getItem('productsVersion') || '0', 10);

    // If no stored products OR version mismatch, write/merge from source
    if (!localStorage.getItem('products') || storedVersion < PRODUCTS_VERSION) {
        // If there is existing stored products, we merge intelligently:
        const stored = JSON.parse(localStorage.getItem('products') || '[]');

        if (stored.length === 0 || storedVersion === 0) {
            // First time install: just save code products
            localStorage.setItem('products', JSON.stringify(products));
        } else {
            // Merge: keep user-edited fields where appropriate, but overwrite
            // the fields we consider authoritative from code (image, price, deposit, description, offer, offerType)
            const merged = stored.map(sItem => {
                const codeItem = products.find(p => p.id === sItem.id);
                if (codeItem) {
                    return {
                        ...sItem,
                        image: codeItem.image || sItem.image,
                        price: codeItem.price != null ? codeItem.price : sItem.price,
                        deposit: codeItem.deposit != null ? codeItem.deposit : sItem.deposit,
                        description: codeItem.description || sItem.description,
                        offer: codeItem.offer || sItem.offer,
                        offerType: codeItem.offerType || sItem.offerType
                    };
                }
                // keep stored items that do not exist in the code list
                return sItem;
            });

            // add any new products from code that are not in stored
            products.forEach(p => {
                if (!merged.find(m => m.id === p.id)) merged.push(p);
            });

            localStorage.setItem('products', JSON.stringify(merged));
        }

        localStorage.setItem('productsVersion', String(PRODUCTS_VERSION));
        console.log('Products initialized/updated from code (version)', PRODUCTS_VERSION);
    }

    // Initialize owner account if not exists
    if (!localStorage.getItem('owner')) {
        const owner = {
            email: 'owner@rentelectronics.com',
            password: 'owner123'
        };
        localStorage.setItem('owner', JSON.stringify(owner));
    }

    // Initialize orders if not exists
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname || window.location.href;
    const fileName = path.split('/').pop() || path.split('\\').pop() || 'index.html';
    return fileName.includes('.html') ? fileName : 'index.html';
}

// Setup event listeners based on current page
function setupEventListeners() {
    const currentPage = getCurrentPage();

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleCustomerLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Owner login form
    const ownerLoginForm = document.getElementById('ownerLoginForm');
    if (ownerLoginForm) {
        ownerLoginForm.addEventListener('submit', handleOwnerLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Checkout button from cart
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
}

// Load page-specific content
function loadPageContent() {
    const currentPage = getCurrentPage();

    // Check authentication
    if (currentPage !== 'index.html' && currentPage !== 'register.html' && currentPage !== 'owner-login.html') {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const owner = localStorage.getItem('currentOwner');
        
        if (!user && !owner) {
            window.location.href = 'index.html';
            return;
        }
    }

    switch(currentPage) {
        case 'customer-dashboard.html':
            loadProducts();
            updateCartCount();
            displayUserName();
            updateNotificationBadge();
            break;
        case 'product-detail.html':
            loadProductDetail();
            updateCartCount();
            updateNotificationBadge();
            break;
        case 'cart.html':
            loadCart();
            updateCartCount();
            updateNotificationBadge();
            break;
        case 'checkout.html':
            loadCheckout();
            updateCartCount();
            updateNotificationBadge();
            break;
        case 'owner-dashboard.html':
            loadOwnerDashboard();
            updateOwnerNotificationBadge();
            break;
        case 'owner-products.html':
            loadOwnerProducts();
            updateOwnerNotificationBadge();
            break;
        case 'owner-products.html':
            loadOwnerProducts();
            break;
        case 'order-history.html':
            loadOrderHistory();
            updateCartCount();
            updateNotificationBadge();
            break;
    }
    
    // Update notification badge for customers
    if (currentPage.includes('customer') || currentPage === 'cart.html' || currentPage === 'checkout.html' || currentPage === 'product-detail.html') {
        updateNotificationBadge();
    }
}

// ---------------------- Auth (robust) ----------------------

// Customer Registration
function handleRegister(e) {
    e.preventDefault();
    const name = (document.getElementById('regName').value || '').trim();
    const emailRaw = (document.getElementById('regEmail').value || '');
    const email = emailRaw.trim().toLowerCase();
    const phone = (document.getElementById('regPhone').value || '').trim();
    const passwordRaw = (document.getElementById('regPassword').value || '');
    const password = passwordRaw.trim();
    const confirmPassword = (document.getElementById('regConfirmPassword').value || '').trim();

    const errorMsg = document.getElementById('errorMessage');

    if (!name || !email || !password) {
        if (errorMsg) {
            errorMsg.textContent = 'Please fill all required fields.';
            errorMsg.classList.add('show');
        }
        return;
    }

    if (password !== confirmPassword) {
        if (errorMsg) {
            errorMsg.textContent = 'Passwords do not match!';
            errorMsg.classList.add('show');
        }
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists (case-insensitive)
    if (users.find(u => (u.email || '').toLowerCase() === email)) {
        if (errorMsg) {
            errorMsg.textContent = 'Email already registered!';
            errorMsg.classList.add('show');
        }
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');
    }
    
    // Auto-login after register
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Registration successful! You are now logged in.');
    window.location.href = 'customer-dashboard.html';
}

// Customer Login
function handleCustomerLogin(e) {
    e.preventDefault();
    const emailRaw = (document.getElementById('email').value || '');
    const email = emailRaw.trim().toLowerCase();
    const password = (document.getElementById('password').value || '').trim();

    const errorMsg = document.getElementById('errorMessage');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Debug log
    console.log('Attempt login for:', email);

    const user = users.find(u => (u.email || '').toLowerCase() === email && (u.password || '') === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login success:', user);
        window.location.href = 'customer-dashboard.html';
    } else {
        console.warn('Login failed. Users present:', users.map(u => u.email));
        if (errorMsg) {
            errorMsg.textContent = 'Invalid email or password!';
            errorMsg.classList.add('show');
        }
    }
}

// Owner Login
function handleOwnerLogin(e) {
    e.preventDefault();
    const email = (document.getElementById('ownerEmail').value || '').trim();
    const password = (document.getElementById('ownerPassword').value || '').trim();

    const errorMsg = document.getElementById('errorMessage');
    const owner = JSON.parse(localStorage.getItem('owner') || '{}');

    if (owner && owner.email === email && owner.password === password) {
        localStorage.setItem('currentOwner', 'true');
        window.location.href = 'owner-dashboard.html';
    } else {
        if (errorMsg) {
            errorMsg.textContent = 'Invalid credentials!';
            errorMsg.classList.add('show');
        }
    }
}

// Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentOwner');
    window.location.href = 'index.html';
}

// ---------------------- Products / Cart ----------------------

// Load Products (safe image handling)
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => {
        const placeholder = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(product.name);
        const imgSrc = product.image && product.image.trim() ? product.image : placeholder;

        return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${imgSrc}" alt="${product.name}"
                     onerror="this.onerror=null;this.src='${placeholder}'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 80)}...</p>
                <div class="price">₹${product.price}/month</div>
                <button class="btn-view" onclick="event.stopPropagation(); viewProduct(${product.id})">View Details</button>
            </div>
        </div>
        `;
    }).join('');
}

// View Product Detail
function viewProduct(productId) {
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html';
}

// Load Product Detail (safe image handling)
function loadProductDetail() {
    const productId = parseInt(localStorage.getItem('selectedProductId'));
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'customer-dashboard.html';
        return;
    }

    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;

    const placeholder = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(product.name);
    const imgSrc = product.image && product.image.trim() ? product.image : placeholder;

    productDetail.innerHTML = `
        <div class="product-detail-header">
            <div class="product-detail-image"><img src="${imgSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholder}'"></div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="price">₹${product.price}/month</div>
                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                <div class="detail-section">
                    <h3>Features</h3>
                    <ul style="color: #666; line-height: 1.8;">
                        ${product.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                ${product.offer ? `<div class="offer-badge">${product.offer}</div>` : ''}
            </div>
        </div>
        <div class="detail-section">
            <h3>Rental Information</h3>
            <p><strong>Monthly Charges:</strong> ₹${product.price}/month</p>
            <p><strong>Security Deposit:</strong> ₹${product.deposit}</p>
            <p><strong>Minimum Rental Period:</strong> 1 month</p>
        </div>
        <div class="rental-options">
            <label for="rentalMonths">Select Rental Period (months):</label>
            <select id="rentalMonths" onchange="updatePricePreview(${product.id})">
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
            </select>
            <div id="pricePreview" style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p><strong>Total Rental:</strong> ₹${product.price}</p>
                <p><strong>Deposit:</strong> ₹${product.deposit}</p>
                <p><strong>Total:</strong> ₹${product.price + product.deposit}</p>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    updatePricePreview(product.id);
}

// Calculate offer discount
function calculateOffer(product, months) {
    let discount = 0;
    let deposit = product.deposit;
    let appliedOffer = null;

    switch(product.offerType) {
        case 'discount_10_6months':
            if (months >= 6) {
                discount = (product.price * months) * 0.10;
                appliedOffer = '10% discount applied';
            }
            break;
        case 'no_deposit_12months':
            if (months >= 12) {
                deposit = 0;
                appliedOffer = 'No deposit (12+ months)';
            }
            break;
        case 'no_deposit':
            deposit = 0;
            appliedOffer = 'No deposit required';
            break;
        case 'discount_20_firstmonth':
            discount = product.price * 0.20;
            appliedOffer = '20% off first month';
            break;
    }

    return { discount, deposit, appliedOffer };
}

// Add to Cart
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    const rentalMonths = parseInt(document.getElementById('rentalMonths').value || '1', 10);

    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const offerCalc = calculateOffer(product, rentalMonths);
    const basePrice = product.price * rentalMonths;
    const finalPrice = basePrice - offerCalc.discount;
    
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        deposit: offerCalc.deposit,
        originalDeposit: product.deposit,
        months: rentalMonths,
        totalPrice: finalPrice,
        discount: offerCalc.discount,
        appliedOffer: offerCalc.appliedOffer
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Item added to cart!');
    updateCartCount();
}

// Load Cart (safe image handling)
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementById('cartItems');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>Add some items to get started!</p></div>';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const placeholder = 'https://via.placeholder.com/100?text=' + encodeURIComponent(item.name);
        const imgSrc = item.image && item.image.trim() ? item.image : placeholder;

        return `
        <div class="cart-item">
            <div class="cart-item-image"><img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null;this.src='${placeholder}'"></div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Rental Period: ${item.months} month(s)</p>
                <p>Monthly: ₹${item.price} | Deposit: ₹${item.deposit}${item.originalDeposit > item.deposit ? ` <span style="color: #28a745; font-weight: 600;">(Offer Applied!)</span>` : ''}</p>
                ${item.appliedOffer ? `<p style="color: #28a745; font-weight: 600;">✓ ${item.appliedOffer}</p>` : ''}
                ${item.discount > 0 ? `<p style="color: #ff6b6b;">Discount: -₹${item.discount}</p>` : ''}
            </div>
            <div class="cart-item-price">
                <div class="price">₹${item.totalPrice}</div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `;
    }).join('');

    updateCartSummary();
}

// Remove from Cart
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Update Cart Summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Calculate original subtotal (before discount)
    const originalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.months), 0);
    const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0); // After discount
    const totalDeposit = cart.reduce((sum, item) => sum + item.deposit, 0);
    const total = subtotal + totalDeposit;

    const subtotalEl = document.getElementById('subtotal');
    const depositEl = document.getElementById('totalDeposit');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (depositEl) depositEl.textContent = `₹${totalDeposit}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    
    // Add discount display if exists
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard) {
        // Remove existing discount row if any
        const existingDiscountRow = summaryCard.querySelector('.discount-row');
        if (existingDiscountRow) {
            existingDiscountRow.remove();
        }
        
        if (totalDiscount > 0) {
            const discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount-row';
            discountRow.style.color = '#28a745';
            discountRow.innerHTML = `<span>Total Discount:</span><span>-₹${totalDiscount}</span>`;
            
            const subtotalRow = summaryCard.querySelector('.summary-row:not(.total)');
            if (subtotalRow) {
                subtotalRow.parentNode.insertBefore(discountRow, subtotalRow.nextSibling);
            }
        }
    }
}

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = cart.length;
    });
}

// Load Checkout
function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'cart.html';
        return;
    }

    // Pre-fill user info
    if (user) {
        const fn = document.getElementById('fullName');
        const ph = document.getElementById('phone');
        if (fn) fn.value = user.name || '';
        if (ph) ph.value = user.phone || '';
    }

    // Load order items
    const orderItems = document.getElementById('orderItems');
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <span>${item.name} (${item.months} month(s))${item.appliedOffer ? ` <small style="color: #28a745;">[${item.appliedOffer}]</small>` : ''}</span>
                <span>₹${item.totalPrice}${item.discount > 0 ? ` <small style="color: #28a745;">(-₹${item.discount})</small>` : ''}</span>
            </div>
        `).join('');
    }

    updateCheckoutSummary();
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Calculate original subtotal (before discount)
    const originalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.months), 0);
    const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0); // After discount
    const totalDeposit = cart.reduce((sum, item) => sum + item.deposit, 0);
    const total = subtotal + totalDeposit;

    const subtotalEl = document.getElementById('subtotal');
    const depositEl = document.getElementById('totalDeposit');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (depositEl) depositEl.textContent = `₹${totalDeposit}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    
    // Add discount display if exists
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard) {
        // Remove existing discount row if any
        const existingDiscountRow = summaryCard.querySelector('.discount-row');
        if (existingDiscountRow) {
            existingDiscountRow.remove();
        }
        
        if (totalDiscount > 0) {
            const discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount-row';
            discountRow.style.color = '#28a745';
            discountRow.innerHTML = `<span>Total Discount:</span><span>-₹${totalDiscount}</span>`;
            
            const subtotalRow = summaryCard.querySelector('.summary-row:not(.total)');
            if (subtotalRow) {
                subtotalRow.parentNode.insertBefore(discountRow, subtotalRow.nextSibling);
            }
        }
    }
}

// Update Price Preview
function updatePricePreview(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    const monthsEl = document.getElementById('rentalMonths');
    const months = monthsEl ? parseInt(monthsEl.value || '1', 10) : 1;
    
    if (!product) return;
    
    const offerCalc = calculateOffer(product, months);
    const basePrice = product.price * months;
    const finalPrice = basePrice - offerCalc.discount;
    const total = finalPrice + offerCalc.deposit;
    
    const preview = document.getElementById('pricePreview');
    if (preview) {
        preview.innerHTML = `
            <p><strong>Total Rental (${months} month${months > 1 ? 's' : ''}):</strong> ₹${basePrice}</p>
            ${offerCalc.discount > 0 ? `<p style="color: #28a745;"><strong>Discount:</strong> -₹${offerCalc.discount} <small>(${offerCalc.appliedOffer})</small></p>` : ''}
            <p><strong>Final Rental:</strong> ₹${finalPrice}</p>
            <p><strong>Deposit:</strong> ₹${offerCalc.deposit}${offerCalc.deposit < product.deposit ? ` <span style="color: #28a745;">(Offer Applied!)</span>` : ''}</p>
            <p style="font-size: 18px; font-weight: bold; color: #667eea;"><strong>Total Amount:</strong> ₹${total}</p>
        `;
    }
}

// Handle Checkout
function handleCheckout(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const order = {
        id: Date.now(),
        customerId: user ? user.id : null,
        customerName: document.getElementById('fullName') ? document.getElementById('fullName').value : '',
        customerEmail: user ? user.email : '',
        customerPhone: document.getElementById('phone') ? document.getElementById('phone').value : '',
        address: {
            street: document.getElementById('address') ? document.getElementById('address').value : '',
            city: document.getElementById('city') ? document.getElementById('city').value : '',
            state: document.getElementById('state') ? document.getElementById('state').value : '',
            pincode: document.getElementById('pincode') ? document.getElementById('pincode').value : ''
        },
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + item.totalPrice, 0),
        deposit: cart.reduce((sum, item) => sum + item.deposit, 0),
        discount: cart.reduce((sum, item) => sum + (item.discount || 0), 0),
        total: cart.reduce((sum, item) => sum + item.totalPrice + item.deposit, 0),
        status: 'pending',
        date: new Date().toISOString(),
        notifications: [],
        ownerNotificationRead: false // Track if owner has seen this order
    };

    // Save order
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Create owner notification
    createOwnerNotification(order.id, order.customerName, order.total);

    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));

    alert('Order placed successfully! The shop owner will be notified.');
    window.location.href = 'customer-dashboard.html';
}

// ---------------------- Owner / Orders ----------------------

// Create Owner Notification
function createOwnerNotification(orderId, customerName, total) {
    let ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
    
    ownerNotifications.push({
        id: Date.now(),
        orderId: orderId,
        message: `New order from ${customerName} - Total: ₹${total}`,
        type: 'new_order',
        date: new Date().toISOString(),
        read: false
    });
    
    localStorage.setItem('ownerNotifications', JSON.stringify(ownerNotifications));
}

// Load Owner Dashboard
function loadOwnerDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    // Count unread notifications
    const ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
    const unreadNotifications = ownerNotifications.filter(n => !n.read);
    const newOrdersCount = orders.filter(o => o.status === 'pending' && !o.ownerNotificationRead).length;

    const newOrdersCountEl = document.getElementById('newOrdersCount');
    if (newOrdersCountEl) newOrdersCountEl.textContent = newOrdersCount;
    
    // Update notification icon
    updateOwnerNotificationBadge();
    
    // Show notification popup if there are unread notifications
    if (unreadNotifications.length > 0) {
        showOwnerNotificationPopup(unreadNotifications);
    }

    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders"><h2>No orders yet</h2><p>Orders will appear here when customers place them.</p></div>';
        return;
    }

    // Sort orders: pending first, then by date
    orders.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.date) - new Date(a.date);
    });

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card ${order.status === 'pending' ? 'new' : ''}">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status ${order.status === 'processed' ? 'processed' : ''}">
                    ${order.deliveryStatus === 'out_for_delivery' ? 'OUT FOR DELIVERY' : order.status === 'pending' ? 'NEW' : 'PROCESSED'}
                </span>
            </div>
            <div class="order-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Phone:</strong> ${order.customerPhone}</p>
                <h4 style="margin-top: 15px;">Delivery Address</h4>
                <p>${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
                <div class="order-items-list">
                    <h4 style="margin-top: 15px;">Items</h4>
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span>${item.name} (${item.months} month(s))${item.appliedOffer ? ` <small style="color: #28a745;">[${item.appliedOffer}]</small>` : ''}</span>
                            <span>₹${item.totalPrice}${item.discount > 0 ? ` <small style="color: #28a745;">(-₹${item.discount})</small>` : ''}</span>
                        </div>
                    `).join('')}
                </div>
                ${order.discount > 0 ? `
                    <div class="summary-row" style="margin-top: 10px;">
                        <span>Total Discount:</span>
                        <span style="color: #28a745;">-₹${order.discount}</span>
                    </div>
                ` : ''}
                <div class="summary-row total" style="margin-top: 15px;">
                    <span>Total Amount:</span>
                    <span>₹${order.total}</span>
                </div>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                    <strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}
                </p>
                ${order.status === 'pending' ? `
                    <button class="btn-process" onclick="processOrder(${order.id})" style="margin-top: 15px;">
                        Mark as Processed
                    </button>
                ` : ''}
                ${order.status === 'pending' && !order.ownerNotificationRead ? `
                    <button class="btn-mark-read" onclick="markOrderAsRead(${order.id})" style="margin-top: 10px; margin-left: 10px;">
                        Mark as Read
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update Owner Notification Badge
function updateOwnerNotificationBadge() {
    const ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
    const unreadCount = ownerNotifications.filter(n => !n.read).length;
    
    const notificationIcon = document.getElementById('ownerNotificationIcon');
    if (notificationIcon) {
        if (unreadCount > 0) {
            notificationIcon.style.display = 'inline-block';
            notificationIcon.textContent = unreadCount;
        } else {
            notificationIcon.style.display = 'none';
        }
    }
}

// Show Owner Notification Popup
function showOwnerNotificationPopup(notifications) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('ownerNotificationPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.id = 'ownerNotificationPopup';
    popup.className = 'owner-notification-popup';
    popup.innerHTML = `
        <div class="notification-popup-header">
            <h3>🔔 New Notifications (${notifications.length})</h3>
            <button onclick="closeOwnerNotificationPopup()" class="btn-close-popup">×</button>
        </div>
        <div class="notification-popup-content">
            ${notifications.map(notif => `
                <div class="notification-popup-item">
                    <p><strong>${notif.message}</strong></p>
                    <small>${new Date(notif.date).toLocaleString()}</small>
                    <button onclick="markOwnerNotificationRead(${notif.id})" class="btn-mark-read-small">Mark as Read</button>
                </div>
            `).join('')}
        </div>
        <div class="notification-popup-footer">
            <button onclick="markAllOwnerNotificationsRead()" class="btn-mark-all-read">Mark All as Read</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 10000);
}

// Close Owner Notification Popup
function closeOwnerNotificationPopup() {
    const popup = document.getElementById('ownerNotificationPopup');
    if (popup) {
        popup.remove();
    }
}

// Mark Owner Notification as Read
function markOwnerNotificationRead(notificationId) {
    let ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
    const notification = ownerNotifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        localStorage.setItem('ownerNotifications', JSON.stringify(ownerNotifications));
        updateOwnerNotificationBadge();
        
        // Remove from popup if still visible
        const popup = document.getElementById('ownerNotificationPopup');
        if (popup) {
            const unreadNotifications = ownerNotifications.filter(n => !n.read);
            if (unreadNotifications.length === 0) {
                popup.remove();
            } else {
                loadOwnerDashboard(); // Refresh popup
            }
        }
    }
}

// Mark All Owner Notifications as Read
function markAllOwnerNotificationsRead() {
    let ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
    ownerNotifications.forEach(n => n.read = true);
    localStorage.setItem('ownerNotifications', JSON.stringify(ownerNotifications));
    
    // Also mark all pending orders as read
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.forEach(order => {
        if (order.status === 'pending') {
            order.ownerNotificationRead = true;
        }
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    updateOwnerNotificationBadge();
    closeOwnerNotificationPopup();
    loadOwnerDashboard();
}

// Mark Order as Read (from order card)
function markOrderAsRead(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.ownerNotificationRead = true;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Mark related notification as read
        let ownerNotifications = JSON.parse(localStorage.getItem('ownerNotifications') || '[]');
        const relatedNotification = ownerNotifications.find(n => n.orderId === orderId);
        if (relatedNotification) {
            relatedNotification.read = true;
            localStorage.setItem('ownerNotifications', JSON.stringify(ownerNotifications));
        }
        
        updateOwnerNotificationBadge();
        loadOwnerDashboard();
    }
}

// Process Order
function processOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = 'processed';
        order.deliveryStatus = 'out_for_delivery';
        
        // Add notification for customer
        if (!order.notifications) {
            order.notifications = [];
        }
        order.notifications.push({
            id: Date.now(),
            message: 'Your order is out for delivery! We will deliver your items soon.',
            type: 'delivery',
            date: new Date().toISOString(),
            read: false
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOwnerDashboard();
        alert('Order marked as processed! Customer will be notified.');
        
        // Note: Customer notification badge will update when they refresh/navigate pages
    }
}

// Display User Name
function displayUserName() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const userNameEl = document.getElementById('userName');
    if (userNameEl && user) {
        userNameEl.textContent = `Hello, ${user.name}`;
    }
}

// Load Order History
function loadOrderHistory() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.customerId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const ordersList = document.getElementById('ordersList');
    const notificationsBadge = document.getElementById('notificationsBadge');
    if (!ordersList) return;
    
    // Count unread notifications
    let unreadCount = 0;
    userOrders.forEach(order => {
        if (order.notifications) {
            unreadCount += order.notifications.filter(n => !n.read).length;
        }
    });
    
    if (notificationsBadge) {
        if (unreadCount > 0) {
            notificationsBadge.innerHTML = `<span>You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}!</span>`;
            notificationsBadge.style.display = 'block';
        } else {
            notificationsBadge.style.display = 'none';
        }
    }

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders"><h2>No orders yet</h2><p>Your order history will appear here.</p></div>';
        return;
    }

    ordersList.innerHTML = userOrders.map(order => {
        const hasUnreadNotifications = order.notifications && order.notifications.some(n => !n.read);
        const latestNotification = order.notifications && order.notifications.length > 0 
            ? order.notifications[order.notifications.length - 1] 
            : null;
        
        return `
        <div class="order-card ${hasUnreadNotifications ? 'new' : ''}">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status ${order.status === 'processed' ? 'processed' : 'pending'}">
                    ${order.deliveryStatus === 'out_for_delivery' ? 'OUT FOR DELIVERY' : order.status === 'processed' ? 'PROCESSED' : 'PENDING'}
                </span>
            </div>
            ${latestNotification && !latestNotification.read ? `
                <div class="notification-alert">
                    <strong>📦 ${latestNotification.message}</strong>
                    <button onclick="markNotificationRead(${order.id}, ${latestNotification.id})" class="btn-mark-read">Mark as Read</button>
                </div>
            ` : ''}
            <div class="order-details">
                <h4>Delivery Address</h4>
                <p>${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
                <div class="order-items-list">
                    <h4 style="margin-top: 15px;">Items</h4>
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span>${item.name} (${item.months} month(s))</span>
                            <span>₹${item.totalPrice}</span>
                        </div>
                    `).join('')}
                </div>
                ${order.discount > 0 ? `
                    <div class="summary-row" style="margin-top: 10px;">
                        <span>Discount:</span>
                        <span style="color: #28a745;">-₹${order.discount}</span>
                    </div>
                ` : ''}
                <div class="summary-row total" style="margin-top: 15px;">
                    <span>Total Amount:</span>
                    <span>₹${order.total}</span>
                </div>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                    <strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}
                </p>
            </div>
        </div>
    `;
    }).join('');
}

// Mark Notification as Read
function markNotificationRead(orderId, notificationId) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (order && order.notifications) {
        const notification = order.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrderHistory();
            updateNotificationBadge();
        }
    }
}

// Update Notification Badge
function updateNotificationBadge() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.customerId === user.id);
    
    let unreadCount = 0;
    userOrders.forEach(order => {
        if (order.notifications) {
            unreadCount += order.notifications.filter(n => !n.read).length;
        }
    });
    
    // Update notification icon in navigation
    const notificationIcons = document.querySelectorAll('#navNotificationIcon');
    notificationIcons.forEach(icon => {
        if (unreadCount > 0) {
            icon.style.display = 'inline-block';
            icon.textContent = unreadCount;
        } else {
            icon.style.display = 'none';
        }
    });
}

// Load Owner Products (safe image handling)
function loadOwnerProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsList = document.getElementById('productsList');
    
    if (!productsList) return;
    if (!products || products.length === 0) {
        productsList.innerHTML = '<div class="no-orders"><h2>No products found</h2></div>';
        return;
    }
    
    productsList.innerHTML = products.map(product => {
        const placeholder = 'https://via.placeholder.com/200?text=' + encodeURIComponent(product.name);
        const imgSrc = product.image && product.image.trim() ? product.image : placeholder;

        return `
        <div class="product-edit-card">
            <div class="product-edit-header">
                <div class="product-edit-image">
                    <img src="${imgSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholder}'">
                </div>
                <div class="product-edit-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
            </div>
            <form class="product-edit-form" onsubmit="saveProduct(${product.id}, event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Monthly Price (₹)</label>
                        <input type="number" id="price_${product.id}" value="${product.price}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Deposit (₹)</label>
                        <input type="number" id="deposit_${product.id}" value="${product.deposit}" min="0" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Offer Type</label>
                    <select id="offerType_${product.id}" onchange="updateOfferText(${product.id})">
                        <option value="none" ${!product.offerType || product.offerType === 'none' ? 'selected' : ''}>No Offer</option>
                        <option value="discount_10_6months" ${product.offerType === 'discount_10_6months' ? 'selected' : ''}>10% off on 6+ months</option>
                        <option value="no_deposit_12months" ${product.offerType === 'no_deposit_12months' ? 'selected' : ''}>No deposit on 12+ months</option>
                        <option value="no_deposit" ${product.offerType === 'no_deposit' ? 'selected' : ''}>No deposit required</option>
                        <option value="discount_20_firstmonth" ${product.offerType === 'discount_20_firstmonth' ? 'selected' : ''}>20% off first month</option>
                        <option value="free_delivery" ${product.offerType === 'free_delivery' ? 'selected' : ''}>Free delivery</option>
                        <option value="free_installation" ${product.offerType === 'free_installation' ? 'selected' : ''}>Free installation</option>
                        <option value="free_maintenance" ${product.offerType === 'free_maintenance' ? 'selected' : ''}>Free maintenance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Offer Text (Display)</label>
                    <input type="text" id="offerText_${product.id}" value="${product.offer || ''}" placeholder="e.g., Get 10% off on 6+ months rental">
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" id="image_${product.id}" value="${product.image || ''}" placeholder="https://...">
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
        </div>
    `;
    }).join('');
}

// Update Offer Text based on selection
function updateOfferText(productId) {
    const offerType = document.getElementById(`offerType_${productId}`).value;
    const offerTextInput = document.getElementById(`offerText_${productId}`);
    
    const offerTexts = {
        'none': '',
        'discount_10_6months': 'Get 10% off on 6+ months rental',
        'no_deposit_12months': 'No deposit on 12+ months',
        'no_deposit': 'No deposit required',
        'discount_20_firstmonth': '20% off first month',
        'free_delivery': 'Free delivery and installation',
        'free_installation': 'Free installation and service',
        'free_maintenance': 'Free maintenance for 3 months'
    };
    
    if (offerTextInput) offerTextInput.value = offerTexts[offerType] || '';
}

// Save Product Changes
function saveProduct(productId, e) {
    e.preventDefault();
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const priceEl = document.getElementById(`price_${productId}`);
    const depositEl = document.getElementById(`deposit_${productId}`);
    const offerTypeEl = document.getElementById(`offerType_${productId}`);
    const offerTextEl = document.getElementById(`offerText_${productId}`);
    const imageEl = document.getElementById(`image_${productId}`);

    product.price = priceEl ? parseInt(priceEl.value || product.price, 10) : product.price;
    product.deposit = depositEl ? parseInt(depositEl.value || product.deposit, 10) : product.deposit;
    product.offerType = offerTypeEl ? offerTypeEl.value : product.offerType;
    product.offer = offerTextEl ? offerTextEl.value || null : product.offer;
    product.image = imageEl ? imageEl.value || product.image : product.image;
    
    localStorage.setItem('products', JSON.stringify(products));
    
    alert('Product updated successfully!');
    loadOwnerProducts();
}
