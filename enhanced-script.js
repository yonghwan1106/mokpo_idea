// Enhanced Script for Mokpo Connect Platform
// 목포 커넥트 플랫폼을 위한 고도화된 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수들
    initializeAnimations();
    initializeCharts();
    initializeInteractiveElements();
    initializeProgramModals();
    initializeCounters();
});

// ========================================
// 1. 애니메이션 시스템
// ========================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1';
                
                // 카운터 애니메이션 트리거
                if (entry.target.hasAttribute('data-counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // 모든 섹션과 카드에 observer 적용
    document.querySelectorAll('section, .hover-lift').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// 숫자 카운터 애니메이션
function animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const current = parseInt(element.textContent) || 0;
    const increment = target / 50; // 50단계로 나누어 부드럽게
    
    if (current < target) {
        element.textContent = Math.ceil(current + increment);
        setTimeout(() => animateCounter(element), 20);
    } else {
        element.textContent = target;
    }
}

// ========================================
// 2. 차트 시스템
// ========================================

function initializeCharts() {
    // 트렌드 차트
    if (document.getElementById('trendChart')) {
        initializeTrendChart();
    }
    
    // 예산 차트 추가
    if (document.getElementById('budgetChart')) {
        initializeBudgetChart();
    }
    
    // 성과 예측 차트 추가
    if (document.getElementById('performanceChart')) {
        initializePerformanceChart();
    }
}

function initializeTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['경제정책', '생활정책', '사회정책', '지역발전', '목포특화'],
            datasets: [{
                label: '시민 관심도 (점)',
                data: [75.87, 71.83, 67.41, 63.41, 58.95],
                borderColor: '#2563eb',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '점';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 예산 도넛 차트
function initializeBudgetChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['국비 (50%)', '시비 (30%)', '민간투자 (20%)'],
            datasets: [{
                data: [7.5, 4.5, 3],
                backgroundColor: [
                    '#2563eb',
                    '#0891b2',
                    '#ea580c'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '억원';
                        }
                    }
                }
            }
        }
    });
}

// 성과 예측 라인 차트
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1년차', '2년차', '3년차'],
            datasets: [{
                label: '크리에이터 수',
                data: [100, 300, 500],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                yAxisID: 'y'
            }, {
                label: '연간 예약 건수',
                data: [10000, 50000, 100000],
                borderColor: '#0891b2',
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '사업 연차'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '크리에이터 수 (명)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '예약 건수 (건)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// ========================================
// 3. 인터랙티브 요소들
// ========================================

function initializeInteractiveElements() {
    // 모바일 메뉴 토글
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // 햄버거 아이콘 애니메이션
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // 프로그램 필터 시스템
    initializeProgramFilter();
    
    // 모든 hover 카드에 3D 효과 추가
    addCard3DEffects();
    
    // 스크롤 인디케이터
    addScrollIndicator();
    
    // 페이지 로딩 효과
    addPageLoadingEffect();
}

// 프로그램 필터 시스템
function initializeProgramFilter() {
    const filterButtons = document.querySelectorAll('.program-filter');
    const programCards = document.querySelectorAll('.program-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼 상태 변경
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-mokpo-blue', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            this.classList.add('active', 'bg-mokpo-blue', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');

            // 카드 필터링 with animation
            const category = this.dataset.category;
            programCards.forEach((card, index) => {
                setTimeout(() => {
                    if (category === 'all' || card.dataset.category.includes(category)) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            card.style.transition = 'all 0.3s ease';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }, index * 50); // 순차적 애니메이션
            });
        });
    });
}

// 카드 3D 효과
function addCard3DEffects() {
    document.querySelectorAll('.hover-lift').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
        
        // 마우스 움직임에 따른 미묘한 기울기 효과
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * 5;
            const rotateY = (x - centerX) / centerX * 5;
            
            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// 스크롤 인디케이터
function addScrollIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 w-full h-1 bg-mokpo-blue z-50 origin-left transform scale-x-0 transition-transform duration-300';
    document.body.prepend(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height);
        progressBar.style.transform = `scaleX(${scrolled})`;
    });
}

// 페이지 로딩 효과
function addPageLoadingEffect() {
    // 페이지 로드 완료 후 순차적인 요소 표시
    window.addEventListener('load', () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-load');
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('opacity-100', 'translate-y-0');
                element.classList.remove('opacity-0', 'translate-y-4');
            }, index * 100);
        });
    });
}

// ========================================
// 4. 프로그램 모달 시스템
// ========================================

function initializeProgramModals() {
    // 모달 구조 생성
    createModalStructure();
    
    // 각 프로그램별 상세 정보 정의
    const programDetails = {
        nineFlavors: {
            title: "목포 9미(九味) 체험",
            subtitle: "목포 대표 음식 9가지를 직접 만들고 맛보는 종합 체험",
            rating: 4.8,
            duration: "3-4시간",
            participants: "4-8명",
            price: "8만원/인",
            images: ["/api/placeholder/600/400"],
            description: "목포의 오랜 역사와 함께해온 대표 음식들을 직접 만들어보고 그 맛과 이야기를 체험하는 프로그램입니다. 세발낙지부터 홍어삼합까지, 각 음식의 유래와 조리법을 배우며 목포의 미식 문화를 깊이 있게 이해할 수 있습니다.",
            highlights: [
                "세발낙지 잡기부터 요리까지 전 과정 체험",
                "홍어삼합의 역사와 함께하는 스토리텔링",
                "목포 전통 과자 만들기 워크숍",
                "민어회 경매 참관 및 회 뜨기 실습",
                "목포 포차 문화 체험"
            ],
            schedule: [
                { time: "14:00-14:30", activity: "목포 수산시장 투어 및 재료 선별" },
                { time: "14:30-15:30", activity: "세발낙지 잡기 체험 및 요리 실습" },
                { time: "15:30-16:30", activity: "홍어삼합 역사 학습 및 맛보기" },
                { time: "16:30-17:30", activity: "전통 과자 만들기 워크숍" },
                { time: "17:30-18:00", activity: "최종 시식 및 소감 나누기" }
            ],
            creator: {
                name: "김창업",
                age: 27,
                experience: "요리 경력 5년, 목포 토박이",
                story: "어릴 때부터 할머니의 요리를 보며 자란 김창업 씨. 목포의 맛을 더 많은 사람들과 나누고 싶어 이 프로그램을 기획했습니다."
            },
            reviews: [
                { name: "박여행***", rating: 5, comment: "정말 특별한 경험이었어요! 음식도 맛있고 스토리도 재미있었습니다." },
                { name: "이관광***", rating: 4, comment: "세발낙지를 직접 잡아보는 건 처음이었는데 신기했어요." },
                { name: "최맛집***", rating: 5, comment: "홍어삼합의 역사를 배우니 더 맛있게 느껴졌습니다." }
            ],
            included: ["재료비", "조리도구 사용", "앞치마 제공", "레시피북", "기념품"],
            requirements: ["편한 복장", "앞치마(제공)", "메모장"],
            location: "목포 수산시장 인근 체험 센터"
        },
        vrHistory: {
            title: "VR 근대역사 몰입 체험",
            subtitle: "첨단 VR/AR 기술로 1900년대 목포로 시간여행하는 특별한 프로그램",
            rating: 4.7,
            duration: "2시간",
            participants: "2-6명",
            price: "5만원/인",
            images: ["/api/placeholder/600/400"],
            description: "최신 VR/AR 기술을 활용하여 100년 전 목포로 떠나는 시간여행. 일제강점기 목포의 모습을 생생하게 체험하고, 그 시대를 살았던 사람들의 이야기를 직접 만나볼 수 있습니다.",
            highlights: [
                "1900년대 목포항 VR 재현",
                "일제강점기 저항운동가와의 가상 대화",
                "근대 건축물 건설 과정 시뮬레이션",
                "목포 출신 문인들의 작품 세계 체험",
                "AR로 복원된 옛 목포 거리 산책"
            ],
            schedule: [
                { time: "14:00-14:20", activity: "VR 장비 착용 및 기본 조작법 학습" },
                { time: "14:20-15:00", activity: "1900년대 목포항 가상 체험" },
                { time: "15:00-15:40", activity: "저항운동가 체험 및 역사 학습" },
                { time: "15:40-16:00", activity: "소감 공유 및 기념품 제작" }
            ],
            creator: {
                name: "이테크",
                age: 29,
                experience: "VR 개발 경력 4년, 역사 전공",
                story: "역사와 기술의 만남으로 새로운 교육 방법을 제시하고 싶었습니다."
            },
            reviews: [
                { name: "정신기***", rating: 5, comment: "정말 1900년대로 온 것 같았어요!" },
                { name: "김환상***", rating: 4, comment: "아이들도 재미있어 했습니다." }
            ],
            included: ["VR 장비 사용", "가이드 서비스", "기념품", "체험 인증서"],
            requirements: ["편한 복장", "멀미 없음", "만 12세 이상"],
            location: "목포 근대역사관 VR 체험센터"
        },
        seaAdventure: {
            title: "다도해 해양 모험",
            subtitle: "목포만의 특별한 지리적 위치를 활용한 섬 체험과 해양 활동",
            rating: 4.6,
            duration: "1일 / 반일",
            participants: "6-15명",
            price: "12만원/인",
            images: ["/api/placeholder/600/400"],
            description: "목포 앞바다에 펼쳐진 아름다운 섬들을 배경으로 한 해양 체험 프로그램. 무인도 탐험부터 전통 어업 체험까지, 바다와 하나되는 특별한 하루를 만들어갑니다.",
            highlights: [
                "무인도 서바이벌 체험",
                "어민과 함께하는 전통 어업",
                "연산도 섬마을 문화 체험",
                "목포대교 야경 크루즈",
                "바다 위 버스킹 공연"
            ],
            schedule: [
                { time: "09:00-10:00", activity: "목포항 출발 및 안전교육" },
                { time: "10:00-12:00", activity: "무인도 도착 및 서바이벌 체험" },
                { time: "12:00-13:00", activity: "바다에서 점심 식사" },
                { time: "13:00-15:00", activity: "어업 체험 및 해양 생물 관찰" },
                { time: "15:00-17:00", activity: "연산도 마을 탐방" },
                { time: "17:00-18:00", activity: "목포 야경 크루즈 및 귀항" }
            ],
            creator: {
                name: "박바다",
                age: 31,
                experience: "해양 경력 10년, 선박 운항 자격증",
                story: "목포의 아름다운 바다를 더 많은 사람들과 함께 나누고 싶어 시작했습니다."
            },
            reviews: [
                { name: "송바다***", rating: 5, comment: "정말 모험 같았어요! 평생 잊지 못할 경험" },
                { name: "한모험***", rating: 4, comment: "아이들이 무척 좋아했습니다." }
            ],
            included: ["선박비", "안전장비", "점심식사", "가이드", "보험"],
            requirements: ["수영 가능", "편한 복장", "선박 멀미 없음"],
            location: "목포항 여객터미널"
        },
        artCreation: {
            title: "목포 예술 창작 체험",
            subtitle: "지역 청년 예술가들과 함께하는 창작 활동으로 목포의 예술혼 체험",
            rating: 4.9,
            duration: "3-6시간",
            participants: "4-10명",
            price: "6만원/인",
            images: ["/api/placeholder/600/400"],
            description: "목포의 젊은 예술가들과 함께 다양한 창작 활동을 체험하는 프로그램. 벽화 그리기부터 도자기 만들기까지, 예술을 통해 목포의 정체성을 표현해봅니다.",
            highlights: [
                "시화마을 벽화 그리기 체험",
                "목포 출신 가수 노래 레슨",
                "전통 도자기 만들기 워크숍",
                "유달산 사생 대회",
                "개인 작품 갤러리 전시"
            ],
            schedule: [
                { time: "10:00-11:00", activity: "목포 예술가와의 만남 및 오리엔테이션" },
                { time: "11:00-13:00", activity: "선택 창작 활동 (벽화/음악/도자기)" },
                { time: "13:00-14:00", activity: "점심 및 휴식" },
                { time: "14:00-16:00", activity: "개인 작품 완성" },
                { time: "16:00-17:00", activity: "미니 전시회 및 감상" }
            ],
            creator: {
                name: "최예술",
                age: 26,
                experience: "미술 전공, 개인전 3회",
                story: "목포의 예술적 영감을 관광객들과 나누고 싶어 기획했습니다."
            },
            reviews: [
                { name: "김창작***", rating: 5, comment: "예술가가 된 기분이었어요!" },
                { name: "이미술***", rating: 5, comment: "작품을 집에 가져갈 수 있어서 좋았습니다." }
            ],
            included: ["재료비", "작품 포장", "갤러리 전시", "수료증"],
            requirements: ["편한 복장", "창작 의지"],
            location: "목포 청년 예술센터"
        },
        yudalHealing: {
            title: "유달산 자연 힐링",
            subtitle: "목포의 상징 유달산에서 자연과 하나되어 몸과 마음을 치유",
            rating: 4.8,
            duration: "반일/1일",
            participants: "3-12명",
            price: "7만원/인",
            images: ["/api/placeholder/600/400"],
            description: "복잡한 일상에서 벗어나 유달산의 자연 속에서 진정한 휴식을 찾는 프로그램. 요가, 명상, 자연 체험을 통해 몸과 마음의 균형을 회복합니다.",
            highlights: [
                "유달산 일출 요가 클래스",
                "자연 재료 채집 및 건강식 만들기",
                "명상 및 마인드풀니스 체험",
                "유달산 사생 및 자연 관찰",
                "개인 힐링 플랜 수립"
            ],
            schedule: [
                { time: "06:00-07:00", activity: "유달산 등반 및 일출 감상" },
                { time: "07:00-08:00", activity: "일출 요가 클래스" },
                { time: "08:00-09:00", activity: "건강한 아침 식사" },
                { time: "09:00-11:00", activity: "자연 채집 및 요리 체험" },
                { time: "11:00-12:00", activity: "명상 및 개인 시간" }
            ],
            creator: {
                name: "정힐링",
                age: 30,
                experience: "요가 강사 자격증, 산림치유사",
                story: "유달산의 치유 효과를 더 많은 사람들과 나누고 싶었습니다."
            },
            reviews: [
                { name: "안휴식***", rating: 5, comment: "정말 마음이 편안해졌어요" },
                { name: "박치유***", rating: 4, comment: "일출 요가가 특히 좋았습니다" }
            ],
            included: ["요가매트", "건강식 재료", "명상 가이드", "개인 플랜"],
            requirements: ["편한 운동복", "등산화", "물병"],
            location: "유달산 정상 인근"
        },
        storytelling: {
            title: "목포 스토리텔링 투어",
            subtitle: "청년 크리에이터들이 전하는 목포의 숨겨진 이야기와 특별한 순간들",
            rating: 4.5,
            duration: "2-3시간",
            participants: "4-12명",
            price: "4만원/인",
            images: ["/api/placeholder/600/400"],
            description: "목포의 구석구석에 숨겨진 이야기들을 재미있고 감동적으로 전달하는 스토리텔링 투어. 단순한 관광이 아닌, 목포의 진짜 모습을 발견하는 여행입니다.",
            highlights: [
                "목포 9경 숨겨진 이야기",
                "근대문화유산 스토리텔링",
                "목포 출신 인물 따라가기",
                "포토 스팟 가이드",
                "개인 맞춤형 여행 코스 제안"
            ],
            schedule: [
                { time: "14:00-14:30", activity: "만남의 장소에서 인사 및 코스 소개" },
                { time: "14:30-15:30", activity: "목포 9경 투어 및 사진 촬영" },
                { time: "15:30-16:30", activity: "근대문화유산지 스토리텔링" },
                { time: "16:30-17:00", activity: "개인 여행 코스 상담 및 마무리" }
            ],
            creator: {
                name: "김이야기",
                age: 25,
                experience: "관광 가이드 3년, 방송작가 경력",
                story: "목포의 재미있는 이야기들을 발굴하여 전하는 것이 취미입니다."
            },
            reviews: [
                { name: "이재미***", rating: 5, comment: "가이드북에 없는 이야기들이 흥미로웠어요" },
                { name: "박사진***", rating: 4, comment: "포토 스팟을 잘 알려주셔서 좋았습니다" }
            ],
            included: ["가이드 서비스", "포토 서비스", "기념품", "맞춤 코스 제안서"],
            requirements: ["편한 신발", "카메라", "호기심"],
            location: "목포역 광장 (집결지)"
        }
    };

    // 프로그램 카드 클릭 이벤트 리스너
    window.openProgramModal = function(programId) {
        const program = programDetails[programId];
        if (!program) return;

        updateModalContent(program);
        document.getElementById('programModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    // 모달 닫기 이벤트
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            closeModal();
        }
    });
}

function createModalStructure() {
    const modalHTML = `
        <div id="programModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 hidden">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-90vh overflow-y-auto animate-slide-up">
                <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 id="modalTitle" class="text-2xl font-bold text-mokpo-navy"></h2>
                    <button class="modal-close text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="p-6">
                    <div id="modalContent">
                        <!-- 동적 콘텐츠가 여기에 삽입 -->
                    </div>
                </div>
                
                <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-4">
                    <button class="flex-1 bg-mokpo-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-mokpo-navy transition-colors">
                        <i class="fas fa-calendar-check mr-2"></i>
                        예약하기
                    </button>
                    <button class="px-6 py-3 border border-mokpo-blue text-mokpo-blue rounded-lg font-semibold hover:bg-mokpo-blue hover:text-white transition-colors">
                        <i class="fas fa-heart mr-2"></i>
                        관심목록
                    </button>
                    <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        <i class="fas fa-share mr-2"></i>
                        공유하기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateModalContent(program) {
    document.getElementById('modalTitle').textContent = program.title;
    
    const content = `
        <div class="space-y-8">
            <!-- 기본 정보 섹션 -->
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <img src="${program.images[0]}" alt="${program.title}" class="w-full h-64 object-cover rounded-lg">
                </div>
                <div>
                    <p class="text-lg text-gray-600 mb-4">${program.subtitle}</p>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-500 mr-2"></i>
                            <span class="font-semibold">${program.rating}</span>
                            <span class="text-gray-500 ml-2">(128개 리뷰)</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock text-blue-500 mr-2"></i>
                            <span>${program.duration}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-users text-green-500 mr-2"></i>
                            <span>${program.participants}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-won-sign text-orange-500 mr-2"></i>
                            <span class="text-2xl font-bold text-mokpo-blue">${program.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 프로그램 소개 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">프로그램 소개</h3>
                <p class="text-gray-700 leading-relaxed">${program.description}</p>
            </div>

            <!-- 체험 하이라이트 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">체험 하이라이트</h3>
                <ul class="space-y-2">
                    ${program.highlights.map(item => `
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                            <span class="text-gray-700">${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- 상세 일정 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">상세 일정</h3>
                <div class="space-y-4">
                    ${program.schedule.map(item => `
                        <div class="flex items-start bg-gray-50 rounded-lg p-4">
                            <span class="bg-mokpo-blue text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                                ${item.time}
                            </span>
                            <span class="text-gray-700">${item.activity}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 크리에이터 소개 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">크리에이터 소개</h3>
                <div class="bg-blue-50 rounded-lg p-6">
                    <div class="flex items-start space-x-4">
                        <div class="w-16 h-16 bg-mokpo-blue rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg">${program.creator.name} (${program.creator.age}세)</h4>
                            <p class="text-gray-600 mb-2">${program.creator.experience}</p>
                            <p class="text-gray-700 italic">"${program.creator.story}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 포함 사항 -->
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-bold text-mokpo-navy mb-4">포함 사항</h3>
                    <ul class="space-y-2">
                        ${program.included.map(item => `
                            <li class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-gray-700">${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-mokpo-navy mb-4">준비 사항</h3>
                    <ul class="space-y-2">
                        ${program.requirements.map(item => `
                            <li class="flex items-center">
                                <i class="fas fa-info-circle text-blue-500 mr-3"></i>
                                <span class="text-gray-700">${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <!-- 리뷰 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">참여자 리뷰</h3>
                <div class="space-y-4">
                    ${program.reviews.map(review => `
                        <div class="border rounded-lg p-4">
                            <div class="flex items-center mb-2">
                                <span class="font-semibold">${review.name}</span>
                                <div class="flex text-yellow-500 ml-3">
                                    ${Array(review.rating).fill().map(() => '<i class="fas fa-star"></i>').join('')}
                                    ${Array(5-review.rating).fill().map(() => '<i class="far fa-star"></i>').join('')}
                                </div>
                            </div>
                            <p class="text-gray-700">${review.comment}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 위치 정보 -->
            <div>
                <h3 class="text-xl font-bold text-mokpo-navy mb-4">위치 정보</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="flex items-center text-gray-700">
                        <i class="fas fa-map-marker-alt text-red-500 mr-3"></i>
                        ${program.location}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalContent').innerHTML = content;
}

function closeModal() {
    document.getElementById('programModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ========================================
// 5. 숫자 카운터 초기화
// ========================================

function initializeCounters() {
    // 스크롤 시 카운터 애니메이션을 위한 데이터 속성 추가
    const counterElements = [
        { selector: '.crisis-stat-1', target: -6238 },
        { selector: '.crisis-stat-2', target: 60.2 },
        { selector: '.crisis-stat-3', target: 2.7 },
        { selector: '.crisis-stat-4', target: 15.6 },
        { selector: '.benefit-stat-1', target: 700 },
        { selector: '.benefit-stat-2', target: 275 },
        { selector: '.benefit-stat-3', target: 50 },
        { selector: '.benefit-stat-4', target: 50 }
    ];

    counterElements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.setAttribute('data-counter', item.target);
        }
    });
}

// ========================================
// 6. 유틸리티 함수들
// ========================================

// 부드러운 스크롤
window.scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// 솔루션 다이어그램 상세 정보 표시
window.showDetail = function(type) {
    const detailPanel = document.getElementById('detailPanel');
    const detailContent = document.getElementById('detailContent');
    
    const details = {
        youth: {
            title: '👨‍💼 청년 창업가',
            content: `
                <h4 class="text-xl font-bold mb-4">목포 거주 18-39세 청년</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold mb-2">혜택</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 체계적 교육 및 멘토링</li>
                            <li>• 창작 공간 제공</li>
                            <li>• 마케팅 지원</li>
                            <li>• 안정적 수익 창출</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-2">예상 수익</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 초기: 월 100-200만원</li>
                            <li>• 성장기: 월 300-500만원</li>
                            <li>• 안정기: 월 500만원+</li>
                        </ul>
                    </div>
                </div>
            `
        },
        tourist: {
            title: '✈️ 관광객',
            content: `
                <h4 class="text-xl font-bold mb-4">목포를 찾는 모든 관광객</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold mb-2">제공 서비스</h5>
                        <ul class="text-sm space-y-1">
                            <li>• AI 맞춤형 추천</li>
                            <li>• 원클릭 예약 시스템</li>
                            <li>• 실시간 가이드</li>
                            <li>• 소셜 미디어 연동</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-2">특별 혜택</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 목포페이 적립</li>
                            <li>• VIP 프로그램</li>
                            <li>• 재방문 할인</li>
                            <li>• 지역 할인 쿠폰</li>
                        </ul>
                    </div>
                </div>
            `
        },
        local: {
            title: '🏪 지역상인',
            content: `
                <h4 class="text-xl font-bold mb-4">목포시 소상공인 및 자영업자</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold mb-2">연계 방안</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 체험 프로그램 연계</li>
                            <li>• 패키지 상품 개발</li>
                            <li>• 공동 마케팅</li>
                            <li>• 할인 혜택 제공</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-2">기대 효과</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 매출 20-30% 증가</li>
                            <li>• 신규 고객 유입</li>
                            <li>• 브랜드 인지도 향상</li>
                            <li>• 경쟁력 강화</li>
                        </ul>
                    </div>
                </div>
            `
        },
        city: {
            title: '🏛️ 목포시',
            content: `
                <h4 class="text-xl font-bold mb-4">목포시 및 지역 기관</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold mb-2">정책 효과</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 청년층 정착률 향상</li>
                            <li>• 지역경제 활성화</li>
                            <li>• 도시 브랜드 강화</li>
                            <li>• 투자 유치 증대</li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-2">재정 효과</h5>
                        <ul class="text-sm space-y-1">
                            <li>• 세수 증대: 연 5억원</li>
                            <li>• 고용 창출: 700개</li>
                            <li>• 관광수입: 135억원</li>
                            <li>• ROI: 900% 이상</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };

    if (details[type]) {
        detailContent.innerHTML = details[type].content;
        detailPanel.classList.remove('hidden');
    }
};

// 이스터 에그 - 개발자 모드
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gradient-text')) {
        clickCount++;
        if (clickCount === 7) {
            console.log('🎉 목포 커넥트 개발자 모드 활성화! 🎉');
            console.log('이 웹사이트는 목포시의 밝은 미래를 위해 제작되었습니다.');
            document.body.style.animation = 'hue-rotate 10s infinite';
        }
    }
});

// 성능 최적화를 위한 Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// DOM 로드 완료 시 Lazy Loading 초기화
document.addEventListener('DOMContentLoaded', initializeLazyLoading);
