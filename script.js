/**
 * 黑盒子（杭州）贸易有限公司官网
 * JavaScript 功能脚本
 */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================
    // 导航栏功能
    // ==================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // 滚动时导航栏效果
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // 添加滚动超过 50px 后的样式
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
    
    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // 点击导航链接后关闭菜单
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // ==================================
    // 平滑滚动
    // ==================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================================
    // 滚动动画
    // ==================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.about-card, .service-card, .advantage-item, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 动画进入状态的样式
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
    
    // ==================================
    // 数字计数动画
    // ==================================
    const counterElements = document.querySelectorAll('.advantage-number');
    
    const countUp = (element, target, suffix = '') => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };
        
        updateCounter();
    };
    
    // 数字动画观察器
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                if (num) {
                    countUp(el, num, suffix);
                }
                
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => counterObserver.observe(el));
    
    // ==================================
    // 表单处理
    // ==================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function() {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = currentLang === 'zh' ? '正在提交...' : 'Submitting...';
        }
    });
    
    // ==================================
    // 通知系统
    // ==================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 添加通知样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(99, 102, 241, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.4s ease;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // 关闭按钮
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // 自动关闭
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
    
    // ==================================
    // 光标效果（可选）
    // ==================================
    if (!window.matchMedia('(pointer: coarse)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // 悬停效果
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = 'rgba(34, 211, 238, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            });
        });
    }
    
    // ==================================
    // 背景粒子效果（Canvas）
    // ==================================
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.3;
    `;
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 绘制连接线
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // 只在非触摸设备上启用粒子效果
    if (!window.matchMedia('(pointer: coarse)').matches) {
        animateParticles();
    }
    
    // ==================================
    // 性能优化：页面可见性控制动画
    // ==================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时可以暂停一些动画以节省资源
            console.log('页面已隐藏，动画暂停');
        }
    });
    
    // ==================================
    // 预加载字体优化
    // ==================================
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    }
    
    console.log('🎉 黑盒子（杭州）贸易有限公司官网已加载完成！');
});

// ==================================
// 工具函数
// ==================================

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, throttle };
}
// 多语言切换
const i18n = {
  'zh': {
    'meta.title': '黑盒子（杭州）贸易有限公司 | 咖啡与餐饮设备贸易服务',
    'meta.description': '黑盒子（杭州）贸易有限公司专注咖啡机、咖啡豆及商用餐饮设备贸易服务，提供采购、供应链、质检、出口与物流协同支持。',
    'brand.full': '黑盒子（杭州）贸易有限公司',
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '业务范围',
    'nav.contact': '联系我们',
    'hero.badge': '咖啡产品 · 餐饮设备 · 国际贸易',
    'hero.title.line1': '咖啡与餐饮设备',
    'hero.title.line2': '贸易服务伙伴',
    'hero.subtitle': '聚焦咖啡机、咖啡豆及商用餐饮设备贸易，协助客户完成采购寻源、供应链沟通、质量跟进、出口文件与物流衔接。',
    'hero.cta': '立即咨询',
    'hero.secondary': '查看业务范围',
    'hero.point1': '咖啡机 / 咖啡豆 / 商用餐饮设备',
    'hero.point2': '采购、质检、出口、物流节点协同',
    'hero.point3': '适合品牌方、经销商与海外采购商',
    'hero.card.title': '从选品到交付的贸易协同',
    'hero.card.desc': '让需求、品质和交期更清楚',
    'about.tag': '关于我们',
    'about.title': '重点清晰，合作更高效',
    'about.desc': '围绕咖啡产品与商用餐饮设备，提供从需求确认到出口交付的贸易支持',
    'about.card1.title': '品类聚焦',
    'about.card1.desc': '聚焦咖啡机、咖啡豆与商用餐饮设备，减少泛贸易沟通成本',
    'about.card2.title': '节点清楚',
    'about.card2.desc': '从报价、样品、生产、质检到出货，关键进度及时同步',
    'about.card3.title': '质量跟进',
    'about.card3.desc': '关注产品品质、包装要求、出口资料与交付风险',
    'services.tag': '业务范围',
    'services.title': '客户最关心的事，放在前面',
    'services.desc': '明确产品、供应商、质量、文件和物流，让客户更快判断是否适合合作',
    'service1.title': '咖啡与设备采购',
    'service1.desc': '覆盖咖啡机、咖啡豆及餐饮设备的寻源、报价、样品和订单沟通',
    'service1.item1': '咖啡机',
    'service1.item2': '咖啡豆',
    'service1.item3': '餐饮设备',
    'service2.title': '供应链跟进',
    'service2.desc': '协助确认供应商、生产周期、包装标准和出货准备',
    'service2.item1': '供应商沟通',
    'service2.item2': '样品确认',
    'service2.item3': '订单进度',
    'service3.title': '出口交付协同',
    'service3.desc': '支持质量检查、出口资料、物流节点和目的地交付沟通',
    'service3.item1': '质量跟进',
    'service3.item2': '出口文件',
    'service3.item3': '物流衔接',
    'advantages.tag': '核心优势',
    'advantages.title': '为什么选择我们',
    'advantage1': '年行业经验',
    'advantage2': '合作国家地区',
    'advantage3': '成功案例',
    'advantage4': '客户满意度',
    'cta.title': '告诉我们您的采购需求',
    'cta.desc': '产品类型、数量、目标市场和交付时间越清楚，我们越能快速判断供应方案',
    'cta.button': '填写咨询表单',
    'contact.title': '联系我们',
    'contact.desc': '请留下您的采购需求，我们会根据产品类型、数量、目标市场和交付时间尽快反馈。',
    'contact.address.label': '地址',
    'contact.address.value': '浙江省杭州市西湖区',
    'contact.email.label': '邮箱',
    'contact.phone.label': '电话',
    'form.note.title': '建议填写',
    'form.note.desc': '产品类型、规格、数量、目标市场、预算范围、期望交付时间。提交后会直接发送到公司邮箱。',
    'contact.name': '您的姓名',
    'contact.email': '联系邮箱',
    'contact.company': '公司名称',
    'contact.message': '咨询内容',
    'contact.send': '提交采购需求',
    'placeholder.name': '请输入您的姓名',
    'placeholder.email': '请输入您的邮箱',
    'placeholder.company': '请输入公司名称',
    'placeholder.message': '例如：需要采购咖啡机、咖啡豆或商用餐饮设备，数量、目标市场、交付时间是...',
    'footer.brand': '黑盒子',
    'footer.company': '黑盒子（杭州）贸易有限公司',
    'footer.desc': '咖啡产品与餐饮设备贸易服务',
    'footer.quick': '快速链接',
    'footer.support': '服务支持',
    'footer.service1': '咖啡与设备采购',
    'footer.service2': '供应链跟进',
    'footer.service3': '出口交付协同',
    'footer.copyright': '© 2026 黑盒子（杭州）贸易有限公司 版权所有'
  },
  'en': {
    'meta.title': 'Blackbox (Hangzhou) Trading Co., Ltd. | Coffee & Commercial Equipment Trade Services',
    'meta.description': 'Blackbox (Hangzhou) Trading Co., Ltd. focuses on coffee machines, coffee beans, and commercial catering equipment trade, supporting sourcing, supply-chain coordination, quality follow-up, export documents, and logistics.',
    'brand.full': 'Blackbox (Hangzhou) Trading Co., Ltd.',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'hero.badge': 'Coffee Products · Catering Equipment · Global Trade',
    'hero.title.line1': 'Coffee & Catering Equipment',
    'hero.title.line2': 'Trade Service Partner',
    'hero.subtitle': 'Focused on coffee machines, coffee beans, and commercial catering equipment, we help clients coordinate sourcing, supplier communication, quality follow-up, export documents, and logistics.',
    'hero.cta': 'Start Inquiry',
    'hero.secondary': 'View Services',
    'hero.point1': 'Coffee machines / Coffee beans / Commercial catering equipment',
    'hero.point2': 'Sourcing, quality checks, export, and logistics coordination',
    'hero.point3': 'Built for brands, distributors, and overseas buyers',
    'hero.card.title': 'Trade coordination from selection to delivery',
    'hero.card.desc': 'Clearer requirements, quality, and delivery timelines',
    'about.tag': 'About Us',
    'about.title': 'Clear priorities, smoother cooperation',
    'about.desc': 'Around coffee products and commercial catering equipment, we support the full process from requirement confirmation to export delivery.',
    'about.card1.title': 'Focused Categories',
    'about.card1.desc': 'Focused on coffee machines, coffee beans, and commercial catering equipment to reduce generic trade communication costs.',
    'about.card2.title': 'Clear Milestones',
    'about.card2.desc': 'From quotation, samples, production, and quality checks to shipment, key progress is communicated clearly.',
    'about.card3.title': 'Quality Follow-up',
    'about.card3.desc': 'We pay attention to product quality, packaging requirements, export documents, and delivery risks.',
    'services.tag': 'Services',
    'services.title': 'Put buyer priorities first',
    'services.desc': 'Clarify products, suppliers, quality, documents, and logistics so clients can quickly assess fit.',
    'service1.title': 'Coffee & Equipment Sourcing',
    'service1.desc': 'Sourcing, quotations, samples, and order communication for coffee machines, coffee beans, and catering equipment.',
    'service1.item1': 'Coffee Machines',
    'service1.item2': 'Coffee Beans',
    'service1.item3': 'Catering Equipment',
    'service2.title': 'Supply Chain Follow-up',
    'service2.desc': 'Assist with supplier confirmation, production timelines, packaging standards, and shipment preparation.',
    'service2.item1': 'Supplier Communication',
    'service2.item2': 'Sample Confirmation',
    'service2.item3': 'Order Progress',
    'service3.title': 'Export Delivery Coordination',
    'service3.desc': 'Support quality checks, export documents, logistics milestones, and destination delivery communication.',
    'service3.item1': 'Quality Follow-up',
    'service3.item2': 'Export Documents',
    'service3.item3': 'Logistics Coordination',
    'advantages.tag': 'Advantages',
    'advantages.title': 'Why choose us',
    'advantage1': 'Years of Industry Experience',
    'advantage2': 'Countries & Regions',
    'advantage3': 'Successful Cases',
    'advantage4': 'Customer Satisfaction',
    'cta.title': 'Tell us what you need to source',
    'cta.desc': 'The clearer your product type, quantity, target market, and delivery timeline, the faster we can assess a sourcing plan.',
    'cta.button': 'Fill Inquiry Form',
    'contact.title': 'Contact Us',
    'contact.desc': 'Leave your sourcing request and we will respond based on product type, quantity, target market, and delivery timeline.',
    'contact.address.label': 'Address',
    'contact.address.value': 'Xihu District, Hangzhou, Zhejiang, China',
    'contact.email.label': 'Email',
    'contact.phone.label': 'Phone',
    'form.note.title': 'Suggested details',
    'form.note.desc': 'Product type, specifications, quantity, target market, budget range, and expected delivery time. The form will be sent directly to our company email.',
    'contact.name': 'Your Name',
    'contact.email': 'Email Address',
    'contact.company': 'Company Name',
    'contact.message': 'Inquiry Details',
    'contact.send': 'Submit Sourcing Request',
    'placeholder.name': 'Enter your name',
    'placeholder.email': 'Enter your email',
    'placeholder.company': 'Enter company name',
    'placeholder.message': 'Example: We need coffee machines, coffee beans, or commercial catering equipment. Quantity, target market, and delivery timeline are...',
    'footer.brand': 'Blackbox',
    'footer.company': 'Blackbox (Hangzhou) Trading Co., Ltd.',
    'footer.desc': 'Coffee products and catering equipment trade services',
    'footer.quick': 'Quick Links',
    'footer.support': 'Service Support',
    'footer.service1': 'Coffee & Equipment Sourcing',
    'footer.service2': 'Supply Chain Follow-up',
    'footer.service3': 'Export Delivery Coordination',
    'footer.copyright': '© 2026 Blackbox (Hangzhou) Trading Co., Ltd. All Rights Reserved'
  }
};

// 切换语言
let currentLang = localStorage.getItem('lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  if (i18n[lang]['meta.title']) {
    document.title = i18n[lang]['meta.title'];
  }
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && i18n[lang]['meta.description']) {
    metaDescription.setAttribute('content', i18n[lang]['meta.description']);
  }
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (i18n[lang][key]) {
      el.setAttribute('placeholder', i18n[lang][key]);
    }
  });
  
  document.getElementById('langSwitch').textContent = lang === 'zh' ? '中 / EN' : 'EN / 中';
}

// 绑定按钮
document.getElementById('langSwitch').addEventListener('click', () => {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
});

// 初始化语言
setLang(currentLang);
