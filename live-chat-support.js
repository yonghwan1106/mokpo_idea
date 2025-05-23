// 실시간 채팅 상담 시스템
class LiveChatSupport {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.currentUser = {
            name: '방문자',
            id: 'visitor_' + Date.now()
        };
        this.agents = [
            {
                id: 'agent_1',
                name: '김목포',
                title: '목포 커넥트 상담원',
                avatar: 'img/agent-kim.jpg',
                status: 'online',
                specialties: ['체험 프로그램', '예약 문의', '일반 상담']
            },
            {
                id: 'agent_2',
                name: '이바다',
                title: '여행 전문 상담원',
                avatar: 'img/agent-lee.jpg',
                status: 'online',
                specialties: ['관광 코스', '숙박 추천', '교통 안내']
            },
            {
                id: 'agent_3',
                name: '박창업',
                title: '청년 창업 멘토',
                avatar: 'img/agent-park.jpg',
                status: 'away',
                specialties: ['창업 지원', '크리에이터 등록', '사업 문의']
            }
        ];
        this.currentAgent = null;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
        this.setupWebSocket(); // 실제로는 웹소켓 연결
        this.startPeriodicUpdates();
    }

    // 채팅 위젯 HTML 생성
    createChatWidget() {
        const chatHTML = `
            <!-- 채팅 플로팅 버튼 -->
            <div id="chat-floating-button" class="fixed bottom-6 right-6 z-50">
                <button class="bg-gradient-to-r from-mokpo-blue to-mokpo-cyan text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce">
                    <i class="fas fa-comments text-xl"></i>
                    <div id="chat-notification-badge" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hidden">0</div>
                </button>
            </div>

            <!-- 채팅 위젯 -->
            <div id="chat-widget" class="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 hidden transform translate-y-full transition-all duration-500">
                <!-- 채팅 헤더 -->
                <div class="bg-gradient-to-r from-mokpo-blue to-mokpo-cyan text-white p-4 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <img id="agent-avatar" src="img/mokpo-connect-logo.png" alt="상담원" class="w-10 h-10 rounded-full border-2 border-white">
                                <div id="agent-status" class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                            </div>
                            <div>
                                <h3 id="agent-name" class="font-bold text-lg">목포 커넥트</h3>
                                <p id="agent-status-text" class="text-sm opacity-90">실시간 상담 가능</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button id="chat-minimize" class="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                                <i class="fas fa-minus text-sm"></i>
                            </button>
                            <button id="chat-close" class="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                                <i class="fas fa-times text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 채팅 바디 -->
                <div id="chat-body" class="h-96 flex flex-col">
                    <!-- 상담원 선택 화면 -->
                    <div id="agent-selection" class="p-4 h-full">
                        <h4 class="font-bold text-lg text-mokpo-navy mb-4">상담 분야를 선택해주세요</h4>
                        <div class="space-y-3" id="agent-list"></div>
                        
                        <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                            <h5 class="font-semibold text-mokpo-navy mb-2">
                                <i class="fas fa-clock text-mokpo-cyan mr-2"></i>
                                운영시간
                            </h5>
                            <p class="text-sm text-gray-600">평일: 09:00 - 18:00</p>
                            <p class="text-sm text-gray-600">주말: 10:00 - 17:00</p>
                        </div>

                        <div class="mt-4 p-3 bg-mokpo-blue bg-opacity-10 rounded-lg">
                            <p class="text-sm text-mokpo-navy">
                                <i class="fas fa-info-circle mr-2"></i>
                                평균 응답시간: <strong>2분 이내</strong>
                            </p>
                        </div>
                    </div>

                    <!-- 채팅 메시지 영역 -->
                    <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 hidden">
                        <!-- 환영 메시지 -->
                        <div class="flex items-start space-x-3">
                            <img src="img/mokpo-connect-logo.png" alt="상담원" class="w-8 h-8 rounded-full">
                            <div class="flex-1 bg-gray-100 rounded-lg p-3 max-w-xs">
                                <p class="text-sm">안녕하세요! 목포 커넥트 상담센터입니다. 무엇을 도와드릴까요? 😊</p>
                                <span class="text-xs text-gray-500 mt-1 block">방금 전</span>
                            </div>
                        </div>
                    </div>

                    <!-- 입력 중 표시 -->
                    <div id="typing-indicator" class="px-4 py-2 hidden">
                        <div class="flex items-center space-x-2 text-gray-500 text-sm">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            </div>
                            <span id="typing-text">상담원이 입력 중입니다...</span>
                        </div>
                    </div>
                </div>

                <!-- 채팅 입력 -->
                <div id="chat-input-area" class="p-4 border-t border-gray-200 rounded-b-2xl hidden">
                    <div class="flex space-x-3">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="메시지를 입력하세요..." 
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mokpo-blue focus:border-transparent outline-none"
                        >
                        <button id="chat-send" class="bg-mokpo-blue text-white px-4 py-2 rounded-lg hover:bg-mokpo-navy transition-colors">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    
                    <!-- 빠른 응답 버튼 -->
                    <div id="quick-responses" class="mt-3 flex flex-wrap gap-2">
                        <button class="quick-response-btn px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-mokpo-blue hover:text-white transition-colors">
                            체험 프로그램 문의
                        </button>
                        <button class="quick-response-btn px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-mokpo-blue hover:text-white transition-colors">
                            예약 방법
                        </button>
                        <button class="quick-response-btn px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-mokpo-blue hover:text-white transition-colors">
                            가격 문의
                        </button>
                    </div>
                </div>
            </div>

            <!-- 채팅 최소화 상태 -->
            <div id="chat-minimized" class="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg z-50 hidden p-3 cursor-pointer hover:shadow-xl transition-shadow">
                <div class="flex items-center space-x-3">
                    <img src="img/mokpo-connect-logo.png" alt="상담원" class="w-8 h-8 rounded-full">
                    <div>
                        <p class="font-semibold text-sm text-mokpo-navy">목포 커넥트 상담</p>
                        <p class="text-xs text-gray-500">새 메시지가 있습니다</p>
                    </div>
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // 이벤트 바인딩
    bindEvents() {
        // 플로팅 버튼 클릭
        document.getElementById('chat-floating-button').addEventListener('click', () => {
            this.openChat();
        });

        // 채팅 닫기
        document.getElementById('chat-close').addEventListener('click', () => {
            this.closeChat();
        });

        // 채팅 최소화
        document.getElementById('chat-minimize').addEventListener('click', () => {
            this.minimizeChat();
        });

        // 최소화된 채팅 클릭
        document.getElementById('chat-minimized').addEventListener('click', () => {
            this.restoreChat();
        });

        // 메시지 전송
        document.getElementById('chat-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // 엔터키로 메시지 전송
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // 빠른 응답 버튼
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-response-btn')) {
                this.sendQuickResponse(e.target.textContent);
            }
        });

        // 상담원 선택
        document.addEventListener('click', (e) => {
            if (e.target.closest('.agent-card')) {
                const agentId = e.target.closest('.agent-card').dataset.agentId;
                this.selectAgent(agentId);
            }
        });
    }

    // 상담원 목록 생성
    renderAgentList() {
        const agentList = document.getElementById('agent-list');
        agentList.innerHTML = this.agents.map(agent => `
            <div class="agent-card cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-mokpo-blue hover:bg-mokpo-blue hover:bg-opacity-5 transition-all duration-300" data-agent-id="${agent.id}">
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <img src="${agent.avatar}" alt="${agent.name}" class="w-12 h-12 rounded-full">
                        <div class="absolute bottom-0 right-0 w-3 h-3 ${agent.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'} rounded-full border border-white"></div>
                    </div>
                    <div class="flex-1">
                        <h5 class="font-semibold text-mokpo-navy">${agent.name}</h5>
                        <p class="text-sm text-gray-600">${agent.title}</p>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${agent.specialties.slice(0, 2).map(specialty => 
                                `<span class="text-xs bg-mokpo-blue bg-opacity-10 text-mokpo-blue px-2 py-1 rounded">${specialty}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500 mb-1">
                            ${agent.status === 'online' ? '접속 중' : '자리 비움'}
                        </div>
                        <i class="fas fa-chevron-right text-mokpo-blue"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 채팅 열기
    openChat() {
        const widget = document.getElementById('chat-widget');
        const button = document.getElementById('chat-floating-button');
        
        if (!this.isOpen) {
            widget.classList.remove('hidden');
            setTimeout(() => {
                widget.style.transform = 'translateY(0)';
            }, 10);
            
            button.style.transform = 'scale(0.8)';
            this.isOpen = true;
            
            // 상담원 목록 렌더링
            this.renderAgentList();
        }
    }

    // 채팅 닫기
    closeChat() {
        const widget = document.getElementById('chat-widget');
        const button = document.getElementById('chat-floating-button');
        const minimized = document.getElementById('chat-minimized');
        
        widget.style.transform = 'translateY(100%)';
        setTimeout(() => {
            widget.classList.add('hidden');
        }, 500);
        
        minimized.classList.add('hidden');
        button.style.transform = 'scale(1)';
        
        this.isOpen = false;
        this.isMinimized = false;
    }

    // 채팅 최소화
    minimizeChat() {
        const widget = document.getElementById('chat-widget');
        const minimized = document.getElementById('chat-minimized');
        
        widget.classList.add('hidden');
        minimized.classList.remove('hidden');
        
        this.isMinimized = true;
    }

    // 최소화된 채팅 복원
    restoreChat() {
        const widget = document.getElementById('chat-widget');
        const minimized = document.getElementById('chat-minimized');
        
        minimized.classList.add('hidden');
        widget.classList.remove('hidden');
        widget.style.transform = 'translateY(0)';
        
        this.isMinimized = false;
    }

    // 상담원 선택
    selectAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) return;

        this.currentAgent = agent;
        
        // UI 업데이트
        document.getElementById('agent-avatar').src = agent.avatar;
        document.getElementById('agent-name').textContent = agent.name;
        document.getElementById('agent-status-text').textContent = agent.status === 'online' ? '온라인' : '자리 비움';
        document.getElementById('agent-status').className = `absolute bottom-0 right-0 w-3 h-3 ${agent.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'} rounded-full border border-white`;

        // 화면 전환
        document.getElementById('agent-selection').classList.add('hidden');
        document.getElementById('chat-messages').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');

        // 환영 메시지 추가
        this.addAgentMessage(`안녕하세요! ${agent.name}입니다. ${agent.specialties[0]} 관련해서 도움을 드릴게요. 무엇이 궁금하신가요?`);
    }

    // 메시지 전송
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // 사용자 메시지 추가
        this.addUserMessage(message);
        input.value = '';

        // 상담원 응답 시뮬레이션
        this.simulateAgentResponse(message);
    }

    // 빠른 응답 전송
    sendQuickResponse(message) {
        this.addUserMessage(message);
        this.simulateAgentResponse(message);
    }

    // 사용자 메시지 추가
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="flex items-end space-x-3 justify-end">
                <div class="bg-mokpo-blue text-white rounded-lg p-3 max-w-xs">
                    <p class="text-sm">${message}</p>
                    <span class="text-xs opacity-75 mt-1 block">${this.getCurrentTime()}</span>
                </div>
                <div class="w-8 h-8 bg-mokpo-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ${this.currentUser.name[0]}
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    // 상담원 메시지 추가
    addAgentMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const agent = this.currentAgent;
        
        const messageHTML = `
            <div class="flex items-start space-x-3">
                <img src="${agent.avatar}" alt="${agent.name}" class="w-8 h-8 rounded-full">
                <div class="flex-1 bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">${message}</p>
                    <span class="text-xs text-gray-500 mt-1 block">${this.getCurrentTime()}</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    // 상담원 응답 시뮬레이션
    simulateAgentResponse(userMessage) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // 간단한 키워드 기반 응답
            let response = this.generateResponse(userMessage);
            this.addAgentMessage(response);
        }, 1500 + Math.random() * 2000); // 1.5-3.5초 랜덤 지연
    }

    // 응답 생성 (실제로는 AI나 상담원 시스템과 연동)
    generateResponse(message) {
        const responses = {
            '체험': '목포 커넥트는 다양한 체험 프로그램을 제공합니다! 목포 9미 체험, VR 근대역사 체험, 해양 모험 등이 인기에요. 어떤 분야에 관심이 있으신가요?',
            '예약': '예약은 목포 커넥트 앱이나 웹사이트에서 간편하게 하실 수 있어요. 원하시는 날짜와 시간을 선택하시고 결제까지 한 번에 가능합니다!',
            '가격': '체험 프로그램마다 가격이 다른데요. 목포 9미 체험은 8만원, VR 근대역사 체험은 5만원, 해양 모험은 12만원입니다. 더 자세한 정보가 필요하시면 말씀해주세요!',
            '시간': '대부분의 프로그램은 2-6시간 정도 소요됩니다. 목포 9미 체험은 4시간, VR 체험은 3시간, 해양 모험은 하루 종일(6시간) 진행됩니다.',
            '안녕': '안녕하세요! 목포 커넥트에 관심을 가져주셔서 감사합니다. 무엇을 도와드릴까요? 😊',
            '고마워': '천만에요! 더 궁금한 것이 있으시면 언제든 말씀해주세요. 목포에서 즐거운 시간 보내시길 바라요! 🎉'
        };

        // 키워드 매칭
        for (let keyword in responses) {
            if (message.includes(keyword)) {
                return responses[keyword];
            }
        }

        // 기본 응답
        return '말씀하신 내용을 정확히 이해했습니다. 좀 더 구체적으로 알려주시면 더 자세한 안내를 드릴 수 있어요. 혹시 전화 상담을 원하시면 061-270-3624로 연락주세요!';
    }

    // 입력 중 표시
    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        this.scrollToBottom();
    }

    // 입력 중 숨기기
    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    // 하단으로 스크롤
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 현재 시간 반환
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // 웹소켓 설정 (실제 구현에서는 서버와 연결)
    setupWebSocket() {
        // 실제로는 WebSocket 연결 설정
        console.log('채팅 시스템이 초기화되었습니다.');
    }

    // 주기적 업데이트 (온라인 상태 등)
    startPeriodicUpdates() {
        setInterval(() => {
            // 실제로는 서버에서 상담원 상태, 새 메시지 등을 확인
            this.updateAgentStatus();
        }, 30000); // 30초마다 업데이트
    }

    // 상담원 상태 업데이트
    updateAgentStatus() {
        // 간단한 시뮬레이션: 랜덤하게 상담원 상태 변경
        this.agents.forEach(agent => {
            if (Math.random() < 0.1) { // 10% 확률로 상태 변경
                agent.status = agent.status === 'online' ? 'away' : 'online';
            }
        });
    }

    // 알림 표시
    showNotification(message) {
        const badge = document.getElementById('chat-notification-badge');
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        badge.classList.remove('hidden');
        
        // 브라우저 알림 (권한이 있는 경우)
        if (Notification.permission === 'granted') {
            new Notification('목포 커넥트 상담', {
                body: message,
                icon: 'icon-192x192.svg'
            });
        }
    }

    // 알림 배지 초기화
    clearNotificationBadge() {
        const badge = document.getElementById('chat-notification-badge');
        badge.textContent = '0';
        badge.classList.add('hidden');
    }
}

// 페이지 로드 시 채팅 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('실시간 채팅 시스템 초기화 중...');
    
    try {
        window.liveChatSupport = new LiveChatSupport();
        console.log('✅ 채팅 시스템이 성공적으로 초기화되었습니다.');
    } catch (error) {
        console.error('❌ 채팅 시스템 초기화 실패:', error);
    }
    
    // 브라우저 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('알림 권한:', permission);
        });
    }
});
