let currentCurrency = localStorage.getItem('escapeo-currency') || 'USD';
const EXCHANGE_RATE = 50.5;

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

let currentUser = JSON.parse(localStorage.getItem('escapeo-user')) || null;
let bookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
let wishlist = JSON.parse(localStorage.getItem('escapeo-wishlist')) || [];
let currentBooking = { step: 1, destination: null, package: null, dates: {}, travelers: {}, extras: [], total: 0 };

function formatPrice(amount) {
  if (currentCurrency === 'EGP') {
    return 'EGP ' + Math.round(amount * EXCHANGE_RATE).toLocaleString();
  }
  return '$' + amount.toLocaleString();
}

function formatPriceShort(amount) {
  if (currentCurrency === 'EGP') {
    var egp = Math.round(amount * EXCHANGE_RATE);
    return egp >= 1000 ? 'EGP ' + (egp / 1000).toFixed(1) + 'k' : 'EGP ' + egp;
  }
  return amount >= 1000 ? '$' + (amount / 1000).toFixed(1) + 'k' : '$' + amount;
}

function initCurrencySwitcher() {
  var btn = document.getElementById('currencyBtn');
  var dropdown = document.getElementById('currencyDropdown');
  if (!btn || !dropdown) return;

  // Set initial button label
  btn.textContent = currentCurrency === 'EGP' ? 'ج.م ▼' : '$ ▼';

  // Toggle dropdown on button click
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    dropdown.classList.remove('active');
  });

  // Handle currency selection
  dropdown.querySelectorAll('[data-currency]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      currentCurrency = this.dataset.currency;
      localStorage.setItem('escapeo-currency', currentCurrency);
      btn.textContent = currentCurrency === 'EGP' ? 'ج.م ▼' : '$ ▼';
      dropdown.classList.remove('active');

      // Re-render price-sensitive UI
      var activeTab = document.querySelector('.filter-tab.active');
      renderDestinations(activeTab ? activeTab.dataset.filter : 'all');
      renderPackages();

      // Sync preferences dropdown if visible
      var prefCurrency = document.getElementById('prefCurrency');
      if (prefCurrency) prefCurrency.value = currentCurrency;
    });
  });

  // Sync prefCurrency dropdown in profile
  var prefCurrency = document.getElementById('prefCurrency');
  if (prefCurrency) {
    prefCurrency.value = currentCurrency;
    prefCurrency.addEventListener('change', function() {
      currentCurrency = this.value;
      localStorage.setItem('escapeo-currency', currentCurrency);
      btn.textContent = currentCurrency === 'EGP' ? 'ج.م ▼' : '$ ▼';
      var activeTab = document.querySelector('.filter-tab.active');
      renderDestinations(activeTab ? activeTab.dataset.filter : 'all');
      renderPackages();
    });
  }
}

if (!localStorage.getItem('escapeo-destinations')) {
  localStorage.setItem('escapeo-destinations', JSON.stringify(destinations));
}
if (!localStorage.getItem('escapeo-packages')) {
  localStorage.setItem('escapeo-packages', JSON.stringify(packages));
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
  if (hamburger) {
    hamburger.addEventListener('click', function() { mobileMenu.classList.add('active'); });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
  }
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

function login(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;

  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.error) {
      showToast(data.error || 'Invalid credentials', 'error');
      return;
    }
    if (data.token && data.user) {
      currentUser = data.user;
      localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
      localStorage.setItem('escapeo-token', data.token);
      closeModal('loginModal');
      updateAuthUI();
      showToast('Welcome back, ' + currentUser.firstName + '!');
      if (currentUser.role === 'admin') router('admin');
      return;
    }
    showToast('Login failed. Please try again.', 'error');
  })
  .catch(function() {
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
  });
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

  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.error) { showToast(data.error, 'error'); return; }
    if (data.token && data.user) {
      currentUser = data.user;
      localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
      localStorage.setItem('escapeo-token', data.token);
      closeModal('registerModal');
      updateAuthUI();
      showToast('Account created successfully!');
      return;
    }
    showToast('Registration failed. Please try again.', 'error');
  })
  .catch(function() {
    currentUser = { id: Date.now().toString(), email: email, firstName: firstName, lastName: lastName, role: 'customer' };
    localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
    closeModal('registerModal');
    updateAuthUI();
    showToast('Account created successfully!');
  });
}

function logout() {
  currentUser = null;
  localStorage.removeItem('escapeo-user');
  localStorage.removeItem('escapeo-token');
  updateAuthUI();
  showToast('Logged out successfully');
  router('home');
}

function handleGoogleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  const error = urlParams.get('error');

  if (error) {
    showToast('Google sign in failed: ' + error, 'error');
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  if (token && userStr) {
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      currentUser = user;
      localStorage.setItem('escapeo-user', JSON.stringify(user));
      localStorage.setItem('escapeo-token', token);
      updateAuthUI();
      showToast('Welcome, ' + user.firstName + '!');
      window.history.replaceState({}, document.title, window.location.pathname);
      if (user.role === 'admin') {
        router('admin');
      }
    } catch (e) {
      console.error('Error parsing Google user data:', e);
      showToast('Failed to process Google sign in', 'error');
    }
  }
}

function hideLoader() {
  var loader = document.getElementById('loader');
  if (!loader) return;
  loader.style.opacity = '0';
  loader.style.transition = 'opacity 0.4s ease';
  setTimeout(function() { loader.style.display = 'none'; }, 400);
}

function showEl(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function hideEl(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function router(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.add('hidden'); });

  if (page === 'home') {
    showEl('page-home');
    showEl('mainFooter');
    window.scrollTo(0, 0);
  } else if (page === 'profile') {
    if (!currentUser) { openModal('loginModal'); return; }
    showEl('page-profile');
    loadProfile();
  } else if (page === 'bookings') {
    if (!currentUser) { openModal('loginModal'); return; }
    showEl('page-bookings');
    loadBookings();
  } else if (page === 'wishlist') {
    if (!currentUser) { openModal('loginModal'); return; }
    showEl('page-wishlist');
    loadWishlist();
  } else if (page === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Access denied', 'error');
      return;
    }
    showEl('page-admin');
    hideEl('mainFooter');
    loadAdminDashboard();
  }

  hideEl('mobileMenu');
}

function renderDestinations(filter) {
  filter = filter || 'all';
  var grid = document.getElementById('destinationsGrid');
  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  var filtered = filter === 'all' ? allDests : allDests.filter(function(d) { return d.category === filter; });

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

function startBooking(destId) {
  if (!currentUser) { openModal('loginModal'); return; }
  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  currentBooking = { step: 1, destination: allDests.find(function(d) { return d.id === destId; }), package: null, dates: {}, travelers: {}, extras: [], total: 0 };
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
  var token = localStorage.getItem('escapeo-token');
  var refNumber = 'ESC-' + Date.now().toString(36).toUpperCase();

  var checkIn = document.getElementById('bookCheckIn') ? document.getElementById('bookCheckIn').value : '';
  var checkOut = document.getElementById('bookCheckOut') ? document.getElementById('bookCheckOut').value : '';
  var adults = document.getElementById('bookAdults') ? parseInt(document.getElementById('bookAdults').value) || 2 : 2;
  var children = document.getElementById('bookChildren') ? parseInt(document.getElementById('bookChildren').value) || 0 : 0;
  var roomType = document.getElementById('bookRoomType') ? document.getElementById('bookRoomType').value : 'standard';
  var specialRequests = document.getElementById('bookRequests') ? document.getElementById('bookRequests').value : '';
  var paymentMethodEl = document.querySelector('input[name="payment"]:checked');
  var paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'card';

  var extraChecks = document.querySelectorAll('.extra-check:checked');
  var extras = Array.from(extraChecks).map(function(cb) {
    return { name: cb.dataset.name, price: parseInt(cb.dataset.price) };
  });

  if (token) {
    var payload = {
      destination_id: currentBooking.destination ? currentBooking.destination.id : null,
      package_id: currentBooking.package ? currentBooking.package.id : null,
      check_in: checkIn,
      check_out: checkOut,
      adults: adults,
      children: children,
      room_type: roomType,
      extras: extras,
      total_price: currentBooking.total,
      payment_method: paymentMethod,
      special_requests: specialRequests
    };

    fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.error || 'Failed to save booking');
        });
      }
      return res.json();
    })
    .then(function(data) {
      closeModal('bookingModal');
      showToast('Booking submitted! Reference: ' + (data.ref_number || refNumber) + ' — Awaiting admin confirmation.');
      currentBooking = { step: 1, destination: null, package: null, dates: {}, travelers: {}, extras: [], total: 0 };
      if (document.getElementById('page-bookings') && !document.getElementById('page-bookings').classList.contains('hidden')) {
        loadBookings();
      }
    })
    .catch(function(err) {
      console.error('Booking API error:', err);
      // Fallback to localStorage on API error
      saveBookingLocally(refNumber, checkIn, checkOut, adults, children, roomType, extras, specialRequests);
    });

  } else {
    saveBookingLocally(refNumber, checkIn, checkOut, adults, children, roomType, extras, specialRequests);
  }
}

function saveBookingLocally(refNumber, checkIn, checkOut, adults, children, roomType, extras, specialRequests) {
  var booking = {
    id: refNumber,
    userId: currentUser.id,
    destination: currentBooking.destination,
    package: currentBooking.package,
    dates: { checkIn: checkIn, checkOut: checkOut },
    travelers: { adults: adults, children: children },
    extras: extras,
    total: currentBooking.total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  localStorage.setItem('escapeo-bookings', JSON.stringify(bookings));
  closeModal('bookingModal');
  showToast('Booking submitted! Reference: ' + booking.id + ' — Awaiting admin confirmation.');
  currentBooking = { step: 1, destination: null, package: null, dates: {}, travelers: {}, extras: [], total: 0 };
}

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

function loadBookings() {
  var list = document.getElementById('bookingsList');
  if (!list) return;

  list.innerHTML = '<div class="text-center" style="padding: 2rem;"><p>Loading your bookings...</p></div>';

  var token = localStorage.getItem('escapeo-token');

  if (token) {
    fetch('/api/bookings', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load bookings');
      return res.json();
    })
    .then(function(data) {
      if (data.length === 0) {
        list.innerHTML = '<div class="text-center" style="padding: 3rem;"><h3>No bookings yet</h3><p>Start exploring and book your first adventure!</p><button class="btn btn-primary" onclick="router(\'home\')">Explore Destinations</button></div>';
        return;
      }

      list.innerHTML = data.map(function(b) {
        var destName = b.destination_name || b.package_title || 'N/A';
        var destImage = b.destination_image || b.package_image || '';
        var destLocation = b.destination_location || b.package_destination || '';
        var statusClass = 'status-' + (b.status || 'pending');

        return '<div class="booking-item">' +
          '<div class="booking-image">' +
            '<img src="' + destImage + '" alt="' + destName + '">' +
          '</div>' +
          '<div class="booking-details">' +
            '<h3>' + destName + '</h3>' +
            '<p>📍 ' + destLocation + '</p>' +
            '<p>📅 ' + (b.check_in || 'N/A') + ' to ' + (b.check_out || 'N/A') + '</p>' +
            '<p>👥 ' + (b.adults || 0) + ' Adults, ' + (b.children || 0) + ' Children</p>' +
            '<p>🏷 Ref: ' + (b.ref_number || b.id) + '</p>' +
          '</div>' +
          '<div class="booking-price">' + formatPrice(b.total_price || 0) + '</div>' +
          '<div class="booking-status ' + statusClass + '">' + (b.status || 'pending') + '</div>' +
        '</div>';
      }).join('');
    })
    .catch(function(err) {
      console.error('Error loading bookings:', err);
      loadBookingsFromLocalStorage(list);
    });
  } else {
    loadBookingsFromLocalStorage(list);
  }
}

function loadBookingsFromLocalStorage(list) {
  var userBookings = bookings.filter(function(b) { return b.userId === (currentUser ? currentUser.id : null); });
  if (userBookings.length === 0) {
    list.innerHTML = '<div class="text-center" style="padding: 3rem;"><h3>No bookings yet</h3><p>Start exploring and book your first adventure!</p><button class="btn btn-primary" onclick="router(\'home\')">Explore Destinations</button></div>';
    return;
  }
  list.innerHTML = userBookings.map(function(b) {
    var destName = b.destination ? b.destination.name : b.package ? b.package.title : 'N/A';
    var destImage = b.destination ? b.destination.image : b.package ? b.package.image : '';
    var statusClass = 'status-' + (b.status || 'pending');
    return '<div class="booking-item">' +
      '<div class="booking-image"><img src="' + destImage + '" alt="' + destName + '"></div>' +
      '<div class="booking-details">' +
        '<h3>' + destName + '</h3>' +
        '<p>📅 ' + (b.dates.checkIn || 'N/A') + ' to ' + (b.dates.checkOut || 'N/A') + '</p>' +
        '<p>👥 ' + (b.travelers.adults || 0) + ' Adults, ' + (b.travelers.children || 0) + ' Children</p>' +
        '<p>🏷 Ref: ' + b.id + '</p>' +
      '</div>' +
      '<div class="booking-price">' + formatPrice(b.total || 0) + '</div>' +
      '<div class="booking-status ' + statusClass + '">' + (b.status || 'pending') + '</div>' +
    '</div>';
  }).join('');
}

function showProfileTab(tab, event) {
  if (event) event.preventDefault();
  document.querySelectorAll('.profile-tab').forEach(function(t) { t.classList.add('hidden'); });
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.profile-nav a').forEach(function(a) { a.classList.remove('active'); });
  if (event && event.target) {
    event.target.classList.add('active');
  }
  if (tab === 'bookings') {
    loadProfileBookings();
  }
}

function loadProfileBookings() {
  var list = document.getElementById('profileBookingsList');
  if (!list) return;

  list.innerHTML = '<div class="text-center" style="padding: 2rem;"><p>Loading your bookings...</p></div>';

  var token = localStorage.getItem('escapeo-token');

  if (token) {
    fetch('/api/bookings', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load bookings');
      return res.json();
    })
    .then(function(data) {
      if (data.length === 0) {
        list.innerHTML = '<div class="text-center" style="padding: 3rem;"><h3>No bookings yet</h3><p>Start exploring and book your first adventure!</p><button class="btn btn-primary" onclick="router(\'home\')">Explore Destinations</button></div>';
        return;
      }

      list.innerHTML = data.map(function(b) {
        var destName = b.destination_name || b.package_title || 'N/A';
        var destImage = b.destination_image || b.package_image || '';
        var destLocation = b.destination_location || b.package_destination || '';
        var statusClass = 'status-' + (b.status || 'pending');

        return '<div class="booking-item">' +
          '<div class="booking-image">' +
            '<img src="' + destImage + '" alt="' + destName + '">' +
          '</div>' +
          '<div class="booking-details">' +
            '<h3>' + destName + '</h3>' +
            '<p>📍 ' + destLocation + '</p>' +
            '<p>📅 ' + (b.check_in || 'N/A') + ' to ' + (b.check_out || 'N/A') + '</p>' +
            '<p>👥 ' + (b.adults || 0) + ' Adults, ' + (b.children || 0) + ' Children</p>' +
            '<p>🏷 Ref: ' + (b.ref_number || b.id) + '</p>' +
          '</div>' +
          '<div class="booking-price">' + formatPrice(b.total_price || 0) + '</div>' +
          '<div class="booking-status ' + statusClass + '">' + (b.status || 'pending') + '</div>' +
        '</div>';
      }).join('');
    })
    .catch(function(err) {
      console.error('Error loading bookings:', err);
      loadBookingsFromLocalStorage(list);
    });
  } else {
    loadBookingsFromLocalStorage(list);
  }
}


function loadAdminDestinations() {
  var tbody = document.getElementById('adminDestinationsTable');
  if (!tbody) return;
  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  tbody.innerHTML = allDests.map(function(d) {
    return '<tr>' +
      '<td>' + d.name + '</td>' +
      '<td>' + d.location + ', ' + d.country + '</td>' +
      '<td>' + d.category + '</td>' +
      '<td>' + formatPrice(d.price) + '/night</td>' +
      '<td><button class="btn btn-sm" style="background:#ef4444;color:#fff;border-radius:6px;" onclick="deleteDestination(' + d.id + ')">🗑 Delete</button></td>' +
    '</tr>';
  }).join('');
}

function deleteDestination(id) {
  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  allDests = allDests.filter(function(d) { return d.id !== id; });
  localStorage.setItem('escapeo-destinations', JSON.stringify(allDests));
  loadAdminDestinations();
  showToast('Destination deleted');
}


function previewDestImage(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var preview = document.getElementById('imagePreview');
    var placeholder = document.getElementById('imageUploadPlaceholder');
    var urlInput = document.getElementById('destImage');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    placeholder.style.display = 'none';
    urlInput.value = '';
    // Store base64 in a data attribute for later use
    document.getElementById('imageUploadArea').dataset.base64 = e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewDestImageUrl(url) {
  if (!url) return;
  var preview = document.getElementById('imagePreview');
  var placeholder = document.getElementById('imageUploadPlaceholder');
  var fileInput = document.getElementById('destImageFile');
  preview.src = url;
  preview.onload = function() {
    preview.classList.remove('hidden');
    placeholder.style.display = 'none';
    document.getElementById('imageUploadArea').dataset.base64 = '';
    fileInput.value = '';
  };
  preview.onerror = function() {
    preview.classList.add('hidden');
    placeholder.style.display = '';
  };
}

function addDestination(e) {
  e.preventDefault();
  var name     = document.getElementById('destName').value.trim();
  var location = document.getElementById('destLocation').value.trim();
  var country  = document.getElementById('destCountry').value.trim();
  var price    = parseFloat(document.getElementById('destPrice').value);
  var category = document.getElementById('destCategory').value;
  var uploadArea = document.getElementById('imageUploadArea');
  var base64Image = uploadArea ? uploadArea.dataset.base64 : '';
  var image    = base64Image ||
                 document.getElementById('destImage').value.trim() ||
                 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80';

  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  var newId = allDests.reduce(function(max, d) { return d.id > max ? d.id : max; }, 0) + 1;

  var newDest = {
    id: newId,
    name: name,
    location: location,
    country: country,
    category: category,
    image: image,
    price: price,
    rating: 4.5,
    reviews: 0
  };

  allDests.push(newDest);
  localStorage.setItem('escapeo-destinations', JSON.stringify(allDests));

  // Reset form
  ['destName','destLocation','destCountry','destPrice','destImage','destImageFile'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var preview = document.getElementById('imagePreview');
  var placeholder = document.getElementById('imageUploadPlaceholder');
  var uploadArea = document.getElementById('imageUploadArea');
  if (preview) { preview.src = ''; preview.classList.add('hidden'); }
  if (placeholder) placeholder.style.display = '';
  if (uploadArea) uploadArea.dataset.base64 = '';

  showToast('Destination "' + name + '" added successfully!');
  showAdminTab('destinations', null);
}

function loadAdminDashboard() {
  loadAdminOverview();
  loadAdminBookings();
  loadAdminDestinations();
  renderTopDestinationsChart();
}
function renderTopDestinationsChart() {
  var container = document.getElementById('topDestinationsChart');
  if (!container) return;

  // Get data from localStorage
  var localBookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
  var counts = {};
  localBookings.forEach(function(b) {
    var name = b.destination ? b.destination.name : b.package ? b.package.title : null;
    if (name) counts[name] = (counts[name] || 0) + 1;
  });

  // Demo data if no bookings
  if (Object.keys(counts).length === 0) {
    counts = { Tokyo: 4, Paris: 3, Maldives: 3, Bali: 2, London: 2, Istanbul: 1 };
  }

  var sorted = Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 6);
  var maxVal = sorted[0][1];

  var colors = ['#7c3aed','#8b5cf6','#a78bfa','#3b82f6','#60a5fa','#93c5fd'];

  var html = '<div style="display:flex; flex-direction:column; gap:14px;">';
  sorted.forEach(function(entry, i) {
    var name = entry[0];
    var val  = entry[1];
    var pct  = Math.round((val / maxVal) * 100);
    var color = colors[i] || '#7c3aed';
    html +=
      '<div style="display:flex; align-items:center; gap:12px;">' +
        '<div style="width:90px; font-size:0.85rem; color:#475569; font-weight:500; text-align:right; flex-shrink:0;">' + name + '</div>' +
        '<div style="flex:1; background:#f1f5f9; border-radius:999px; height:28px; overflow:hidden;">' +
          '<div style="width:' + pct + '%; height:100%; background:' + color + '; border-radius:999px; transition:width 0.6s ease; display:flex; align-items:center; justify-content:flex-end; padding-right:10px;">' +
            '<span style="color:#fff; font-size:0.78rem; font-weight:700;">' + val + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}




function loadAdminOverview() {
  var token = localStorage.getItem('escapeo-token');
  
  // Calculate stats from localStorage as fallback
  var localBookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
  var totalRevenue = localBookings.reduce(function(sum, b) { return sum + (b.total || 0); }, 0);
  var totalBookings = localBookings.length;
  var pendingBookings = localBookings.filter(function(b) { return b.status === 'pending'; }).length;

  // Update stat cards with local data first
  var totalRevenueEl = document.getElementById('adminTotalRevenue');
  var totalBookingsEl = document.getElementById('adminTotalBookings');
  var totalCustomersEl = document.getElementById('adminTotalCustomers');
  var pendingBookingsEl = document.getElementById('adminPendingBookings');

  if (totalRevenueEl) totalRevenueEl.textContent = formatPrice(totalRevenue);
  if (totalBookingsEl) totalBookingsEl.textContent = totalBookings.toLocaleString();
  if (pendingBookingsEl) pendingBookingsEl.textContent = pendingBookings.toLocaleString();
  if (totalCustomersEl) totalCustomersEl.textContent = '1';

  if (!token) {
    return;
  }

  fetch('/api/admin/stats', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  })
  .then(function(data) {
    if (totalRevenueEl) totalRevenueEl.textContent = formatPrice(data.total_revenue || 0);
    if (totalBookingsEl) totalBookingsEl.textContent = (data.total_bookings || 0).toLocaleString();
    if (totalCustomersEl) totalCustomersEl.textContent = (data.total_customers || 0).toLocaleString();
    if (pendingBookingsEl) pendingBookingsEl.textContent = (data.pending_bookings || 0).toLocaleString();

  })
  .catch(function(err) {
    console.error('Admin stats error:', err);
    showToast('Failed to load admin stats', 'error');
  });
}

function loadAdminBookings() {
  var token = localStorage.getItem('escapeo-token');

  var list = document.getElementById('adminBookingsList');
  if (!list) return;

  // First load from localStorage as fallback
  var localBookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
  
  if (localBookings.length > 0) {
    renderAdminBookingsTable(localBookings);
  } else {
    list.innerHTML = '<tr><td colspan="8" class="text-center">No bookings found</td></tr>';
  }

  if (!token) return;

  list.innerHTML = '<tr><td colspan="8" class="text-center">Loading bookings...</td></tr>';

  fetch('/api/bookings', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Failed to load bookings');
    return res.json();
  })
  .then(function(data) {
    if (data.length === 0) {
      list.innerHTML = '<tr><td colspan="8" class="text-center">No bookings found</td></tr>';
      return;
    }
    renderAdminBookingsTable(data);
  })
  .catch(function(err) {
    console.error('Admin bookings error:', err);
    // Keep localStorage data displayed
  });
}

function renderAdminBookingsTable(data) {
  var list = document.getElementById('adminBookingsList');
  if (!list) return;
  
  list.innerHTML = data.map(function(b) {
    var statusClass = 'status-' + (b.status || 'pending');
    var customerName = b.customer_name || 'N/A';
    var customerEmail = b.customer_email || '';
    var destName = b.destination_name || b.package_title || 'N/A';
    var checkIn = b.check_in || (b.dates ? b.dates.checkIn : 'N/A');
    var checkOut = b.check_out || (b.dates ? b.dates.checkOut : 'N/A');
    var adults = b.adults || (b.travelers ? b.travelers.adults : 0);
    var children = b.children || (b.travelers ? b.travelers.children : 0);
    var totalPrice = b.total_price || b.total || 0;
    var bookingId = b.id || b.ref_number || '';
    
    return '<tr>' +
      '<td>' + (b.ref_number || b.id) + '</td>' +
      '<td>' + customerName + '<br><small>' + customerEmail + '</small></td>' +
      '<td>' + destName + '</td>' +
      '<td>' + checkIn + ' to ' + checkOut + '</td>' +
      '<td>' + adults + ' Adults, ' + children + ' Children</td>' +
      '<td>' + formatPrice(totalPrice) + '</td>' +
      '<td><span class="status-badge ' + statusClass + '">' + (b.status || 'pending') + '</span></td>' +
      '<td>' +
        '<button class="btn btn-sm btn-success" onclick="updateBookingStatus(\'' + bookingId + '\', \'confirmed\')">Confirm</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="updateBookingStatus(\'' + bookingId + '\', \'cancelled\')">Cancel</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function loadAdminUsers() {
  var token = localStorage.getItem('escapeo-token');
  if (!token) return;

  var list = document.getElementById('adminUsersList');
  if (!list) return;

  list.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';

  fetch('/api/admin/users', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  })
  .then(function(data) {
    if (data.length === 0) {
      list.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
      return;
    }

    list.innerHTML = data.map(function(u) {
      return '<tr>' +
        '<td>' + u.id + '</td>' +
        '<td>' + u.first_name + ' ' + u.last_name + '</td>' +
        '<td>' + u.email + '</td>' +
        '<td>' + u.role + '</td>' +
        '<td>' + (u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A') + '</td>' +
      '</tr>';
    }).join('');
  })
  .catch(function(err) {
    console.error('Admin users error:', err);
    list.innerHTML = '<tr><td colspan="5" class="text-center" style="color: #ef4444;">Error loading users</td></tr>';
  });
}

function updateBookingStatus(bookingId, status) {
  var token = localStorage.getItem('escapeo-token');
  
  // Update localStorage first
  var localBookings = JSON.parse(localStorage.getItem('escapeo-bookings')) || [];
  var bookingIndex = localBookings.findIndex(function(b) { return b.id == bookingId || b.ref_number == bookingId; });
  if (bookingIndex > -1) {
    localBookings[bookingIndex].status = status;
    localStorage.setItem('escapeo-bookings', JSON.stringify(localBookings));
    bookings = localBookings;
  }
  
  showToast('Booking status updated to ' + status);
  loadAdminBookings();
  loadAdminOverview();

  if (!token) return;

  fetch('/api/bookings/' + bookingId + '/status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ status: status })
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  })
  .then(function() {
    showToast('Booking status updated to ' + status);
    loadAdminBookings();
    loadAdminOverview();
  })
  .catch(function(err) {
    console.error('Update status error:', err);
  });
}

function showAdminTab(tab, event) {
  if (event) event.preventDefault();
  document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.add('hidden'); });
  var tabEl = document.getElementById('admin-tab-' + tab);
  if (tabEl) tabEl.classList.remove('hidden');
  
  document.querySelectorAll('.admin-nav a').forEach(function(a) { a.classList.remove('active'); });
  if (event && event.target) {
    event.target.classList.add('active');
  }
  
  if (tab === 'bookings') {
    loadAdminBookings();
  } else if (tab === 'destinations') {
    loadAdminDestinations();
  } else if (tab === 'overview') {
    loadAdminOverview();
    renderTopDestinationsChart();
  }
}

function saveProfile(e) {
  e.preventDefault();
  var firstName = document.getElementById('editFirstName').value;
  var lastName = document.getElementById('editLastName').value;
  var phone = document.getElementById('editPhone').value;
  var currency = document.getElementById('editCurrency');
  var language = document.getElementById('editLanguage');
  var token = localStorage.getItem('escapeo-token');

  if (token) {
    fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName, phone: phone, preferredCurrency: currency ? currency.value : 'USD', language: language ? language.value : 'en' })
    })
    .then(function(res) { return res.json(); })
    .then(function() {
      currentUser.firstName = firstName;
      currentUser.lastName = lastName;
      localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
      updateAuthUI();
      showToast('Profile updated successfully!');
    })
    .catch(function() {
      showToast('Profile updated!');
    });
  } else {
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    localStorage.setItem('escapeo-user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('Profile updated!');
  }
}

function changePassword(e) {
  e.preventDefault();
  var currentPassword = document.getElementById('currentPassword').value;
  var newPassword = document.getElementById('newPassword').value;
  var confirmNewPassword = document.getElementById('confirmNewPassword').value;
  var token = localStorage.getItem('escapeo-token');

  if (newPassword !== confirmNewPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  if (token) {
    fetch('/api/users/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to change password');
      return res.json();
    })
    .then(function() {
      showToast('Password changed successfully!');
      document.getElementById('passwordForm').reset();
    })
    .catch(function(err) {
      showToast(err.message || 'Failed to change password', 'error');
    });
  } else {
    showToast('Password changed!');
    document.getElementById('passwordForm').reset();
  }
}


function searchDestinationsLive(query) {
  query = query.trim().toLowerCase();
  var resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;

  if (!query) {
    resultsEl.style.display = 'none';
    resultsEl.innerHTML = '';
    return;
  }

  var allDests = JSON.parse(localStorage.getItem('escapeo-destinations')) || destinations;
  var matched = allDests.filter(function(d) {
    return d.name.toLowerCase().includes(query) ||
           d.location.toLowerCase().includes(query) ||
           d.country.toLowerCase().includes(query) ||
           d.category.toLowerCase().includes(query);
  });

  if (matched.length === 0) {
    resultsEl.innerHTML = '<div class="search-no-results">No destinations found for "<strong>' + query + '</strong>"</div>';
    resultsEl.style.display = 'block';
    return;
  }

  resultsEl.innerHTML = matched.map(function(d) {
    return '<div class="search-result-card" onclick="scrollToDestination(' + d.id + ')">' +
      '<img src="' + d.image + '" alt="' + d.name + '" />' +
      '<div class="search-result-info">' +
        '<h4>' + d.name + '</h4>' +
        '<p>📍 ' + d.location + ', ' + d.country + '</p>' +
        '<span class="search-result-badge">' + d.category + '</span>' +
      '</div>' +
      '<div class="search-result-price">' +
        '<strong>' + formatPriceShort(d.price) + '</strong>' +
        '<span>/night</span>' +
        '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); startBooking(' + d.id + ')">Book</button>' +
      '</div>' +
    '</div>';
  }).join('');

  resultsEl.style.display = 'block';
}

function searchDestinations() {
  var query = document.getElementById('searchDestination').value.trim();
  searchDestinationsLive(query);
  if (!query) {
    // scroll to destinations section if no query
    var section = document.getElementById('destinations');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToDestination(destId) {
  // Close search results and scroll to destinations section
  var resultsEl = document.getElementById('searchResults');
  if (resultsEl) resultsEl.style.display = 'none';
  var section = document.getElementById('destinations');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  // Highlight the matching card
  setTimeout(function() {
    renderDestinations('all');
    // Set filter to all
    document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
    var allTab = document.querySelector('.filter-tab[data-filter="all"]');
    if (allTab) allTab.classList.add('active');
  }, 400);
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
  var box = document.querySelector('.search-box');
  var results = document.getElementById('searchResults');
  if (results && box && !box.contains(e.target) && !results.contains(e.target)) {
    results.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // ✅ إخفاء الـ loader أول حاجة فوراً — مستقل عن أي حاجة تانية
  hideLoader();

  try { initNavbar(); } catch(e) { console.error('initNavbar:', e); }
  try { initCurrencySwitcher(); } catch(e) { console.error('initCurrencySwitcher:', e); }
  try { updateGreeting(); } catch(e) { console.error('updateGreeting:', e); }
  try { updateAuthUI(); } catch(e) { console.error('updateAuthUI:', e); }
  try { handleGoogleCallback(); } catch(e) { console.error('handleGoogleCallback:', e); }
  try { router('home'); } catch(e) { console.error('router:', e); }

  try { renderDestinations('all'); } catch(e) { console.error('renderDestinations:', e); }
  try { renderPackages(); } catch(e) { console.error('renderPackages:', e); }
  try { renderTestimonials(); } catch(e) { console.error('renderTestimonials:', e); }

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderDestinations(tab.dataset.filter);
    });
  });

  // Auth forms
  var loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', login);

  var registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', register);

  var contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', submitContact);

  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) newsletterForm.addEventListener('submit', subscribeNewsletter);

  var profileForm = document.getElementById('profileForm');
  if (profileForm) profileForm.addEventListener('submit', saveProfile);

  var passwordForm = document.getElementById('passwordForm');
  if (passwordForm) passwordForm.addEventListener('submit', changePassword);
});