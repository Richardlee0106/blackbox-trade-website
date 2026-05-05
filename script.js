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
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // 显示提交成功信息
        showNotification('感谢您的咨询，我们会尽快与您联系！', 'success');
        
        // 重置表单
        this.reset();
        
        // 这里可以添加实际的后端提交逻辑
        // fetch('/api/contact', { method: 'POST', body: formData })
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
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '业务范围',
    'nav.contact': '联系我们',
    'contact.title': '联系我们',
    'contact.desc': '期待与您的合作，共创贸易新未来',
    'contact.name': '您的姓名',
    'contact.email': '联系邮箱',
    'contact.company': '公司名称',
    'contact.message': '咨询内容',
    'contact.send': '发送咨询',
    'footer.about': '关于黑盒子',
    'footer.service': '客户服务',
    'footer.copyright': '© 2025 黑盒子（杭州）贸易有限公司 版权所有'
  },
  'en': {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.contact': 'Contact Us',
    'contact.title': 'Contact Us',
    'contact.desc': 'We look forward to cooperating with you to create a new future of trade.',
    'contact.name': 'Your Full Name',
    'contact.email': 'Email Address',
    'contact.company': 'Company Name',
    'contact.message': 'Message',
    'contact.send': 'Send Inquiry',
    'footer.about': 'About Blackbox',
    'footer.service': 'Support',
    'footer.copyright': '© 2025 Blackbox (Hangzhou) Trading Co., Ltd. All Rights Reserved'
  }
};

// 切换语言
let currentLang = localStorage.getItem('lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
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
