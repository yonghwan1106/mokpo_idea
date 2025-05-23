// 체험 프로그램 미리보기 모달 시스템
class ProgramModal {
    constructor() {
        this.currentProgram = null;
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.bindEvents();
        this.loadProgramData();
    }

    // 모달 HTML 구조 생성
    createModalHTML() {
        const modalHTML = `
            <!-- 체험 프로그램 미리보기 모달 -->
            <div id="program-modal" class="fixed inset-0 z-50 hidden bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300" style="z-index: 9999;">
                <div class="flex items-center justify-center min-h-screen p-4" style="z-index: 10000;">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative transition-all duration-300 ease-out" style="z-index: 10001;">
                        <!-- 모달 헤더 -->
                        <div class="relative h-64 bg-gradient-to-r from-mokpo-blue to-mokpo-cyan">
                            <button id="close-modal" class="absolute top-4 right-4 z-60 bg-white bg-opacity-20 hover:bg-opacity-30 hover:bg-red-500 rounded-full p-3 text-white transition-all duration-300 cursor-pointer" style="pointer-events: auto; z-index: 9999;">
                                <i class="fas fa-times text-xl pointer-events-none"></i>
                            </button>
                            <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                            <div id="modal-background" class="absolute inset-0 bg-cover bg-center transition-all duration-500"></div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div class="flex items-center space-x-2 mb-2">
                                    <span id="modal-category" class="px-3 py-1 bg-mokpo-yellow text-mokpo-navy rounded-full text-sm font-bold"></span>
                                    <span id="modal-duration" class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"></span>
                                </div>
                                <h2 id="modal-title" class="text-3xl font-bold mb-2"></h2>
                                <p id="modal-subtitle" class="text-lg opacity-90"></p>
                            </div>
                        </div>

                        <!-- 모달 바디 -->
                        <div class="p-6 max-h-96 overflow-y-auto">
                            <div class="grid md:grid-cols-2 gap-6">
                                <!-- 프로그램 상세 정보 -->
                                <div>
                                    <h3 class="text-xl font-bold text-mokpo-navy mb-3">
                                        <i class="fas fa-info-circle text-mokpo-blue mr-2"></i>
                                        프로그램 소개
                                    </h3>
                                    <p id="modal-description" class="text-gray-700 leading-relaxed mb-4"></p>
                                    
                                    <h4 class="font-bold text-mokpo-navy mb-2">
                                        <i class="fas fa-list-ul text-mokpo-cyan mr-2"></i>
                                        주요 활동
                                    </h4>
                                    <ul id="modal-activities" class="space-y-2 mb-4"></ul>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="bg-mokpo-blue bg-opacity-10 p-3 rounded-lg">
                                            <div class="flex items-center text-mokpo-blue mb-1">
                                                <i class="fas fa-users mr-2"></i>
                                                <span class="font-semibold">참여 인원</span>
                                            </div>
                                            <span id="modal-participants" class="text-lg font-bold"></span>
                                        </div>
                                        <div class="bg-mokpo-yellow bg-opacity-20 p-3 rounded-lg">
                                            <div class="flex items-center text-mokpo-orange mb-1">
                                                <i class="fas fa-won-sign mr-2"></i>
                                                <span class="font-semibold">참가비</span>
                                            </div>
                                            <span id="modal-price" class="text-lg font-bold"></span>
                                        </div>
                                    </div>
                                </div>

                                <!-- 예약 및 추가 정보 -->
                                <div>
                                    <h3 class="text-xl font-bold text-mokpo-navy mb-3">
                                        <i class="fas fa-calendar-check text-mokpo-blue mr-2"></i>
                                        예약 정보
                                    </h3>
                                    
                                    <div class="bg-gradient-to-r from-mokpo-blue to-mokpo-cyan text-white p-4 rounded-lg mb-4">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="font-semibold">다음 예약 가능 일정</span>
                                            <i class="fas fa-calendar-alt"></i>
                                        </div>
                                        <div id="modal-schedule" class="space-y-1"></div>
                                    </div>

                                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h4 class="font-bold text-mokpo-navy mb-2">
                                            <i class="fas fa-map-marker-alt text-mokpo-cyan mr-2"></i>
                                            만나는 장소
                                        </h4>
                                        <p id="modal-location" class="text-gray-700 mb-2"></p>
                                        <p id="modal-address" class="text-sm text-gray-600"></p>
                                    </div>

                                    <div class="space-y-2">
                                        <button id="book-now-btn" class="w-full bg-gradient-to-r from-mokpo-blue to-mokpo-cyan text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                                            <i class="fas fa-calendar-plus mr-2"></i>
                                            지금 예약하기
                                        </button>
                                        <button id="wishlist-btn" class="w-full border-2 border-mokpo-blue text-mokpo-blue py-3 rounded-lg font-bold hover:bg-mokpo-blue hover:text-white transition-all duration-300">
                                            <i class="fas fa-heart mr-2"></i>
                                            관심 목록에 추가
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- 크리에이터 정보 -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-xl font-bold text-mokpo-navy mb-3">
                                    <i class="fas fa-user-tie text-mokpo-blue mr-2"></i>
                                    크리에이터 소개
                                </h3>
                                <div class="flex items-center space-x-4">
                                    <img id="creator-avatar" src="" alt="" class="w-16 h-16 rounded-full border-3 border-mokpo-blue">
                                    <div>
                                        <h4 id="creator-name" class="font-bold text-lg text-mokpo-navy"></h4>
                                        <p id="creator-title" class="text-mokpo-blue font-semibold"></p>
                                        <p id="creator-experience" class="text-gray-600 text-sm"></p>
                                    </div>
                                    <div class="ml-auto">
                                        <div class="flex items-center space-x-1 text-mokpo-yellow">
                                            <i class="fas fa-star"></i>
                                            <span id="creator-rating" class="font-bold"></span>
                                            <span class="text-gray-500">(<span id="creator-reviews"></span>개 리뷰)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 리뷰 미리보기 -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-xl font-bold text-mokpo-navy mb-3">
                                    <i class="fas fa-comments text-mokpo-blue mr-2"></i>
                                    최근 후기
                                </h3>
                                <div id="modal-reviews" class="space-y-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 모달 HTML이 완전히 추가된 후 이벤트 바인딩
        setTimeout(() => {
            this.bindModalEvents();
        }, 100);
    }

    // 이벤트 바인딩
    bindEvents() {
        // ESC 키로 모달 닫기 (전역 이벤트)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) this.closeModal();
        });

        // 프로그램 카드 클릭 이벤트
        document.addEventListener('click', (e) => {
            const programCard = e.target.closest('[data-program-id]');
            if (programCard) {
                const programId = programCard.dataset.programId;
                this.openModal(programId);
            }
        });

        // 예약 버튼 클릭
        document.addEventListener('click', (e) => {
            if (e.target.id === 'book-now-btn' || e.target.closest('#book-now-btn')) {
                this.handleBooking();
            }
        });

        // 관심목록 버튼 클릭
        document.addEventListener('click', (e) => {
            if (e.target.id === 'wishlist-btn' || e.target.closest('#wishlist-btn')) {
                this.handleWishlist();
            }
        });
    }

    // 모달별 이벤트 바인딩 (모달 생성 후 호출)
    bindModalEvents() {
        console.log('모달 이벤트 바인딩 중...');
        
        // 방법 1: getElementById로 직접 바인딩
        const closeButton = document.getElementById('close-modal');
        if (closeButton) {
            console.log('✅ X 버튼 발견, 이벤트 바인딩 중...');
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('X 버튼 클릭됨!');
                this.closeModal();
            });
            
            // 호버 효과 확인용
            closeButton.addEventListener('mouseenter', () => {
                console.log('X 버튼에 마우스 올림');
                closeButton.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
            });
            
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
        } else {
            console.error('❌ X 버튼을 찾을 수 없습니다!');
        }

        // 방법 2: 이벤트 위임으로 추가 보안
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-modal' || e.target.closest('#close-modal')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('이벤트 위임으로 X 버튼 클릭 감지됨!');
                this.closeModal();
            }
        });

        // 모달 배경 클릭으로 닫기
        const modal = document.getElementById('program-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'program-modal') {
                    console.log('모달 배경 클릭됨!');
                    this.closeModal();
                }
            });
        }
    }

    // 프로그램 데이터 로드 (실제로는 API에서 가져옴)
    loadProgramData() {
        this.programs = {
            'mokpo-9mi': {
                title: '목포 9미(九味) 체험 투어',
                subtitle: '목포의 대표 음식 9가지를 직접 만들고 맛보는 특별한 경험',
                category: '음식 체험',
                duration: '4시간',
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("img/mokpo-food-experience.jpg")',
                description: '목포만의 특별한 맛을 자랑하는 9가지 음식을 현지 전문가와 함께 직접 만들어보고 맛보는 프로그램입니다. 세발낙지부터 홍어삼합까지, 목포의 진정한 맛을 경험해보세요.',
                activities: [
                    '세발낙지 잡기 체험 및 요리',
                    '홍어삼합 스토리텔링 & 맛집 투어',
                    '목포 전통 과자 만들기',
                    '민어회 경매 참관 및 회 뜨기 체험',
                    '유달산 자연 식재료 채집'
                ],
                participants: '4-8명',
                price: '35,000원',
                schedule: [
                    '2025년 5월 25일 (일) 14:00',
                    '2025년 5월 27일 (화) 10:00',
                    '2025년 5월 29일 (목) 14:00'
                ],
                location: '목포중앙시장 & 유달산 일대',
                address: '전남 목포시 중앙로2가 1-6',
                creator: {
                    name: '김미향',
                    title: '목포 전통요리 전문가',
                    experience: '25년 경력의 향토음식 연구가',
                    avatar: 'img/creator-kimmi.jpg',
                    rating: 4.9,
                    reviews: 127
                },
                reviews: [
                    {
                        author: '박지연',
                        rating: 5,
                        text: '정말 특별한 경험이었어요! 세발낙지를 직접 잡고 요리하는 게 신기했고, 김미향 선생님의 설명도 너무 재미있었습니다.',
                        date: '2025.05.15'
                    },
                    {
                        author: '이도현',
                        rating: 5,
                        text: '목포의 진짜 맛을 알게 되었어요. 특히 홍어삼합의 역사 이야기가 인상 깊었습니다.',
                        date: '2025.05.12'
                    }
                ]
            },
            'history-vr': {
                title: '목포 근대역사 몰입 체험',
                subtitle: 'AR/VR로 만나는 1900년대 목포항의 생생한 역사',
                category: '역사 체험',
                duration: '3시간',
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("img/mokpo-history-vr.jpg")',
                description: '최첨단 AR/VR 기술로 1900년대 목포항의 모습을 생생하게 체험하고, 일제강점기 저항 운동의 현장을 직접 경험해보는 특별한 역사 여행입니다.',
                activities: [
                    '1900년대 목포항 VR 시뮬레이션',
                    '일제강점기 저항운동 역할극',
                    '근대 건축물 건설과정 AR 체험',
                    '목포 출신 문인들과의 가상 대화',
                    '옛 목포역 복원 체험'
                ],
                participants: '6-12명',
                price: '25,000원',
                schedule: [
                    '2025년 5월 26일 (월) 15:00',
                    '2025년 5월 28일 (수) 10:00',
                    '2025년 5월 30일 (금) 15:00'
                ],
                location: '목포근대역사관 & 유달산 일대',
                address: '전남 목포시 영산로29번길 6',
                creator: {
                    name: '정한국',
                    title: 'VR 역사 콘텐츠 개발자',
                    experience: '목포대학교 사학과 출신, VR 개발 7년',
                    avatar: 'img/creator-junghan.jpg',
                    rating: 4.8,
                    reviews: 89
                },
                reviews: [
                    {
                        author: '최수빈',
                        rating: 5,
                        text: 'VR로 보는 옛 목포의 모습이 정말 신기했어요. 마치 타임머신을 탄 것 같았습니다!',
                        date: '2025.05.18'
                    },
                    {
                        author: '김태준',
                        rating: 4,
                        text: '역사 공부가 이렇게 재미있을 줄 몰랐어요. 아이들과 함께 와서 너무 좋았습니다.',
                        date: '2025.05.14'
                    }
                ]
            },
            'marine-adventure': {
                title: '다도해 해양 모험 프로그램',
                subtitle: '무인도 서바이벌과 전통 어업 체험의 특별한 만남',
                category: '해양 모험',
                duration: '6시간',
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("img/mokpo-marine-adventure.jpg")',
                description: '목포만의 아름다운 다도해에서 펼치어지는 해양 모험! 무인도에서의 서바이벌 체험과 목포 어민들과 함께하는 전통 어업 체험을 통해 바다의 참맛을 느껴보세요.',
                activities: [
                    '무인도 서바이벌 체험 (3시간)',
                    '목포 어민과 함께하는 어업 체험',
                    '연산도 섬마을 민박 체험',
                    '전통 그물 만들기 워크샵',
                    '목포대교 야경 크루즈'
                ],
                participants: '6-15명',
                price: '45,000원',
                schedule: [
                    '2025년 5월 24일 (토) 09:00',
                    '2025년 5월 31일 (토) 09:00',
                    '2025년 6월 7일 (토) 09:00'
                ],
                location: '목포신항 & 연산도 일대',
                address: '전남 목포시 해안로 249',
                creator: {
                    name: '장바다',
                    title: '해양 레저 전문가',
                    experience: '15년 경력의 선박 운항사 & 해양 가이드',
                    avatar: 'img/creator-jangbada.jpg',
                    rating: 4.7,
                    reviews: 203
                },
                reviews: [
                    {
                        author: '윤서진',
                        rating: 5,
                        text: '정말 잊을 수 없는 경험이었어요! 무인도에서의 서바이벌도 재미있었고, 어민 아저씨들이 너무 친절하셨어요.',
                        date: '2025.05.17'
                    },
                    {
                        author: '남현우',
                        rating: 4,
                        text: '바다에서의 하루가 이렇게 알찰 줄 몰랐어요. 특히 목포대교 야경이 환상적이었습니다.',
                        date: '2025.05.13'
                    }
                ]
            }
        };
    }

    // 모달 열기
    openModal(programId) {
        console.log(`🚀 모달 열기 시도: ${programId}`);
        
        const program = this.programs[programId];
        if (!program) {
            console.error(`❌ 프로그램을 찾을 수 없습니다: ${programId}`);
            return;
        }

        console.log(`✅ 프로그램 발견: ${program.title}`);

        this.currentProgram = program;
        this.isModalOpen = true;

        // 모달 내용 업데이트
        this.updateModalContent(program);

        // 모달 표시
        const modal = document.getElementById('program-modal');
        if (!modal) {
            console.error('❌ 모달 요소를 찾을 수 없습니다!');
            return;
        }
        
        const modalContent = modal.querySelector('.bg-white');
        
        console.log('✅ 모달 열기 애니메이션 시작...');
        
        modal.classList.remove('hidden');
        
        // 초기 상태 설정
        modal.style.opacity = '0';
        if (modalContent) {
            modalContent.style.transform = 'scale(0.9) translateY(-20px)';
            modalContent.style.opacity = '0';
        }
        
        // 애니메이션 시작
        setTimeout(() => {
            modal.style.opacity = '1';
            if (modalContent) {
                modalContent.style.transform = 'scale(1) translateY(0)';
                modalContent.style.opacity = '1';
            }
            console.log('✅ 모달이 완전히 열렸습니다!');
        }, 10);

        // 바디 스크롤 방지
        document.body.style.overflow = 'hidden';
    }

    // 모달 내용 업데이트
    updateModalContent(program) {
        // 헤더 정보
        document.getElementById('modal-background').style.background = program.background;
        document.getElementById('modal-category').textContent = program.category;
        document.getElementById('modal-duration').textContent = program.duration;
        document.getElementById('modal-title').textContent = program.title;
        document.getElementById('modal-subtitle').textContent = program.subtitle;

        // 상세 정보
        document.getElementById('modal-description').textContent = program.description;
        document.getElementById('modal-participants').textContent = program.participants;
        document.getElementById('modal-price').textContent = program.price;
        document.getElementById('modal-location').textContent = program.location;
        document.getElementById('modal-address').textContent = program.address;

        // 활동 목록
        const activitiesList = document.getElementById('modal-activities');
        activitiesList.innerHTML = program.activities.map(activity => 
            `<li class="flex items-center text-gray-700">
                <i class="fas fa-check-circle text-mokpo-cyan mr-2"></i>
                ${activity}
            </li>`
        ).join('');

        // 일정
        const scheduleList = document.getElementById('modal-schedule');
        scheduleList.innerHTML = program.schedule.map(date => 
            `<div class="text-sm">${date}</div>`
        ).join('');

        // 크리에이터 정보
        document.getElementById('creator-avatar').src = program.creator.avatar;
        document.getElementById('creator-name').textContent = program.creator.name;
        document.getElementById('creator-title').textContent = program.creator.title;
        document.getElementById('creator-experience').textContent = program.creator.experience;
        document.getElementById('creator-rating').textContent = program.creator.rating;
        document.getElementById('creator-reviews').textContent = program.creator.reviews;

        // 리뷰
        const reviewsList = document.getElementById('modal-reviews');
        reviewsList.innerHTML = program.reviews.map(review => 
            `<div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-mokpo-navy">${review.author}</span>
                    <div class="flex items-center space-x-1">
                        ${Array(review.rating).fill('<i class="fas fa-star text-mokpo-yellow text-sm"></i>').join('')}
                        <span class="text-gray-500 text-sm ml-2">${review.date}</span>
                    </div>
                </div>
                <p class="text-gray-700 text-sm">${review.text}</p>
            </div>`
        ).join('');
    }

    // 모달 닫기
    closeModal() {
        console.log('🔥 closeModal 함수 호출됨!');
        
        if (!this.isModalOpen) {
            console.log('⚠️ 모달이 이미 닫혀있습니다.');
            return;
        }
        
        const modal = document.getElementById('program-modal');
        if (!modal) {
            console.error('❌ 모달 요소를 찾을 수 없습니다!');
            return;
        }
        
        const modalContent = modal.querySelector('.bg-white');
        
        console.log('✅ 모달 닫기 애니메이션 시작...');
        
        // 닫기 애니메이션
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95) translateY(20px)';
            modalContent.style.opacity = '0.5';
        }
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            console.log('✅ 모달이 완전히 닫혔습니다.');
            
            // 원래 상태로 복원 (다음 열기를 위해)
            if (modalContent) {
                modalContent.style.transform = '';
                modalContent.style.opacity = '';
            }
            modal.style.opacity = '';
        }, 300);
        
        this.isModalOpen = false;
        this.currentProgram = null;
        
        // 바디 스크롤 복원
        document.body.style.overflow = '';
        
        console.log('✅ 모달 닫기 완료!');
    }

    // 예약 처리
    handleBooking() {
        if (!this.currentProgram) return;
        
        // 실제로는 예약 시스템과 연동
        alert(`"${this.currentProgram.title}" 예약 페이지로 이동합니다.`);
        
        // 간단한 예약 폼 모달을 추가로 만들 수도 있음
        this.showBookingForm();
    }

    // 관심목록 처리
    handleWishlist() {
        if (!this.currentProgram) return;
        
        const button = document.getElementById('wishlist-btn');
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('fas')) {
            // 관심목록에서 제거
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.innerHTML = '<i class="far fa-heart mr-2"></i>관심 목록에 추가';
            this.showNotification('관심 목록에서 제거되었습니다.', 'info');
        } else {
            // 관심목록에 추가
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.innerHTML = '<i class="fas fa-heart mr-2"></i>관심 목록에 추가됨';
            this.showNotification('관심 목록에 추가되었습니다!', 'success');
        }
    }

    // 예약 폼 표시
    showBookingForm() {
        // 간단한 예약 폼을 표시하는 로직
        console.log('예약 폼 표시');
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-60 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-mokpo-blue text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('체험 프로그램 모달 시스템 초기화 중...');
    
    try {
        window.programModal = new ProgramModal();
        console.log('✅ 프로그램 모달 시스템이 성공적으로 초기화되었습니다.');
    } catch (error) {
        console.error('❌ 프로그램 모달 시스템 초기화 실패:', error);
    }
});
