// 목포 커넥트 통합 최적화 스크립트
// 성능 향상 및 중복 제거 버전

class MokpoConnectApp {
    constructor() {
        this.isInitialized = false;
        this.components = new Map();
        this.init();
    }

    // 메인 초기화 함수
    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
        
        this.isInitialized = true;
    }

    // 앱 초기화
    initializeApp() {
        this.setupPerformanceOptimizations();
        this.initComponents();
        this.setupEventListeners();
        this.hideLoader();
    }

    // 성능 최적화 설정
    setupPerformanceOptimizations() {
        // 이미지 레이지 로딩
        this.initLazyLoading();
        
        // 중요 이미지 프리로드
        this.preloadCriticalImages();
        
        // 폰트 최적화
        this.optimizeFonts();
    }

    // 컴포넌트 초기화
    initComponents() {
        this.components.set('mobileMenu', new MobileMenuComponent());
        this.components.set('heroSlider', new HeroSliderComponent());
        this.components.set('navbar', new NavbarComponent());
        this.components.set('counters', new CounterComponent());
        this.components.set('smoothScroll', new SmoothScrollComponent());
        this.components.set('animations', new AnimationComponent());
        this.components.set('toasts', new ToastComponent());
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 스크롤 이벤트 (throttled)
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // 리사이즈 이벤트 (debounced)
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // 키보드 이벤트
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // 클릭 이벤트 델리게이션
        document.addEventListener('click', this.handleClick.bind(this));
    }

    // 이미지 레이지 로딩
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    }
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.classList.add('bg-loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // 레이지 로딩 대상 요소들
        document.querySelectorAll('img[data-src], [data-bg]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 중요 이미지 프리로드
    preloadCriticalImages() {
        const criticalImages = [
            'img/mokpo-bridge-just-a-half.jpg',
            'img/yudalsan-mountain-sunset-view-mokpo-city-over-located-south-korea-taken-right-monsoon-season-192935012.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // 폰트 최적화
    optimizeFonts() {
        // Font Display Swap 추가
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            link.href += '&display=swap';
        });
    }

    // 스크롤 핸들러
    handleScroll() {
        this.components.get('navbar')?.handleScroll();
        this.components.get('animations')?.handleScroll();
    }

    // 리사이즈 핸들러
    handleResize() {
        this.components.get('heroSlider')?.handleResize();
    }

    // 키보드 핸들러
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.components.get('mobileMenu')?.close();
        }
    }

    // 클릭 핸들러 (이벤트 델리게이션)
    handleClick(e) {
        const target = e.target.closest('[data-action]');
        if (target) {
            const action = target.dataset.action;
            this.handleAction(action, target, e);
        }
    }

    // 액션 핸들러
    handleAction(action, element, event) {
        switch (action) {
            case 'download-pdf':
                this.handlePdfDownload(element);
                break;
            case 'contact':
                this.handleContact(element);
                break;
            case 'scroll-to':
                this.handleScrollTo(element);
                break;
        }
    }

    // PDF 다운로드 핸들러
    handlePdfDownload(element) {
        this.components.get('toasts')?.show('제안서 다운로드가 시작됩니다.', 'success');
        // 실제 다운로드 로직
        const link = document.createElement('a');
        link.href = 'mokpo_connect.pdf';
        link.download = '목포커넥트_제안서.pdf';
        link.click();
    }

    // 문의 핸들러
    handleContact(element) {
        this.components.get('toasts')?.show('담당자에게 연결 중입니다.', 'info');
    }

    // 스크롤 투 핸들러
    handleScrollTo(element) {
        const target = element.dataset.target;
        const targetElement = document.querySelector(target);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 로더 숨기기
    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }, 1000);
    }

    // 유틸리티: Throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 유틸리티: Debounce
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

// 모바일 메뉴 컴포넌트
class MobileMenuComponent {
    constructor() {
        this.menuButton = document.getElementById('mobile-menu-button');
        this.menu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (this.menuButton && this.menu) {
            this.menuButton.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.menu.classList.toggle('hidden');
    }

    close() {
        if (!this.menu.classList.contains('hidden')) {
            this.menu.classList.add('hidden');
        }
    }
}

// 히어로 슬라이더 컴포넌트
class HeroSliderComponent {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 0) {
            this.startAutoSlide();
            this.setupIndicators();
        }
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.currentSlide = index;
                this.showSlide(this.currentSlide);
            });
        });
    }

    handleResize() {
        // 리사이즈 시 슬라이더 재조정
        this.showSlide(this.currentSlide);
    }
}

// 네비게이션 바 컴포넌트
class NavbarComponent {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        if (this.navbar) {
            this.handleScroll();
        }
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('navbar-scrolled');
            this.updateNavbarColors('#1e3a8a', '#374151');
        } else {
            this.navbar.classList.remove('navbar-scrolled');
            this.updateNavbarColors('white', 'white');
        }
    }

    updateNavbarColors(titleColor, linkColor) {
        const title = this.navbar.querySelector('h1');
        const links = this.navbar.querySelectorAll('a:not(.text-gray-700)');
        
        if (title) title.style.color = titleColor;
        links.forEach(link => link.style.color = linkColor);
    }
}

// 카운터 컴포넌트
class CounterComponent {
    constructor() {
        this.counters = document.querySelectorAll('.stat-counter');
        this.init();
    }

    init() {
        if (this.counters.length > 0) {
            this.setupObserver();
        }
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            this.animateValue(counter, 0, target, 2000);
        });
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));
        stepTime = Math.max(stepTime, minTimer);
        
        const startTime = new Date().getTime();
        const endTime = startTime + duration;
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round(end - (remaining * range));
            
            element.textContent = value >= 1000 ? value.toLocaleString() : value;
            
            if (value === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
}

// 스무스 스크롤 컴포넌트
class SmoothScrollComponent {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// 애니메이션 컴포넌트
class AnimationComponent {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.bg-white:not(nav), .bg-gradient-to-br, .grid > div').forEach(el => {
            observer.observe(el);
        });
    }

    handleScroll() {
        // 스크롤 기반 애니메이션 처리
    }
}

// 토스트 컴포넌트
class ToastComponent {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-20 right-4 z-50 space-y-2';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const bgColor = {
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'warning': 'bg-yellow-500',
            'info': 'bg-blue-500'
        }[type] || 'bg-blue-500';

        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        toast.textContent = message;
        
        this.container.appendChild(toast);
        
        // 애니메이션
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        
        // 자동 제거
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (this.container.contains(toast)) {
                    this.container.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

// 글로벌 함수들
window.scrollToOverview = function() {
    const overview = document.getElementById('overview');
    if (overview) {
        overview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// 앱 초기화
const mokpoConnectApp = new MokpoConnectApp();
