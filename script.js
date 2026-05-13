let currentCurrency = localStorage.getItem('escapeo-currency') || 'USD';
const EXCHANGE_RATE = 50.5; // 1 USD = 50.5 EGP

function formatPrice(amount) {
  if (currentCurrency === 'EGP') {
    return 'ج.م ' + Math.round(amount * EXCHANGE_RATE).toLocaleString();
  }
  return '$' + amount.toLocaleString();
}

function formatPriceShort(amount) {
  if (currentCurrency === 'EGP') {
    return 'ج.م ' + Math.round(amount * EXCHANGE_RATE);
  }
  return '$' + amount;
}

function changeCurrency(currency) {
  currentCurrency = currency;
  localStorage.setItem('escapeo-currency', currency);
  document.getElementById('currencyBtn').textContent = (currency === 'EGP' ? 'ج.م' : '$') + ' ▼';
  showToast('Currency set to ' + (currency === 'EGP' ? 'Egyptian Pound (EGP)' : 'US Dollar (USD)'));
  renderDestinations();
  renderPackages();
  if (!document.getElementById('page-wishlist').classList.contains('hidden')) {
    loadWishlist();
  }
  if (!document.getElementById('page-bookings').classList.contains('hidden')) {
    loadBookings();
  }
  if (!document.getElementById('page-admin').classList.contains('hidden')) {
    loadAdminOverview();
  }
}

function initCurrencySwitcher() {
  var currencyBtn = document.getElementById('currencyBtn');
  var currencyDropdown = document.getElementById('currencyDropdown');
  if (currencyBtn && currencyDropdown) {
    currencyBtn.textContent = (currentCurrency === 'EGP' ? 'ج.م' : '$') + ' ▼';
    currencyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currencyDropdown.classList.toggle('active');
    });
    document.addEventListener('click', function() { currencyDropdown.classList.remove('active'); });
    currencyDropdown.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        changeCurrency(a.dataset.currency);
      });
    });
  }
}

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good morning, traveler!";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon, traveler!";
  } else if (hour >= 17) {
    greeting = "Good evening, traveler!";
  }
  const el = document.getElementById('heroGreeting');
  if (el) el.textContent = greeting;
}

// ============================================
// MOCK DATA
// ============================================
const destinations = [
  { id: 1, name: "Tokyo", location: "Japan", country: "Japan", category: "city", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", price: 145, rating: 4.8, reviews: 312 },
  { id: 2, name: "Istanbul", location: "Turkey", country: "Turkey", category: "cultural", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", price: 95, rating: 4.7, reviews: 198 },
  { id: 3, name: "New York", location: "USA", country: "USA", category: "city", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", price: 220, rating: 4.6, reviews: 523 },
  { id: 4, name: "Paris", location: "France", country: "France", category: "cultural", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", price: 180, rating: 4.9, reviews: 445 },
  { id: 5, name: "Maldives", location: "Maldives", country: "Maldives", category: "beach", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", price: 350, rating: 4.9, reviews: 267 },
  { id: 6, name: "Santorini", location: "Greece", country: "Greece", category: "beach", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", price: 195, rating: 4.8, reviews: 389 },
  { id: 7, name: "London", location: "England", country: "UK", category: "city", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", price: 165, rating: 4.7, reviews: 378 },
  { id: 8, name: "Swiss Alps", location: "Switzerland", country: "Switzerland", category: "mountain", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", price: 210, rating: 4.9, reviews: 156 },
  { id: 9, name: "Dubai", location: "UAE", country: "UAE", category: "city", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", price: 185, rating: 4.6, reviews: 298 },
  { id: 10, name: "Bali", location: "Indonesia", country: "Indonesia", category: "beach", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", price: 89, rating: 4.8, reviews: 234 },
  { id: 11, name: "Kyoto", location: "Japan", country: "Japan", category: "cultural", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", price: 120, rating: 4.7, reviews: 312 },
  { id: 12, name: "Marrakech", location: "Morocco", country: "Morocco", category: "cultural", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80", price: 75, rating: 4.6, reviews: 198 }
];

const packages = [
  { id: 1, title: "Tokyo Discovery", destination: "Tokyo, Japan", duration: "5 Days", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", price: 1899, highlights: ["Bullet Train", "Sushi Masterclass", "Temple Visit", "Shopping Tour"] },
  { id: 2, title: "Istanbul Heritage", destination: "Istanbul, Turkey", duration: "6 Days", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", price: 1299, highlights: ["Hagia Sophia Tour", "Bosphorus Cruise", "Grand Bazaar", "Turkish Bath"] },
  { id: 3, title: "Paris Romance", destination: "Paris, France", duration: "5 Days", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", price: 2199, highlights: ["Eiffel Tower Dinner", "Louvre Museum", "Seine River Cruise", "Montmartre Walk"] },
  { id: 4, title: "Maldives Paradise", destination: "Maldives", duration: "7 Days", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", price: 3499, highlights: ["Overwater Villa", "Snorkeling Safari", "Sunset Cruise", "Spa Treatment"] },
  { id: 5, title: "Santorini Dreams", destination: "Santorini, Greece", duration: "6 Days", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", price: 1899, highlights: ["Caldera Sunset", "Wine Tasting", "Volcanic Beach", "Oia Village"] },
  { id: 6, title: "London Explorer", destination: "London, England", duration: "5 Days", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", price: 1699, highlights: ["Tower of London", "Westminster Abbey", "Thames Cruise", "West End Show"] }
];

const testimonials = [
  { id: 1, name: "Sarah", location: "Cairo, Egypt", avatar: "https://ui-avatars.com/api/?name=Sarah&background=e91e63&color=fff", rating: 5, text: "Our trip to Paris was absolutely magical! Escapeo arranged everything perfectly from the Eiffel Tower dinner to the Seine cruise." },
  { id: 2, name: "Muhammad", location: "Dubai, UAE", avatar: "https://ui-avatars.com/api/?name=Muhammad&background=2196f3&color=fff", rating: 5, text: "The Maldives package was a dream come true. The overwater villa and snorkeling safari exceeded all expectations!" },
  { id: 3, name: "Ali", location: "Riyadh, Saudi Arabia", avatar: "https://ui-avatars.com/api/?name=Ali&background=4caf50&color=fff", rating: 5, text: "Istanbul was incredible! From the Hagia Sophia to the Grand Bazaar, every moment was perfectly organized by Escapeo." },
  { id: 4, name: "Nour", location: "Amman, Jordan", avatar: "https://ui-avatars.com/api/?name=Nour&background=9c27b0&color=fff", rating: 5, text: "Our London family trip was perfect! The kids loved the Tower of London and we enjoyed the West End show. Thank you Escapeo!" },
  { id: 5, name: "Nada", location: "Kuwait City, Kuwait", avatar: "https://ui-avatars.com/api/?name=Nada&background=ff9800&color=fff", rating: 5, text: "Santorini was breathtaking! The caldera sunset and wine tasting experience were highlights of our honeymoon." },
  { id: 6, name: "Yousef", location: "Doha, Qatar", avatar: "https://ui-avatars.com/api/?name=Yousef&background=00bcd4&color=fff", rating: 5, text: "Tokyo was amazing! The bullet train, sushi masterclass, and temple visits created memories we'll cherish forever." }
];

// ============================================
// AUTH STATE
// ============================================
let currentUser = JSON.parse(localStorage.getItem('escapeo-user')) || null;
let bookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
let wishlist = JSON.parse(localStorage.getItem('escapeo-wishlist')) || [];

if (!localStorage.getItem('escapeo-destinations')) {
  localStorage.setItem('escapeo-destinations', JSON.stringify(destinations));
}
if (!localStorage.getItem('escapeo-packages')) {
  localStorage.setItem('escapeo-packages', JSON.stringify(packages));
}

// ============================================
// UI HELPERS
// ============================================
function showToast(message, type) {
  type = type || 'success';
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  var icon = type === 'success' ? '✓' : type === 'error' ? '✗' : '⚠';
  toast.innerHTML = '<span>' + icon + '</span> <span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('removing');
    setTimeout(function() { toast.remove(); }, 400);
  }, 3000);
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(function() { openModal(openId); }, 300);
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  var userMenu = document.getElementById('userMenu');
  var userDropdown = document.getElementById('userDropdown');
  if (userMenu) {
    userMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    document.addEventListener('click', function() { userDropdown.classList.remove('active'); });
  }

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  hamburger.addEventListener('click', function() { mobileMenu.classList.add('active'); });
  mobileClose.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
}

function updateAuthUI() {
  var authSection = document.getElementById('authSection');
  var userMenu = document.getElementById('userMenu');
  if (currentUser) {
    authSection.classList.add('hidden');
    userMenu.classList.remove('hidden');
    document.getElementById('userAvatar').src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.firstName + ' ' + currentUser.lastName) + '&background=3B82F6&color=fff';
  } else {
    authSection.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

// ============================================
// AUTH FUNCTIONS
// ============================================
function login(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;

  if (email === 'admin@escapeo.com' && password === 'admin123') {
    currentUser = { id: 'admin', email: 'admin@escapeo.com', firstName: 'Admin', lastName: 'User', role: 'admin' };
    localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
    closeModal('loginModal');
    updateAuthUI();
    showToast('Welcome back, Admin!');
    router('admin');
    return;
  }

  if (email === 'demo@escapeo.com' && password === 'demo123') {
    currentUser = { id: 'demo', email: 'demo@escapeo.com', firstName: 'Demo', lastName: 'User', role: 'customer' };
    localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
    closeModal('loginModal');
    updateAuthUI();
    showToast('Welcome back, Demo User!');
    return;
  }

  showToast('Invalid credentials. Try demo@escapeo.com / demo123', 'error');
}

function register(e) {
  e.preventDefault();
  var firstName = document.getElementById('regFirstName').value;
  var lastName = document.getElementById('regLastName').value;
  var email = document.getElementById('regEmail').value;
  var password = document.getElementById('regPassword').value;
  var confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  currentUser = { id: Date.now().toString(), email: email, firstName: firstName, lastName: lastName, role: 'customer' };
  localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
  closeModal('registerModal');
  updateAuthUI();
  showToast('Account created successfully!');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('escapeo-user');
  updateAuthUI();
  showToast('Logged out successfully');
  router('home');
}

// ============================================
// GOOGLE OAUTH HANDLER
// ============================================
function handleGoogleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      currentUser = user;
      localStorage.setItem('escapeo-user', JSON.stringify(user));
      localStorage.setItem('escapeo-token', token);
      updateAuthUI();
      showToast('Welcome, ' + user.firstName + '!');
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {
      console.error('Error parsing Google user data:', e);
    }
  }
}

// ============================================
// ROUTING
// ============================================
function router(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.add('hidden'); });
  document.getElementById('page-home').classList.add('hidden');

  if (page === 'home') {
    document.getElementById('page-home').classList.remove('hidden');
    document.getElementById('mainFooter').classList.remove('hidden');
    window.scrollTo(0, 0);
  } else if (page === 'profile') {
    if (!currentUser) { openModal('loginModal'); return; }
    document.getElementById('page-profile').classList.remove('hidden');
    loadProfile();
  } else if (page === 'bookings') {
    if (!currentUser) { openModal('loginModal'); return; }
    document.getElementById('page-bookings').classList.remove('hidden');
    loadBookings();
  } else if (page === 'wishlist') {
    if (!currentUser) { openModal('loginModal'); return; }
    document.getElementById('page-wishlist').classList.remove('hidden');
    loadWishlist();
  } else if (page === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access denied', 'error');
      return;
    }
    document.getElementById('page-admin').classList.remove('hidden');
    document.getElementById('mainFooter').classList.add('hidden');
    loadAdminDashboard();
  }

  document.getElementById('mobileMenu').classList.remove('active');
}

// ============================================
// HOME PAGE RENDERERS
// ============================================
function renderDestinations(filter) {
  filter = filter || 'all';
  var grid = document.getElementById('destinationsGrid');
  var filtered = filter === 'all' ? destinations : destinations.filter(function(d) { return d.category === filter; });

  grid.innerHTML = filtered.map(function(dest) {
    var isWishlisted = wishlist.indexOf(dest.id) > -1;
    return '<div class="destination-card" data-category="' + dest.category + '">' +
      '<div class="destination-image">' +
        '<img src="' + dest.image + '" alt="' + dest.name + '" loading="lazy">' +
        '<span class="destination-badge">' + dest.category + '</span>' +
        '<button class="wishlist-btn ' + (isWishlisted ? 'active' : '') + '" onclick="toggleWishlist(' + dest.id + ')">' +
          (isWishlisted ? '❤' : '♡') +
        '</button>' +
      '</div>' +
      '<div class="destination-info">' +
        '<div class="destination-header">' +
          '<h3 class="destination-name">' + dest.name + '</h3>' +
          '<div class="destination-rating"><span>★</span> ' + dest.rating + '</div>' +
        '</div>' +
        '<p class="destination-location">📍 ' + dest.location + ', ' + dest.country + '</p>' +
        '<div class="destination-footer">' +
          '<div class="destination-price">From <strong>' + formatPriceShort(dest.price) + '</strong>/night</div>' +
          '<button class="btn btn-primary btn-sm" onclick="startBooking(' + dest.id + ')">Book Now</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderPackages() {
  var wrapper = document.getElementById('packagesWrapper');
  wrapper.innerHTML = packages.map(function(pkg) {
    return '<div class="swiper-slide">' +
      '<div class="package-card">' +
        '<div class="package-image">' +
          '<img src="' + pkg.image + '" alt="' + pkg.title + '" loading="lazy">' +
        '</div>' +
        '<div class="package-content">' +
          '<h3 class="package-title">' + pkg.title + '</h3>' +
          '<div class="package-meta">' +
            '<span>📍 ' + pkg.destination + '</span>' +
            '<span>⏱ ' + pkg.duration + '</span>' +
          '</div>' +
          '<ul class="package-highlights">' +
            pkg.highlights.map(function(h) { return '<li>' + h + '</li>'; }).join('') +
          '</ul>' +
          '<div class="package-footer">' +
            '<div class="package-price">' + formatPrice(pkg.price) + '</div>' +
            '<button class="btn btn-primary btn-sm" onclick="startBookingPackage(' + pkg.id + ')">Book Now</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderTestimonials() {
  var grid = document.getElementById('testimonialsGrid');
  grid.innerHTML = testimonials.map(function(t) {
    var stars = '';
    for (var i = 0; i < t.rating; i++) {
      stars += '★';
    }
    return '<div class="testimonial-card">' +
      '<div class="testimonial-stars">' + stars + '</div>' +
      '<p class="testimonial-text">"' + t.text + '"</p>' +
      '<div class="testimonial-author">' +
        '<img src="' + t.avatar + '" alt="' + t.name + '">' +
        '<div>' +
          '<h4>' + t.name + '</h4>' +
          '<p>' + t.location + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// WISHLIST
// ============================================
function toggleWishlist(destId) {
  if (!currentUser) { openModal('loginModal'); return; }
  var idx = wishlist.indexOf(destId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(destId);
    showToast('Added to wishlist!');
  }
  localStorage.setItem('escapeo-wishlist', JSON.stringify(wishlist));
  var activeTab = document.querySelector('.filter-tab.active');
  renderDestinations(activeTab ? activeTab.dataset.filter : 'all');
}

function loadWishlist() {
  var grid = document.getElementById('wishlistGrid');
  var wishlistDests = destinations.filter(function(d) { return wishlist.indexOf(d.id) > -1; });
  if (wishlistDests.length === 0) {
    grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 4rem;"><h3>Your wishlist is empty</h3><p>Browse destinations and add your favorites!</p></div>';
    return;
  }
  grid.innerHTML = wishlistDests.map(function(dest) {
    return '<div class="destination-card">' +
      '<div class="destination-image">' +
        '<img src="' + dest.image + '" alt="' + dest.name + '">' +
        '<button class="wishlist-btn active" onclick="toggleWishlist(' + dest.id + ')">❤</button>' +
      '</div>' +
      '<div class="destination-info">' +
        '<div class="destination-header">' +
          '<h3 class="destination-name">' + dest.name + '</h3>' +
          '<div class="destination-rating"><span>★</span> ' + dest.rating + '</div>' +
        '</div>' +
        '<p class="destination-location">📍 ' + dest.location + '</p>' +
        '<div class="destination-footer">' +
          '<div class="destination-price">From <strong>' + formatPriceShort(dest.price) + '</strong>/night</div>' +
          '<button class="btn btn-primary btn-sm" onclick="startBooking(' + dest.id + ')">Book Now</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// BOOKING FLOW
// ============================================
var currentBooking = { step: 1, destination: null, package: null, dates: {}, travelers: {}, extras: [], total: 0 };

function startBooking(destId) {
  if (!currentUser) { openModal('loginModal'); return; }
  currentBooking = { step: 1, destination: destinations.find(function(d) { return d.id === destId; }), package: null, dates: {}, travelers: {}, extras: [], total: 0 };
  openModal('bookingModal');
  updateBookingStep();
}

function startBookingPackage(pkgId) {
  if (!currentUser) { openModal('loginModal'); return; }
  var pkg = packages.find(function(p) { return p.id === pkgId; });
  currentBooking = { step: 1, destination: null, package: pkg, dates: {}, travelers: {}, extras: [], total: pkg.price };
  openModal('bookingModal');
  updateBookingStep();
}

function updateBookingStep() {
  document.querySelectorAll('.booking-step').forEach(function(step, idx) {
    step.classList.remove('active', 'completed');
    if (idx + 1 < currentBooking.step) step.classList.add('completed');
    else if (idx + 1 === currentBooking.step) step.classList.add('active');
  });
  document.querySelectorAll('.booking-step-content').forEach(function(content, idx) {
    content.classList.toggle('active', idx + 1 === currentBooking.step);
  });

  var prevBtn = document.getElementById('bookingPrev');
  var nextBtn = document.getElementById('bookingNext');
  prevBtn.style.display = currentBooking.step === 1 ? 'none' : 'block';
  nextBtn.textContent = currentBooking.step === 5 ? 'Confirm Booking' : 'Continue';

  if (currentBooking.step === 4) updateBookingSummary();
  if (currentBooking.step === 5) updateBookingTotal();
}

function nextBookingStep() {
  if (currentBooking.step === 5) {
    confirmBooking();
    return;
  }
  currentBooking.step++;
  updateBookingStep();
}

function prevBookingStep() {
  if (currentBooking.step > 1) {
    currentBooking.step--;
    updateBookingStep();
  }
}

function updateBookingSummary() {
  var checkIn = document.getElementById('bookCheckIn').value;
  var checkOut = document.getElementById('bookCheckOut').value;
  var adults = parseInt(document.getElementById('bookAdults').value) || 2;
  var children = parseInt(document.getElementById('bookChildren').value) || 0;
  var roomType = document.getElementById('bookRoomType').value;

  var extraChecks = document.querySelectorAll('.extra-check:checked');
  var extras = Array.from(extraChecks).map(function(cb) {
    return { name: cb.dataset.name, price: parseInt(cb.dataset.price) };
  });

  var basePrice = currentBooking.destination ? currentBooking.destination.price : currentBooking.package.price;
  var nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1;
  var roomExtra = roomType === 'deluxe' ? 50 : roomType === 'suite' ? 120 : 0;
  var extrasTotal = extras.reduce(function(sum, e) { return sum + e.price; }, 0);
  var total = (basePrice + roomExtra) * nights + extrasTotal;

  currentBooking.total = total;
  currentBooking.dates = { checkIn: checkIn, checkOut: checkOut };
  currentBooking.travelers = { adults: adults, children: children };
  currentBooking.extras = extras;

  var summary = document.getElementById('bookingSummary');
  summary.innerHTML =
    '<div class="summary-row"><span>Destination</span><span>' + (currentBooking.destination ? currentBooking.destination.name : currentBooking.package.title) + '</span></div>' +
    '<div class="summary-row"><span>Dates</span><span>' + (checkIn || 'Not selected') + ' to ' + (checkOut || 'Not selected') + '</span></div>' +
    '<div class="summary-row"><span>Travelers</span><span>' + adults + ' Adults, ' + children + ' Children</span></div>' +
    '<div class="summary-row"><span>Room Type</span><span>' + roomType.charAt(0).toUpperCase() + roomType.slice(1) + '</span></div>' +
    extras.map(function(e) { return '<div class="summary-row"><span>' + e.name + '</span><span>+' + formatPriceShort(e.price) + '</span></div>'; }).join('') +
    '<div class="summary-row"><span>Total</span><span>' + formatPrice(total) + '</span></div>';
}

function updateBookingTotal() {
  var totalEl = document.getElementById('bookingTotal');
  if (totalEl) {
    totalEl.innerHTML =
      '<div class="total-label">Total Amount</div>' +
      '<div class="total-amount">' + formatPrice(currentBooking.total) + '</div>';
  }
}

function confirmBooking() {
  var booking = {
    id: 'ESC-' + Date.now().toString(36).toUpperCase(),
    userId: currentUser.id,
    destination: currentBooking.destination,
    package: currentBooking.package,
    dates: currentBooking.dates,
    travelers: currentBooking.travelers,
    extras: currentBooking.extras,
    total: currentBooking.total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  localStorage.setItem('escapeo-bookings', JSON.stringify(bookings));
  closeModal('bookingModal');
  showToast('Booking confirmed! Reference: ' + booking.id);
  currentBooking = { step: 1, destination: null, package: null, dates: {}, travelers: {}, extras: [], total: 0 };
}

// ============================================
// PROFILE PAGE
// ============================================
function loadProfile() {
  if (!currentUser) return;
  document.getElementById('profileName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
  document.getElementById('profileEmail').textContent = currentUser.email;
  document.getElementById('profileRole').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Customer';
  document.getElementById('profileAvatar').src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.firstName + ' ' + currentUser.lastName) + '&background=3B82F6&color=fff&size=128';

  document.getElementById('editFirstName').value = currentUser.firstName;
  document.getElementById('editLastName').value = currentUser.lastName;
  document.getElementById('editEmail').value = currentUser.email;
}

function showProfileTab(tab) {
  document.querySelectorAll('.profile-tab').forEach(function(t) { t.classList.add('hidden'); });
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.profile-nav a').forEach(function(a) { a.classList.remove('active'); });
  event.target.classList.add('active');
}

function updateProfile(e) {
  e.preventDefault();
  currentUser.firstName = document.getElementById('editFirstName').value;
  currentUser.lastName = document.getElementById('editLastName').value;
  localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
  loadProfile();
  showToast('Profile updated successfully!');
}

function changePassword(e) {
  e.preventDefault();
  showToast('Password updated successfully!');
}

function setCurrency(curr) {
  changeCurrency(curr);
}

// ============================================
// BOOKINGS PAGE
// ============================================
function loadBookings() {
  var list = document.getElementById('bookingsList');
  var userBookings = bookings.filter(function(b) { return b.userId === (currentUser ? currentUser.id : ''); });

  if (userBookings.length === 0) {
    list.innerHTML = '<div class="text-center" style="padding: 4rem;"><h3>No bookings yet</h3><p>Start exploring and book your first adventure!</p></div>';
    return;
  }

  list.innerHTML = userBookings.map(function(b) {
    return '<div class="booking-item">' +
      '<div class="booking-image">' +
        '<img src="' + (b.destination ? b.destination.image : b.package.image) + '" alt="' + (b.destination ? b.destination.name : b.package.title) + '">' +
      '</div>' +
      '<div class="booking-details">' +
        '<h3>' + (b.destination ? b.destination.name : b.package.title) + '</h3>' +
        '<p>📍 ' + (b.destination ? b.destination.location : b.package.destination) + '</p>' +
        '<p>📅 ' + (b.dates.checkIn || 'N/A') + ' to ' + (b.dates.checkOut || 'N/A') + '</p>' +
        '<p>👥 ' + b.travelers.adults + ' Adults, ' + b.travelers.children + ' Children</p>' +
      '</div>' +
      '<div class="booking-price">' + formatPrice(b.total) + '</div>' +
      '<div class="booking-status status-' + b.status + '">' + b.status + '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// ADMIN DASHBOARD - FIXED
// ============================================
var adminCurrentTab = 'overview';
var adminCharts = {};

function showAdminTab(tab) {
  adminCurrentTab = tab;
  document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.add('hidden'); });
  document.getElementById('admin-' + tab).classList.remove('hidden');
  document.querySelectorAll('.admin-sidebar a').forEach(function(a) { a.classList.remove('active'); });
  event.target.classList.add('active');

  if (tab === 'overview') loadAdminOverview();
  if (tab === 'destinations') loadAdminDestinations();
  if (tab === 'analytics') loadAdminAnalytics();
}

function loadAdminDashboard() {
  destroyAdminCharts();
  showAdminTab('overview');
}

function destroyAdminCharts() {
  Object.keys(adminCharts).forEach(function(key) {
    if (adminCharts[key]) {
      adminCharts[key].destroy();
      adminCharts[key] = null;
    }
  });
}

function loadAdminOverview() {
  document.getElementById('statTotalBookings').textContent = bookings.length;
  document.getElementById('statRevenue').textContent = formatPrice(bookings.reduce(function(sum, b) { return sum + b.total; }, 0));

  destroyAdminCharts();

  var ctx1 = document.getElementById('bookingsChart');
  var ctx2 = document.getElementById('revenueChart');

  if (ctx1 && typeof Chart !== 'undefined') {
    adminCharts.bookingsChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Bookings',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37,99,235,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  if (ctx2 && typeof Chart !== 'undefined') {
    adminCharts.revenueChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: destinations.slice(0, 5).map(function(d) { return d.name; }),
        datasets: [{
          data: [25, 20, 30, 15, 10],
          backgroundColor: ['#2563EB', '#EC4899', '#FACC15', '#3B82F6', '#F472B6']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

function loadAdminDestinations() {
  var tbody = document.getElementById('adminDestinationsTable');
  tbody.innerHTML = destinations.map(function(d) {
    return '<tr>' +
      '<td>' + d.name + '</td>' +
      '<td>' + d.location + '</td>' +
      '<td>' + formatPriceShort(d.price) + '</td>' +
      '<td><button class="btn btn-sm btn-outline" onclick="editDestination(' + d.id + ')">Edit</button></td>' +'</tr>';
  }).join('');
}

function loadAdminAnalytics() {
  destroyAdminCharts();

  var ctx1 = document.getElementById('monthlyRevenueChart');
  var ctx2 = document.getElementById('popularDestinationsChart');

  if (ctx1 && typeof Chart !== 'undefined') {
    adminCharts.monthlyRevenueChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37,99,235,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  if (ctx2 && typeof Chart !== 'undefined') {
    adminCharts.popularDestinationsChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: destinations.slice(0, 5).map(function(d) { return d.name; }),
        datasets: [{
          label: 'Bookings',
          data: [45, 38, 52, 29, 35],
          backgroundColor: ['#2563EB', '#EC4899', '#FACC15', '#2563EB', '#EC4899']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  const hiddenInput = document.getElementById('destImage');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" style="max-width:200px;border-radius:8px;margin-top:10px;" />';
      hiddenInput.value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function addDestination(e) {
  e.preventDefault();

  const imageValue = document.getElementById("destImage").value;

  if (!imageValue) {
    showToast("Please select an image file!", "error");
    return;
  }

  const newDest = {
    id: Date.now(),
    name: document.getElementById("destName").value,
    location: document.getElementById("destLocation").value,
    country: document.getElementById("destCountry").value,
    price: Number(document.getElementById("destPrice").value),
    image: imageValue,
    category: document.getElementById("destCategory").value,
    rating: 4.5,
    reviews: 0
  };

  destinations.push(newDest);
  localStorage.setItem("escapeo-destinations", JSON.stringify(destinations));

  renderDestinations();
  loadAdminDestinations();

  document.getElementById("destName").value = '';
  document.getElementById("destLocation").value = '';
  document.getElementById("destCountry").value = '';
  document.getElementById("destPrice").value = '';
  document.getElementById("destImage").value = '';
  document.getElementById("destImageFile").value = '';
  document.getElementById("imagePreview").innerHTML = '';

  showToast("Destination Added Successfully!");
}

// ============================================
// NEWSLETTER & CONTACT
// ============================================
function subscribeNewsletter(e) {
  e.preventDefault();
  var email = document.getElementById('newsletterEmail').value;
  showToast('Thanks for subscribing! Check ' + email + ' for confirmation.');
  document.getElementById('newsletterEmail').value = '';
}

function sendContact(e) {
  e.preventDefault();
  showToast('Message sent! We will get back to you soon.');
  e.target.reset();
}

function searchDestinations() {
  var query = document.getElementById('searchDestination').value.toLowerCase().trim();
  var resultsContainer = document.getElementById('searchResults');

  if (!query) {
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
    renderDestinations('all');
    return;
  }

  var matched = destinations.filter(function(d) {
    return d.name.toLowerCase().indexOf(query) > -1 || 
           d.location.toLowerCase().indexOf(query) > -1 ||
           d.country.toLowerCase().indexOf(query) > -1;
  });

  resultsContainer.style.display = 'block';

  if (matched.length === 0) {
    resultsContainer.innerHTML = 
      '<div class="search-no-results">' +
        '<div class="search-no-results-icon">🔍</div>' +
        '<h3>No results found</h3>' +
        '<p>Try a different city or country name</p>' +
      '</div>';
  } else {
    var resultsHTML = 
      '<div class="search-results-header">' +
        '<h3>Search Results (' + matched.length + ')</h3>' +
        '<div class="search-results-close" onclick="closeSearchResults()">✕</div>' +
      '</div>' +
      '<div class="search-results-grid">' +
        matched.map(function(dest) {
          return '<div class="search-result-item" onclick="startBooking(' + dest.id + '); closeSearchResults();">' +
            '<img src="' + dest.image + '" alt="' + dest.name + '">' +
            '<div class="search-result-info">' +
              '<h4>' + dest.name + '</h4>' +
              '<p>📍 ' + dest.location + ', ' + dest.country + '</p>' +
              '<div class="price">' + formatPriceShort(dest.price) + '/night</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    resultsContainer.innerHTML = resultsHTML;
  }
}

function searchDestinationsLive(query) {
  var resultsContainer = document.getElementById('searchResults');
  if (!query || query.trim().length < 1) {
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
    renderDestinations('all');
    return;
  }
  searchDestinations();
}

function closeSearchResults() {
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchDestination').value = '';
  renderDestinations('all');
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Handle Google OAuth callback if present in URL
  handleGoogleCallback();

  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);

  initNavbar();
  initCurrencySwitcher();
  updateAuthUI();
  updateGreeting();

  renderDestinations();
  renderPackages();
  renderTestimonials();

  if (typeof Swiper !== 'undefined') {
    new Swiper('.packages-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  document.querySelectorAll('.filter-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderDestinations(tab.dataset.filter);
    });
  });

  document.querySelectorAll('.filter-pill').forEach(function(pill) {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('active'); });
      pill.classList.add('active');
    });
  });

  document.querySelectorAll('.payment-method').forEach(function(method) {
    method.addEventListener('click', function() {
      document.querySelectorAll('.payment-method').forEach(function(m) { m.classList.remove('active'); });
      method.classList.add('active');
    });
  });

  document.getElementById('overlay').addEventListener('click', function() {
    document.querySelectorAll('.modal.active').forEach(function(m) { m.classList.remove('active'); });
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
  });

  var regPassword = document.getElementById('regPassword');
  if (regPassword) {
    regPassword.addEventListener('input', function(e) {
      var val = e.target.value;
      var strength = document.getElementById('regPasswordStrength');
      if (val.length < 6) strength.className = 'password-strength';
      else if (val.length < 10) strength.className = 'password-strength weak';
      else if (val.length < 14) strength.className = 'password-strength medium';
      else strength.className = 'password-strength strong';
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});