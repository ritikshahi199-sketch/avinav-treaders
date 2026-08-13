import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function useInfiniteTypewriter(words, speed = 100, pauseTime = 1500) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const timer = setTimeout(() => {
      setText(isDeleting ? currentWord.substring(0, text.length - 1) : currentWord.substring(0, text.length + 1));
      if (!isDeleting && text === currentWord) setTimeout(() => setIsDeleting(true), pauseTime);
      else if (isDeleting && text === '') { setIsDeleting(false); setWordIndex((prev) => prev + 1); }
    }, isDeleting ? 50 : speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, speed, pauseTime]);
  return text;
}

function App() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [showTopBar, setShowTopBar] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false); // 👈 नया स्टेट (स्क्रॉल ट्रैक करने के लिए)
  const lastScrollY = useRef(0);

  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shopPhone = "919838558286";

  const jewelryRef = useRef(null);
  const batteryRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // टॉप बार हाइड/शो लॉजिक
      if (window.scrollY > lastScrollY.current && window.scrollY > 40) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      lastScrollY.current = window.scrollY;

      // 👈 बैक टू टॉप बटन दिखाने का लॉजिक (अगर 100px से ज्यादा नीचे गए तो दिखेगा)
      if (window.scrollY > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jewelryWords = lang === 'hi' ? ['अभिनव ज्वेलरी कलेक्शन', 'शुद्ध हॉलमार्क सोना'] : ['Abhinav Jewelry Collection', 'Pure Hallmark Gold'];
  const batteryWords = lang === 'hi' ? ['ल्यूमिनस बैटरी एवं सोलर', 'पावर बैकअप'] : ['Luminous Battery & Solar', 'Power Backup'];
  const servicesWords = lang === 'hi' ? ['फिनो बैंक, सोलर एवं LIC सेवाएं', 'सभी सुविधाएं एक जगह'] : ['Fino Bank, Solar & LIC Services', 'All Solutions Under One Roof'];

  const typedJewelry = useInfiniteTypewriter(jewelryWords);
  const typedBattery = useInfiniteTypewriter(batteryWords);
  const typedServices = useInfiniteTypewriter(servicesWords);

  const [jewelryList, setJewelryList] = useState(() => {
    const saved = localStorage.getItem('abhinav_jewelry');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Royal Bridal Gold Necklace', price: '₹48,000', img: 'https://staticimg.titan.co.in/Tanishq/Catalog/502120DAAA00_1.jpg', desc: 'BIS Hallmark Pure Gold' },
      { id: 2, name: 'Sparkling Diamond Ring', price: '₹19,500', img: 'https://staticimg.titan.co.in/Tanishq/Catalog/501118FBAAA09_1.jpg', desc: 'Certified Diamond' }
    ];
  });

  const [batteryList, setBatteryList] = useState(() => {
    const saved = localStorage.getItem('abhinav_battery');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Luminous Tubular 150Ah', price: '₹14,500', img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80', desc: '36 Months Warranty' },
      { id: 2, name: 'Luminous Sine Wave Inverter', price: '₹7,200', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80', desc: '1100VA Home Backup' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('abhinav_jewelry', JSON.stringify(jewelryList));
  }, [jewelryList]);

  useEffect(() => {
    localStorage.setItem('abhinav_battery', JSON.stringify(batteryList));
  }, [batteryList]);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newType, setNewType] = useState('jewelry');

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === '12345') {
      setIsAdmin(true);
    } else {
      setPass('');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    let imageUrl = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80';
    if (newImageFile) {
      imageUrl = URL.createObjectURL(newImageFile);
    }

    const newItem = {
      id: Date.now(),
      name: newTitle,
      price: newPrice,
      img: imageUrl,
      desc: lang === 'hi' ? 'नया उत्पाद' : 'New Arrival'
    };

    if (newType === 'jewelry') {
      setJewelryList([...jewelryList, newItem]);
    } else {
      setBatteryList([...batteryList, newItem]);
    }

    setNewTitle('');
    setNewPrice('');
    setNewImageFile(null);
  };

  const confirmDeleteJewelry = (id) => {
    if (window.confirm(lang === 'hi' ? 'क्या आप वाकई इस प्रोडक्ट को हटाना चाहते हैं?' : 'Are you sure you want to delete this product?')) {
      setJewelryList(jewelryList.filter(i => i.id !== id));
    }
  };

  const confirmDeleteBattery = (id) => {
    if (window.confirm(lang === 'hi' ? 'क्या आप वाकई इस प्रोडक्ट को हटाना चाहते हैं?' : 'Are you sure you want to delete this product?')) {
      setBatteryList(batteryList.filter(i => i.id !== id));
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const submitOrder = (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerAddress) return;

    const message = `🛍️ New VIP Order Received!\n\nProduct: ${selectedProduct.name}\nPrice: ${selectedProduct.price}\n\nCustomer Name: ${buyerName}\nPhone: ${buyerPhone}\nAddress: ${buyerAddress}\nPayment Mode: ${paymentMethod}`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${shopPhone}?text=${encodedMessage}`, '_blank');
    setShowOrderModal(false);
    setBuyerName('');
    setBuyerPhone('');
    setBuyerAddress('');
  };

  const filteredJewelry = jewelryList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBattery = batteryList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App" id="home">
      {/* Top Bar */}
      <div className={`top-bar ${showTopBar ? 'visible' : 'hidden'}`}>
        <div className="top-left-group">
          <span className="top-gst red-highlight">GSTIN: 09DXPS3601H2Z0</span>
          <span className="top-prop red-highlight">Prop: Ambika Sharma (<a href="tel:9838558286" className="clean-link">9838558286</a>)</span>
        </div>
      </div>

      {/* Navbar */}
      <header className="navbar fixed-header">
        <div className="logo" onClick={() => setActivePage('home')}>
          {lang === 'hi' ? 'अभिनव ट्रेडर्स & ज्वेलरी' : 'Abhinav Traders & Jewelry'}
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={menuOpen ? 'nav active' : 'nav'}>
          <a href="#home" onClick={() => { setActivePage('home'); setMenuOpen(false); }}>{lang === 'hi' ? 'होम' : 'Home'}</a>
          <a href="#abhinav-jewelry" onClick={() => { setActivePage('jewelry_page'); setSearchQuery(''); setMenuOpen(false); }}>Jewelry</a>
          <a href="#battery-section" onClick={() => { setActivePage('battery_page'); setSearchQuery(''); setMenuOpen(false); }}>Battery</a>
          <a href="#services" onClick={() => { setActivePage('services_page'); setMenuOpen(false); }}>Services</a>
          <a href="#contact" onClick={() => { setActivePage('contact_page'); setMenuOpen(false); }}>{lang === 'hi' ? 'संपर्क' : 'Contact'}</a>
        </nav>
      </header>

      {/* Main Content Container */}
      <div className="main-content-container">

        {/* JEWELRY DEDICATED PAGE */}
        {activePage === 'jewelry_page' && (
          <div className="dedicated-page fade-in">
            <div className="page-header-bar">
              <h2>💎 {lang === 'hi' ? 'अभिनव ज्वेलरी कैटलॉग' : 'Abhinav Jewelry Catalog'}</h2>
              <button className="back-home-btn" onClick={() => setActivePage('home')}>
                ← {lang === 'hi' ? 'होम पेज' : 'Back to Home'}
              </button>
            </div>
            
            <div className="search-container">
              <input 
                type="text" 
                placeholder={lang === 'hi' ? 'ज्वेलरी सर्च करें...' : 'Search jewelry...'} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="grid full-grid">
              {filteredJewelry.length > 0 ? (
                filteredJewelry.map((item) => (
                  <div className="ecommerce-card animated-card" key={item.id}>
                    <div className="card-img-wrap"><img src={item.img} alt={item.name} /></div>
                    <div className="card-details">
                      <h3>{item.name}</h3>
                      <p className="desc">{item.desc}</p>
                      <div className="price-row"><span className="price">{item.price}</span></div>
                      <button className="buy-btn" onClick={() => openOrderModal(item)}>
                        🛒 {lang === 'hi' ? 'आर्डर करें' : 'Order Now'}
                      </button>
                      {isAdmin && (
                        <button className="delete-btn" onClick={() => confirmDeleteJewelry(item.id)}>
                          🗑️ {lang === 'hi' ? 'डिलीट' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-result">{lang === 'hi' ? 'कोई उत्पाद नहीं मिला!' : 'No products found!'}</p>
              )}
            </div>
          </div>
        )}

        {/* BATTERY DEDICATED PAGE */}
        {activePage === 'battery_page' && (
          <div className="dedicated-page fade-in">
            <div className="page-header-bar">
              <h2>⚡ {lang === 'hi' ? 'ल्यूमिनस बैटरी कैटलॉग' : 'Luminous Battery Catalog'}</h2>
              <button className="back-home-btn" onClick={() => setActivePage('home')}>
                ← {lang === 'hi' ? 'होम पेज' : 'Back to Home'}
              </button>
            </div>
            
            <div className="search-container">
              <input 
                type="text" 
                placeholder={lang === 'hi' ? 'बैटरी सर्च करें...' : 'Search battery...'} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="grid full-grid">
              {filteredBattery.length > 0 ? (
                filteredBattery.map((item) => (
                  <div className="ecommerce-card animated-card" key={item.id}>
                    <div className="card-img-wrap"><img src={item.img} alt={item.name} /></div>
                    <div className="card-details">
                      <h3>{item.name}</h3>
                      <p className="desc">{item.desc}</p>
                      <div className="price-row"><span className="price">{item.price}</span></div>
                      <button className="buy-btn battery-buy" onClick={() => openOrderModal(item)}>
                        🛒 {lang === 'hi' ? 'आर्डर करें' : 'Order Now'}
                      </button>
                      {isAdmin && (
                        <button className="delete-btn" onClick={() => confirmDeleteBattery(item.id)}>
                          🗑️ {lang === 'hi' ? 'डिलीट' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-result">{lang === 'hi' ? 'कोई उत्पाद नहीं मिला!' : 'No products found!'}</p>
              )}
            </div>
          </div>
        )}

        {/* SERVICES DEDICATED PAGE */}
        {activePage === 'services_page' && (
          <div className="dedicated-page fade-in">
            <div className="page-header-bar">
              <h2>🏦 {lang === 'hi' ? 'फिनो बैंक, सोलर एवं LIC सेवाएं' : 'Fino Bank, Solar & LIC Services'}</h2>
              <button className="back-home-btn" onClick={() => setActivePage('home')}>
                ← {lang === 'hi' ? 'होम पेज' : 'Back to Home'}
              </button>
            </div>
            <div className="grid full-grid" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <div className="vip-card wave-service-card" style={{ maxWidth: '350px' }}>
                <h3>☀️ Solar & Sewing Machine</h3>
                <p>Sales & Repairing services available.</p>
              </div>
              <div className="vip-card wave-service-card" style={{ maxWidth: '350px' }}>
                <h3>💳 Fino Bank & Aadhaar ATM</h3>
                <p>Cash withdrawal/deposit & A/C Opening.</p>
              </div>
              <div className="vip-card wave-service-card" style={{ maxWidth: '350px' }}>
                <h3>⭐ LIC Agency (Code: 030342011)</h3>
                <p>Contact for all policy information.</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT DEDICATED PAGE */}
        {activePage === 'contact_page' && (
          <div className="dedicated-page fade-in">
            <div className="page-header-bar">
              <h2>📞 {lang === 'hi' ? 'संपर्क एवं लोकेशन' : 'Contact Us & Location'}</h2>
              <button className="back-home-btn" onClick={() => setActivePage('home')}>
                ← {lang === 'hi' ? 'होम पेज' : 'Back to Home'}
              </button>
            </div>
            <div className="contact-sec" style={{ margin: '20px auto', maxWidth: '800px' }}>
              <div className="contact-box">
                <div className="contact-info">
                  <h3>🏢 Abhinav Traders & Jewelry</h3>
                  <p><strong>📍 Address:</strong> Gurwalia, Mathia, Uttar Pradesh 274401</p>
                  <p><strong>📞 Mobile:</strong> <a href="tel:9838558286" className="clean-link">+91 9838558286</a></p>
                  <p><strong>🕒 Timing:</strong> 8:00 AM - 9:00 PM</p>
                </div>
                <div className="map-frame">
                  <iframe 
                    title="Store Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.1!2d83.889!3d26.741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjYuNzQxLDgzLjg4OQ!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOME PAGE */}
        {activePage === 'home' && (
          <>
            {/* Larger Full-Screen Split Hero Banner */}
            <section className="hero-split fade-in">
              <div className="hero-half zoom-banner-container jewelry-bg" onClick={() => setActivePage('jewelry_page')}>
                <div className="zoom-overlay-content">
                  <h2>{lang === 'hi' ? 'अभिनव ज्वेलरी' : 'Abhinav Jewelry'}</h2>
                  <p>Tanishq Inspired Collections</p>
                </div>
              </div>

              <div className="hero-half zoom-banner-container battery-bg" onClick={() => setActivePage('battery_page')}>
                <div className="zoom-overlay-content">
                  <h2>{lang === 'hi' ? 'ल्यूमिनस बैटरी एवं सोलर' : 'Luminous Battery & Solar'}</h2>
                  <p>Powerful Energy Solutions</p>
                </div>
              </div>
            </section>

            {/* Jewelry Slider Section */}
            <section id="abhinav-jewelry" className="section slide-up">
              <div className="sec-title-flex">
                <div>
                  <h2>💎 {typedJewelry}<span className="cursor">|</span></h2>
                  <p>{lang === 'hi' ? 'अम्बिका शर्मा प्रस्तुत - शुद्धता और विश्वास' : 'Symbol of Purity & Trust'}</p>
                </div>
                <button className="view-all-btn" onClick={() => setActivePage('jewelry_page')}>
                  {lang === 'hi' ? 'सभी देखें (सर्च करें) →' : 'View All & Search →'}
                </button>
              </div>
              
              <div className="slider-wrapper">
                <button className="slider-arrow left" onClick={() => scrollHorizontally(jewelryRef, 'left')}>‹</button>
                <div className="horizontal-slider" ref={jewelryRef}>
                  {jewelryList.map((item) => (
                    <div className="ecommerce-card animated-card" key={item.id}>
                      <div className="card-img-wrap"><img src={item.img} alt={item.name} /></div>
                      <div className="card-details">
                        <h3>{item.name}</h3>
                        <p className="desc">{item.desc}</p>
                        <div className="price-row"><span className="price">{item.price}</span></div>
                        <button className="buy-btn" onClick={() => openOrderModal(item)}>
                          🛒 {lang === 'hi' ? 'आर्डर करें' : 'Order Now'}
                        </button>
                        {isAdmin && (
                          <button className="delete-btn" onClick={() => confirmDeleteJewelry(item.id)}>
                            🗑️ {lang === 'hi' ? 'डिलीट' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="slider-arrow right" onClick={() => scrollHorizontally(jewelryRef, 'right')}>›</button>
              </div>
            </section>

            {/* Battery Slider Section */}
            <section id="battery-section" className="section alt-bg slide-up">
              <div className="sec-title-flex">
                <div>
                  <h2>⚡ {typedBattery}<span className="cursor">|</span></h2>
                  <p>{lang === 'hi' ? 'आधुनिक कैटलॉग और बेहतरीन बैटरी' : 'Modern Catalog & Power Solutions'}</p>
                </div>
                <button className="view-all-btn" onClick={() => setActivePage('battery_page')}>
                  {lang === 'hi' ? 'सभी देखें (सर्च करें) →' : 'View All & Search →'}
                </button>
              </div>
              
              <div className="slider-wrapper">
                <button className="slider-arrow left" onClick={() => scrollHorizontally(batteryRef, 'left')}>‹</button>
                <div className="horizontal-slider" ref={batteryRef}>
                  {batteryList.map((item) => (
                    <div className="ecommerce-card animated-card" key={item.id}>
                      <div className="card-img-wrap"><img src={item.img} alt={item.name} /></div>
                      <div className="card-details">
                        <h3>{item.name}</h3>
                        <p className="desc">{item.desc}</p>
                        <div className="price-row"><span className="price">{item.price}</span></div>
                        <button className="buy-btn battery-buy" onClick={() => openOrderModal(item)}>
                          🛒 {lang === 'hi' ? 'आर्डर करें' : 'Order Now'}
                        </button>
                        {isAdmin && (
                          <button className="delete-btn" onClick={() => confirmDeleteBattery(item.id)}>
                            🗑️ {lang === 'hi' ? 'डिलीट' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="slider-arrow right" onClick={() => scrollHorizontally(batteryRef, 'right')}>›</button>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="section slide-up">
              <div className="sec-title">
                <h2>{typedServices}<span className="cursor">|</span></h2>
              </div>
              <div className="grid">
                <div className="vip-card wave-service-card">
                  <h3>☀️ Solar & Sewing Machine</h3>
                  <p>Sales & Repairing services available.</p>
                </div>
                <div className="vip-card wave-service-card">
                  <h3>💳 Fino Bank & Aadhaar ATM</h3>
                  <p>Cash withdrawal/deposit & A/C Opening.</p>
                </div>
                <div className="vip-card wave-service-card">
                  <h3>⭐ LIC Agency (Code: 030342011)</h3>
                  <p>Contact for all policy information.</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section contact-sec slide-up">
              <div className="sec-title">
                <h2>📞 {lang === 'hi' ? 'लोकेशन' : 'Contact Us & Location'}</h2>
              </div>
              <div className="contact-box">
                <div className="contact-info">
                  <h3>🏢 Abhinav Traders & Jewelry</h3>
                  <p><strong>📍 Address:</strong> Gurwalia, Mathia, Uttar Pradesh 274401</p>
                  <p><strong>📞 Mobile:</strong> <a href="tel:9838558286" className="clean-link">+91 9838558286</a></p>
                  <p><strong>🕒 Timing:</strong> 8:00 AM - 9:00 PM</p>
                </div>
                <div className="map-frame">
                  <iframe 
                    title="Store Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.1!2d83.889!3d26.741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjYuNzQxLDgzLjg4OQ!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Floating WhatsApp Button (Left Bottom) */}
        <a href={`https://wa.me/${shopPhone}?text=Hello, I want to inquire about your products.`} className="float-whatsapp pulse-anim" target="_blank" rel="noreferrer">
          💬 WhatsApp
        </a>

        {/* Floating Fixed Language Button (Stacked above WhatsApp on Left Bottom) */}
        <button className="float-lang-btn pulse-anim" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
          {lang === 'en' ? 'हिं' : 'En'}
        </button>

        {/* Floating Back to Top Button (Right Bottom) - Shows only when scrolled down */}
        {showScrollTop && (
          <button className="float-top-btn pulse-anim" onClick={scrollToTop} title="Back to Top">
            ⬆
          </button>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 Abhinav Traders & Jewelry | Gurwalia, Mathia, UP 274401 | Prop: अम्बिका शर्मा (<a href="tel:9838558286" className="clean-link">9838558286</a>)</p>
          <div className="footer-admin-area">
            <button className="footer-admin-btn" onClick={() => setShowAdminModal(true)}>
              🔐 {lang === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}
            </button>
          </div>
        </footer>

      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content zoom-in">
            <button className="close-modal" onClick={() => setShowOrderModal(false)}>✕</button>
            <h3>🛒 {lang === 'hi' ? 'आर्डर की जानकारी भरें' : 'Enter Order Details'}</h3>
            <p className="order-product-name"><strong>{selectedProduct?.name}</strong> - <span style={{color: '#b45309'}}>{selectedProduct?.price}</span></p>
            
            <form onSubmit={submitOrder} className="order-form">
              <input 
                type="text" 
                placeholder={lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'} 
                value={buyerName} 
                onChange={(e) => setBuyerName(e.target.value)} 
                required 
              />
              <input 
                type="tel" 
                placeholder={lang === 'hi' ? 'मोबाइल नंबर (Phone Number)' : 'Phone Number'} 
                value={buyerPhone} 
                onChange={(e) => setBuyerPhone(e.target.value)} 
                required 
              />
              <textarea 
                placeholder={lang === 'hi' ? 'पूरा पता (Full Address & Landmark)' : 'Full Address & Landmark'} 
                value={buyerAddress} 
                onChange={(e) => setBuyerAddress(e.target.value)} 
                rows="3" 
                required 
              />
              
              <label className="payment-label">
                {lang === 'hi' ? 'भुगतान का तरीका (Payment Method):' : 'Payment Method:'}
              </label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Online Payment">Online Payment (UPI / QR Code)</option>
              </select>

              <button type="submit" className="login-btn" style={{background: '#10b981', marginTop: '10px'}}>
                ✅ {lang === 'hi' ? 'व्हाट्सएप पर आर्डर भेजें' : 'Send Order on WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content zoom-in">
            <button className="close-modal" onClick={() => setShowAdminModal(false)}>✕</button>
            <h3>🔐 {lang === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}</h3>
            {!isAdmin ? (
              <form onSubmit={handleLogin} className="admin-form">
                <input 
                  type="password" 
                  placeholder={lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password'} 
                  value={pass} 
                  onChange={(e) => setPass(e.target.value)} 
                />
                <button type="submit" className="login-btn">{lang === 'hi' ? 'लॉगिन करें' : 'Login'}</button>
              </form>
            ) : (
              <div className="admin-dashboard">
                <p>🎉 <strong>{lang === 'hi' ? 'एडमिन सफल लॉगिन!' : 'Admin Logged In!'}</strong></p>
                <form onSubmit={handleAddProduct} className="add-product-form">
                  <input 
                    type="text" 
                    placeholder={lang === 'hi' ? 'उत्पाद का नाम' : 'Product Name'} 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                  />
                  <input 
                    type="text" 
                    placeholder={lang === 'hi' ? 'कीमत (जैसे: ₹5,000)' : 'Price (e.g. ₹5,000)'} 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                  />
                  <label className="file-label">
                    {lang === 'hi' ? '📁 गैलरी से फोटो चुनें:' : '📁 Choose Photo from Gallery:'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setNewImageFile(e.target.files[0])} 
                    />
                  </label>
                  <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                    <option value="jewelry">{lang === 'hi' ? 'ज्वेलरी में जोड़ें' : 'Add to Jewelry'}</option>
                    <option value="battery">{lang === 'hi' ? 'बैटरी में जोड़ें' : 'Add to Battery'}</option>
                  </select>
                  <button type="submit" className="add-btn">+ {lang === 'hi' ? 'नया प्रोडक्ट जोड़ें' : 'Add Product'}</button>
                </form>
                <button onClick={() => setIsAdmin(false)} className="logout-btn">{lang === 'hi' ? 'लॉग आउट' : 'Logout'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;