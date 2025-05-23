// 목포 커넥트 웹사이트 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 토글 기능
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 스무스 스크롤 기능
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 스크롤 애니메이션 - Intersection Observer로 요소가 보일 때 애니메이션 적용
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);

    // 관찰할 요소들 선택 (카드, 섹션 등)
    const animateElements = document.querySelectorAll('.bg-white:not(nav), .bg-gradient-to-br, .grid > div');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 통계 숫자 카운터 애니메이션
    const countNumbers = document.querySelectorAll('.text-3xl.font-bold:not(.text-mokpo-navy)');
    
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 100; // 100단계로 나누어 애니메이션
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // 숫자에 따라 다른 표시 방식 적용
            if (suffix === '%') {
                element.textContent = Math.floor(current) + '%';
            } else if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    }

    // 통계 섹션이 보일 때 카운터 애니메이션 시작
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsCards = entry.target.querySelectorAll('.text-3xl.font-bold:not(.text-mokpo-navy)');
                statsCards.forEach(card => {
                    const text = card.textContent;
                    if (text.includes('-')) {
                        animateCounter(card, 6238, '명');
                    } else if (text.includes('%')) {
                        const number = parseFloat(text);
                        animateCounter(card, number, '%');
                    } else if (text.includes('점')) {
                        const number = parseFloat(text);
                        animateCounter(card, number, '점');
                    } else if (text.includes('개')) {
                        const number = parseInt(text);
                        animateCounter(card, number, '개');
                    } else if (text.includes('건')) {
                        const number = parseInt(text.replace(/[^0-9]/g, ''));
                        animateCounter(card, number, '건');
                    } else if (text.includes('억원')) {
                        const number = parseInt(text);
                        animateCounter(card, number, '억원');
                    } else if (text.includes('명')) {
                        const number = parseInt(text);
                        animateCounter(card, number, '명');
                    }
                });
                statsObserver.unobserve(entry.target); // 한 번만 실행
            }
        });
    }, { threshold: 0.3 });

    // 통계 섹션들을 관찰
    const statsSections = document.querySelectorAll('.grid.md\\:grid-cols-2.lg\\:grid-cols-4, .bg-gradient-to-br.from-green-50');
    statsSections.forEach(section => {
        statsObserver.observe(section);
    });

    // 네비게이션 바 스크롤 효과
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 스크롤다운 시 네비게이션 바에 그림자 추가
        if (scrollTop > 100) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }

        lastScrollTop = scrollTop;
    });

    // 버튼 호버 효과 개선
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 카드 호버 효과
    const cards = document.querySelectorAll('.hover\\:shadow-xl');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 페이지 로드 시 히어로 섹션 애니메이션
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate-fade-in');
        }, 100);
    }

    // 토스트 알림 기능 (제안서 다운로드, 문의하기 버튼용)
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 px-6 py-3 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // 자동 제거
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 다운로드 버튼 클릭 이벤트
    const downloadButtons = document.querySelectorAll('button:contains("다운로드")');
    downloadButtons.forEach(button => {
        if (button.textContent.includes('다운로드')) {
            button.addEventListener('click', function() {
                showToast('제안서 다운로드가 곧 시작됩니다.', 'success');
                // 실제 다운로드 로직은 여기에 구현
            });
        }
    });

    // 문의하기 버튼 클릭 이벤트
    const contactButtons = document.querySelectorAll('button:contains("문의")');
    contactButtons.forEach(button => {
        if (button.textContent.includes('문의')) {
            button.addEventListener('click', function() {
                showToast('담당자에게 연결 중입니다. 잠시만 기다려주세요.', 'info');
                // 실제 문의 로직은 여기에 구현
            });
        }
    });

    // 더 나은 사용자 경험을 위한 로딩 인디케이터
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    });

    // 키보드 접근성 개선
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모바일 메뉴 닫기
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    // 반응형 텍스트 크기 조정
    function adjustTextSize() {
        const screenWidth = window.innerWidth;
        const headers = document.querySelectorAll('h1, h2, h3');
        
        headers.forEach(header => {
            if (screenWidth < 768) {
                header.style.fontSize = header.style.fontSize || 'inherit';
            }
        });
    }

    window.addEventListener('resize', adjustTextSize);
    adjustTextSize(); // 초기 실행

    // 순서대로 나타나는 애니메이션을 위한 지연 설정
    const delayedElements = document.querySelectorAll('.grid > div');
    delayedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });

    console.log('목포 커넥트 웹사이트가 성공적으로 로드되었습니다!');
});