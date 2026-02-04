/**
 * 제주 여행 플래너 - V6
 * 편집 가능한 Day 카드 + 사진 썸네일
 */

const CONFIG = {
    TOAST_DURATION: 2500
};

// 기본 일정 (새로 만들 때 참조)
const DEFAULT_DAYS = {
    day1: {
        title: "첫날의 시작",
        image: null,
        album: [],
        items: [
            { id: 1, time: "08:57", location: "대전역 출발 (KTX)", type: "flight", completed: false, note: "청주로 이동", link: "https://map.naver.com/p/search/대전역" },
            { id: 2, time: "12:40", location: "청주공항 출발", type: "flight", completed: false, note: "제주행 비행기", link: "https://map.naver.com/p/search/청주공항" },
            { id: 3, time: "14:00", location: "도도리고기국수", type: "food", completed: false, note: "점심", link: "https://map.naver.com/p/search/제주%20도도리고기국수" },
            { id: 4, time: "15:30", location: "넥슨컴퓨터박물관", type: "spot", completed: false, link: "https://map.naver.com/p/search/넥슨컴퓨터박물관" },
            { id: 5, time: "17:00", location: "노을리 카페", type: "cafe", completed: false, link: "https://map.naver.com/p/search/제주%20노을리" },
            { id: 6, time: "18:30", location: "아르떼뮤지엄", type: "spot", completed: false, link: "https://map.naver.com/p/search/아르떼뮤지엄" }
        ]
    },
    day2: {
        title: "둘째날",
        image: null,
        album: [],
        items: []
    },
    day3: {
        title: "셋째날",
        image: null,
        album: [],
        items: []
    }
};

const ICONS = {
    spot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>`,
    cafe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>`,
    flight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
    stay: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
};

const TYPE_LABELS = {
    spot: '관광지',
    food: '맛집',
    cafe: '카페',
    flight: '이동',
    stay: '숙소'
};

const DEFAULT_BG = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

let scheduleData = {};
let nextId = 100;
let nextDayNum = 4;
let currentFilter = 'all';
let favorites = new Set();
let editingDay = null;
let viewingPhoto = { dayKey: null, index: null };

// Place Registry - stores places by category
let placeRegistry = {
    spot: [],
    food: [],
    cafe: [],
    flight: []
};
let currentRegistryCategory = null;

// Theme
let currentTheme = localStorage.getItem('theme') || 'light';

// Firebase Cloud Sync
let firebaseUserId = null;
let cloudSyncEnabled = false;
let syncDebounceTimer = null;

// Storage
function loadScheduleData() {
    const stored = localStorage.getItem('jejuV6');
    if (stored) {
        try {
            scheduleData = JSON.parse(stored);
            Object.entries(scheduleData).forEach(([key, day]) => {
                day.items?.forEach(item => {
                    if (item.id >= nextId) nextId = item.id + 1;
                });
                const num = parseInt(key.replace('day', ''));
                if (num >= nextDayNum) nextDayNum = num + 1;
            });
        } catch (e) {
            scheduleData = JSON.parse(JSON.stringify(DEFAULT_DAYS));
        }
    } else {
        scheduleData = JSON.parse(JSON.stringify(DEFAULT_DAYS));
    }

    const storedFav = localStorage.getItem('jejuFavorites');
    if (storedFav) favorites = new Set(JSON.parse(storedFav));

    // Load place registry
    const storedPlaces = localStorage.getItem('jejuPlaces');
    if (storedPlaces) {
        try {
            placeRegistry = JSON.parse(storedPlaces);
        } catch (e) { }
    }
}

function saveScheduleData() {
    localStorage.setItem('jejuV6', JSON.stringify(scheduleData));
    saveToCloud(); // Cloud sync
}

function saveFavorites() {
    localStorage.setItem('jejuFavorites', JSON.stringify([...favorites]));
}

// Theme Functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function savePlaces() {
    localStorage.setItem('jejuPlaces', JSON.stringify(placeRegistry));
}

// ============================================
// FIREBASE CLOUD SYNC
// ============================================
async function initFirebase() {
    // Wait for Firebase to be ready
    if (!window.firebaseAuth) {
        console.log('Firebase not available, using local storage only');
        return;
    }

    try {
        // Anonymous sign-in
        window.firebaseOnAuthStateChanged(window.firebaseAuth, async (user) => {
            if (user) {
                firebaseUserId = user.uid;
                cloudSyncEnabled = true;
                console.log('Firebase connected:', firebaseUserId);
                showToast('클라우드 동기화 연결됨 ☁️');

                // Load from cloud
                await loadFromCloud();

                // Set up real-time listener
                setupCloudListener();
            }
        });

        await window.firebaseSignIn(window.firebaseAuth);
    } catch (err) {
        console.error('Firebase init error:', err);
        showToast('로컬 저장 모드');
    }
}

async function loadFromCloud() {
    if (!cloudSyncEnabled || !firebaseUserId) return;

    try {
        const docRef = window.firebaseDoc(window.firebaseDb, 'travels', firebaseUserId);
        const docSnap = await window.firebaseGetDoc(docRef);

        if (docSnap.exists()) {
            const cloudData = docSnap.data();

            // Merge with local if cloud is newer
            if (cloudData.lastUpdated > (localStorage.getItem('jejuV6_lastUpdate') || 0)) {
                if (cloudData.scheduleData) {
                    scheduleData = cloudData.scheduleData;
                    localStorage.setItem('jejuV6', JSON.stringify(scheduleData));
                }
                if (cloudData.placeRegistry) {
                    placeRegistry = cloudData.placeRegistry;
                    localStorage.setItem('jejuPlaces', JSON.stringify(placeRegistry));
                }
                localStorage.setItem('jejuV6_lastUpdate', cloudData.lastUpdated);
                renderAll();
                showToast('클라우드에서 불러옴');
            }
        } else {
            // Upload local data to cloud
            await saveToCloud();
        }
    } catch (err) {
        console.error('Load from cloud error:', err);
    }
}

async function saveToCloud() {
    if (!cloudSyncEnabled || !firebaseUserId) return;

    // Debounce saves
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);

    syncDebounceTimer = setTimeout(async () => {
        try {
            const docRef = window.firebaseDoc(window.firebaseDb, 'travels', firebaseUserId);
            const timestamp = Date.now();

            await window.firebaseSetDoc(docRef, {
                scheduleData: scheduleData,
                placeRegistry: placeRegistry,
                lastUpdated: timestamp,
                appVersion: 'V12'
            });

            localStorage.setItem('jejuV6_lastUpdate', timestamp);
            console.log('Saved to cloud');
        } catch (err) {
            console.error('Save to cloud error:', err);
        }
    }, 2000); // 2 second debounce
}

function setupCloudListener() {
    if (!cloudSyncEnabled || !firebaseUserId) return;

    const docRef = window.firebaseDoc(window.firebaseDb, 'travels', firebaseUserId);
    window.firebaseOnSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const cloudData = doc.data();
            const localUpdate = parseInt(localStorage.getItem('jejuV6_lastUpdate') || 0);

            // Only update if cloud is newer and not our own save
            if (cloudData.lastUpdated > localUpdate + 2500) {
                scheduleData = cloudData.scheduleData || scheduleData;
                placeRegistry = cloudData.placeRegistry || placeRegistry;
                localStorage.setItem('jejuV6', JSON.stringify(scheduleData));
                localStorage.setItem('jejuPlaces', JSON.stringify(placeRegistry));
                localStorage.setItem('jejuV6_lastUpdate', cloudData.lastUpdated);
                renderAll();
                showToast('다른 기기에서 동기화됨');
            }
        }
    });
}

// Share Functionality
async function shareApp() {
    const shareData = {
        title: '제주 여행 플래너',
        text: '예진 ♥ 자현 첫 비행기 제주 여행 일정입니다! 🌴✈️',
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast('공유 완료!');
        } else {
            await navigator.clipboard.writeText(window.location.href);
            showToast('링크가 복사되었습니다!');
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            await navigator.clipboard.writeText(window.location.href);
            showToast('링크가 복사되었습니다!');
        }
    }
}

// ============================================
// KAKAO MAP INTEGRATION
// ============================================
let kakaoMap = null;
let mapMarkers = [];

function openMapModal() {
    const modal = document.getElementById('mapModal');
    modal.classList.add('active');

    // Initialize map if not already
    setTimeout(() => initKakaoMap(), 100);
}

function closeMapModal() {
    document.getElementById('mapModal').classList.remove('active');
}

function initKakaoMap() {
    if (!window.kakao || !window.kakao.maps) {
        showToast('지도를 불러오는 중...');
        return;
    }

    const container = document.getElementById('kakaoMap');
    const options = {
        center: new kakao.maps.LatLng(33.4890, 126.4983), // 제주 중심
        level: 9
    };

    kakaoMap = new kakao.maps.Map(container, options);

    // Add markers for all schedule items with locations
    addScheduleMarkers();
    showToast('🗺️ 지도 로드 완료!');
}

function addScheduleMarkers() {
    if (!kakaoMap) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    mapMarkers = [];

    // Sample Jeju locations (can be dynamically loaded from schedule)
    const jejuLocations = [
        { name: '제주국제공항', lat: 33.5104, lng: 126.4914, type: 'flight' },
        { name: '성산일출봉', lat: 33.4582, lng: 126.9425, type: 'spot' },
        { name: '협재해수욕장', lat: 33.3947, lng: 126.2397, type: 'spot' },
        { name: '만장굴', lat: 33.5283, lng: 126.7714, type: 'spot' },
        { name: '흑돼지거리', lat: 33.4996, lng: 126.5312, type: 'food' },
        { name: '오설록 티뮤지엄', lat: 33.3058, lng: 126.2893, type: 'cafe' }
    ];

    const markerColors = {
        spot: '#FF6B6B',
        food: '#4ECDC4',
        cafe: '#9B59B6',
        flight: '#176FF2'
    };

    jejuLocations.forEach(loc => {
        const position = new kakao.maps.LatLng(loc.lat, loc.lng);

        // Custom marker with color
        const content = `
            <div style="
                width: 32px; height: 32px; 
                background: ${markerColors[loc.type]}; 
                border-radius: 50% 50% 50% 0; 
                transform: rotate(-45deg);
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
        `;

        const overlay = new kakao.maps.CustomOverlay({
            position: position,
            content: `<div class="map-marker" style="
                background: ${markerColors[loc.type]};
                color: white;
                padding: 6px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">${loc.name}</div>`,
            yAnchor: 1.3
        });

        overlay.setMap(kakaoMap);
        mapMarkers.push(overlay);
    });
}
// Image Compression
async function compressImage(file, maxWidth = 1920, quality = 0.8) {
    if (typeof imageCompression !== 'undefined') {
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: maxWidth,
                useWebWorker: true,
                initialQuality: quality
            };
            const compressedFile = await imageCompression(file, options);
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(compressedFile);
            });
        } catch (err) {
            console.warn('Compression failed, using original:', err);
            return readFileAsDataURL(file);
        }
    } else {
        return readFileAsDataURL(file);
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// Day Cards Rendering
function renderDayCards() {
    const container = document.getElementById('dayCardsContainer');
    if (!container) return;

    const days = Object.keys(scheduleData).sort((a, b) => {
        const numA = parseInt(a.replace('day', ''));
        const numB = parseInt(b.replace('day', ''));
        return numA - numB;
    });

    container.innerHTML = days.map((dayKey, index) => {
        const day = scheduleData[dayKey];
        const dayNum = index + 1;
        const hasImage = day.image;

        return `
            <div class="popular-card" data-day="${dayKey}" onclick="scrollToDay('${dayKey}')">
                ${hasImage
                ? `<img src="${day.image}" alt="${day.title}" class="card-image">`
                : `<div class="card-image card-placeholder">${ICONS.image}</div>`
            }
                <div class="card-overlay">
                    <div class="card-content">
                        <h3 class="card-title">${dayNum}일차</h3>
                        <p class="card-subtitle">${day.title}</p>
                    </div>
                    <button class="card-edit" onclick="openEditDayModal('${dayKey}', event)">
                        ${ICONS.edit}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    gsap.from('.popular-card', { opacity: 0, x: 30, duration: 0.4, stagger: 0.1 });
}

// Schedule Sections Rendering
function renderScheduleSections() {
    const container = document.getElementById('scheduleSections');
    if (!container) return;

    const days = Object.keys(scheduleData).sort((a, b) => {
        const numA = parseInt(a.replace('day', ''));
        const numB = parseInt(b.replace('day', ''));
        return numA - numB;
    });

    container.innerHTML = days.map((dayKey, index) => {
        const day = scheduleData[dayKey];
        const dayNum = index + 1;

        return `
            <section class="section schedule-section" id="${dayKey}-section" data-day="${dayKey}">
                <div class="section-header">
                    <h2 class="section-title">${dayNum}일차: ${day.title}</h2>
                    <button class="add-btn" data-day="${dayKey}" onclick="openAddModal('${dayKey}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
                <ul class="schedule-list" id="${dayKey}-list"></ul>
            </section>
        `;
    }).join('');

    days.forEach(renderScheduleList);
}

function renderScheduleList(dayKey) {
    const listEl = document.getElementById(`${dayKey}-list`);
    const dayData = scheduleData[dayKey];

    if (!dayData || !dayData.items || dayData.items.length === 0) {
        listEl.innerHTML = `
            <li class="empty-state">
                <div class="empty-icon">${ICONS.calendar}</div>
                <div class="empty-text">일정이 없습니다</div>
            </li>
        `;
        return;
    }

    dayData.items.sort((a, b) => a.time.localeCompare(b.time));

    listEl.innerHTML = dayData.items.map(item => {
        const completedClass = item.completed ? 'completed' : '';
        const filteredClass = shouldFilter(item) ? 'filtered-out' : '';
        const isFavorite = favorites.has(item.id);

        return `
            <li class="schedule-item ${completedClass} ${filteredClass}" data-id="${item.id}">
                <div class="item-thumb" data-type="${item.type}">
                    ${ICONS[item.type] || ICONS.spot}
                </div>
                <div class="item-info" onclick="showItemDetail('${dayKey}', ${item.id})">
                    <div class="item-name">${item.location}</div>
                    <div class="item-meta">
                        <span class="item-time">${item.time}</span>
                        <span class="item-type">${TYPE_LABELS[item.type] || '장소'}</span>
                        ${item.note ? `<span class="item-note">${item.note}</span>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    ${item.link ? `<a class="action-btn map-btn" href="${item.link}" target="_blank" onclick="event.stopPropagation()">${ICONS.map}</a>` : ''}
                    <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleItemFavorite(${item.id})">
                        ${ICONS.heart}
                    </button>
                    <div class="item-checkbox" onclick="toggleComplete('${dayKey}', ${item.id})">
                        ${ICONS.check}
                    </div>
                </div>
                <button class="item-delete" onclick="deleteScheduleItem('${dayKey}', ${item.id})">
                    ${ICONS.close}
                </button>
            </li>
        `;
    }).join('');
}

function shouldFilter(item) {
    if (currentFilter === 'all') return false;
    if (currentFilter === 'completed') return !item.completed;
    if (currentFilter === 'favorites') return !favorites.has(item.id);
    return item.type !== currentFilter;
}

function renderAll() {
    renderDayCards();
    renderScheduleSections();
}

// Day CRUD
function addNewDay() {
    const newKey = `day${nextDayNum++}`;
    scheduleData[newKey] = {
        title: "새 일정",
        image: null,
        items: []
    };
    saveScheduleData();
    renderAll();
    showToast('새 일정이 추가되었습니다');

    setTimeout(() => openEditDayModal(newKey, null), 300);
}

function updateDay(dayKey, title, imageData) {
    if (scheduleData[dayKey]) {
        scheduleData[dayKey].title = title;
        if (imageData) scheduleData[dayKey].image = imageData;
        saveScheduleData();
        renderAll();
        showToast('저장되었습니다');
    }
}

function deleteDay(dayKey) {
    if (Object.keys(scheduleData).length <= 1) {
        showToast('최소 1개 일정은 필요합니다');
        return;
    }

    delete scheduleData[dayKey];
    saveScheduleData();
    renderAll();
    closeEditDayModal();
    showToast('일정이 삭제되었습니다');
}

// Edit Day Modal
function openEditDayModal(dayKey, event) {
    if (event) event.stopPropagation();

    editingDay = dayKey;
    const day = scheduleData[dayKey];
    if (!day) return;

    // Ensure album exists
    if (!day.album) day.album = [];

    const dayNum = Object.keys(scheduleData).sort((a, b) => {
        const numA = parseInt(a.replace('day', ''));
        const numB = parseInt(b.replace('day', ''));
        return numA - numB;
    }).indexOf(dayKey) + 1;

    document.getElementById('editDayKey').value = dayKey;
    document.getElementById('editDayName').value = day.title;
    document.getElementById('editDayTitle').textContent = `${dayNum}일차 편집`;

    // Representative photo
    const preview = document.getElementById('dayPhotoPreview');
    preview.dataset.newImage = '';
    if (day.image) {
        preview.innerHTML = `<img src="${day.image}" alt="썸네일">`;
        preview.classList.add('has-image');
    } else {
        preview.innerHTML = `<span>${ICONS.image} 사진을 선택하세요</span>`;
        preview.classList.remove('has-image');
    }

    // Album photos
    renderAlbumGrid();

    document.getElementById('editDayModal').classList.add('active');
}

function renderAlbumGrid() {
    if (!editingDay) return;

    const day = scheduleData[editingDay];
    const grid = document.getElementById('albumGrid');
    const countEl = document.getElementById('albumPhotoCount');

    if (!day || !grid) return;

    const album = day.album || [];
    countEl.textContent = `(${album.length}장)`;

    if (album.length === 0) {
        grid.innerHTML = '<div class="album-empty">사진을 추가하세요</div>';
        return;
    }

    grid.innerHTML = album.map((photo, index) => `
        <div class="album-item" onclick="viewAlbumPhoto(${index})">
            <img src="${photo}" alt="사진 ${index + 1}">
            <button class="album-item-delete" onclick="deleteAlbumPhotoAtIndex(${index}, event)">
                ${ICONS.close}
            </button>
        </div>
    `).join('');
}

function addAlbumPhotos(files) {
    if (!editingDay || !files || files.length === 0) return;

    const day = scheduleData[editingDay];
    if (!day.album) day.album = [];

    showToast('사진 압축 중...');

    const promises = Array.from(files).map(file => compressImage(file, 1200, 0.7));

    Promise.all(promises).then(photos => {
        day.album.push(...photos);

        // Auto-set first photo as representative if none
        if (!day.image && day.album.length > 0) {
            day.image = day.album[0];
            const preview = document.getElementById('dayPhotoPreview');
            preview.innerHTML = `<img src="${day.image}" alt="썸네일">`;
            preview.classList.add('has-image');
        }

        saveScheduleData();
        renderDayCards();
        renderAlbumGrid();
        showToast(`${photos.length}장 추가됨 (압축 완료)`);
    });
}

function viewAlbumPhoto(index) {
    if (!editingDay) return;

    const day = scheduleData[editingDay];
    if (!day.album || !day.album[index]) return;

    viewingPhoto = { dayKey: editingDay, index };

    const modal = document.getElementById('photoViewerModal');
    const img = document.getElementById('photo-viewer-img');

    img.src = day.album[index];
    modal.classList.add('active');
}

function closePhotoViewer() {
    document.getElementById('photoViewerModal').classList.remove('active');
    viewingPhoto = { dayKey: null, index: null };
}

function deleteAlbumPhoto() {
    if (!viewingPhoto.dayKey || viewingPhoto.index === null) return;

    const day = scheduleData[viewingPhoto.dayKey];
    if (!day.album) return;

    day.album.splice(viewingPhoto.index, 1);

    // If deleted photo was representative, update
    if (day.image === day.album[viewingPhoto.index]) {
        day.image = day.album[0] || null;
    }

    saveScheduleData();
    renderDayCards();
    renderAlbumGrid();
    closePhotoViewer();
    showToast('사진이 삭제되었습니다');
}

function deleteAlbumPhotoAtIndex(index, event) {
    event.stopPropagation();

    if (!editingDay) return;

    const day = scheduleData[editingDay];
    if (!day.album) return;

    const deletedPhoto = day.album[index];
    day.album.splice(index, 1);

    // If deleted photo was representative, update
    if (day.image === deletedPhoto) {
        day.image = day.album[0] || null;
        const preview = document.getElementById('dayPhotoPreview');
        if (day.image) {
            preview.innerHTML = `<img src="${day.image}" alt="썸네일">`;
            preview.classList.add('has-image');
        } else {
            preview.innerHTML = `<span>${ICONS.image} 사진을 선택하세요</span>`;
            preview.classList.remove('has-image');
        }
    }

    saveScheduleData();
    renderDayCards();
    renderAlbumGrid();
    showToast('사진이 삭제되었습니다');
}

function closeEditDayModal() {
    document.getElementById('editDayModal').classList.remove('active');
    editingDay = null;
}

// Schedule Item CRUD
function addScheduleItem(dayKey, time, location, type, note = '', link = '') {
    const newItem = {
        id: nextId++,
        time,
        location,
        type,
        completed: false,
        note,
        link
    };

    scheduleData[dayKey].items.push(newItem);
    saveScheduleData();
    renderScheduleList(dayKey);
    showToast(`추가됨: ${location}`);
}

function deleteScheduleItem(dayKey, itemId) {
    event.stopPropagation();

    const item = scheduleData[dayKey].items.find(i => i.id === itemId);
    scheduleData[dayKey].items = scheduleData[dayKey].items.filter(i => i.id !== itemId);
    favorites.delete(itemId);
    saveScheduleData();
    saveFavorites();
    renderScheduleList(dayKey);
    if (item) showToast(`삭제됨: ${item.location}`);
}

function toggleComplete(dayKey, itemId) {
    event.stopPropagation();

    const item = scheduleData[dayKey].items.find(i => i.id === itemId);
    if (item) {
        item.completed = !item.completed;
        saveScheduleData();

        const itemEl = document.querySelector(`[data-id="${itemId}"]`);
        if (itemEl) {
            itemEl.classList.toggle('completed', item.completed);
        }

        showToast(item.completed ? '완료!' : '완료 취소');
    }
}

function toggleItemFavorite(itemId) {
    event.stopPropagation();

    if (favorites.has(itemId)) {
        favorites.delete(itemId);
        showToast('즐겨찾기 해제');
    } else {
        favorites.add(itemId);
        showToast('즐겨찾기 추가');
    }

    saveFavorites();
    Object.keys(scheduleData).forEach(renderScheduleList);
}

// Item Detail Modal
function showItemDetail(dayKey, itemId) {
    const item = scheduleData[dayKey].items.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('detail-title').textContent = item.location;
    document.getElementById('detail-time').textContent = item.time;
    document.getElementById('detail-type').textContent = TYPE_LABELS[item.type] || '장소';
    document.getElementById('detail-note').textContent = item.note || '-';
    document.getElementById('detail-status').textContent = item.completed ? '완료' : '대기중';
    document.getElementById('detail-status').className = `detail-value detail-status ${item.completed ? 'completed' : ''}`;

    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Add Schedule Modal
function openAddModal(dayKey) {
    document.getElementById('targetDay').value = dayKey;
    document.getElementById('addModal').classList.add('active');
    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleType').value = 'spot';

    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'spot');
    });
}

function closeModal() {
    document.getElementById('addModal').classList.remove('active');
}

// Filter
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filter);
    });
    Object.keys(scheduleData).forEach(renderScheduleList);
}

// Scroll to day
function scrollToDay(dayKey) {
    const section = document.getElementById(`${dayKey}-section`);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toast
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 200);
    }, CONFIG.TOAST_DURATION);
}

// Search
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.schedule-item').forEach(item => {
                const name = item.querySelector('.item-name')?.textContent.toLowerCase() || '';
                item.style.display = (query === '' || name.includes(query)) ? '' : 'none';
            });
        });
    }
}

// Bottom Navigation
function setupBottomNav() {
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            switch (index) {
                case 0: window.scrollTo({ top: 0, behavior: 'smooth' }); break;
                case 1:
                    const firstDay = Object.keys(scheduleData).sort()[0];
                    if (firstDay) scrollToDay(firstDay);
                    break;
                case 2: setFilter('favorites'); break;
            }
        });
    });
}

// Type Selector
function setupTypeSelector() {
    const selector = document.getElementById('typeSelector');
    const input = document.getElementById('scheduleType');

    selector?.addEventListener('click', (e) => {
        const btn = e.target.closest('.type-btn');
        if (btn) {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            input.value = btn.dataset.type;
        }
    });
}

// Events
function setupEventListeners() {
    // Add new day
    document.getElementById('addDayBtn')?.addEventListener('click', addNewDay);

    // Chips - "all" filters, others open place registry
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;
            if (filter === 'all') {
                setFilter('all');
            } else {
                openPlaceRegistry(filter);
            }
        });
    });

    // Add modal
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('addModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'addModal') closeModal();
    });

    // Schedule form
    document.getElementById('scheduleForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const dayKey = document.getElementById('targetDay').value;
        const time = document.getElementById('scheduleTime').value;
        const location = document.getElementById('scheduleLocation').value.trim();
        const type = document.getElementById('scheduleType').value;
        const note = document.getElementById('scheduleNote')?.value.trim() || '';
        const link = document.getElementById('scheduleLink')?.value.trim() || '';

        if (time && location) {
            addScheduleItem(dayKey, time, location, type, note, link);
            closeModal();
        }
    });

    // Detail modal
    document.getElementById('detailModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') closeDetailModal();
    });
    document.getElementById('closeDetail')?.addEventListener('click', closeDetailModal);

    // Edit day modal
    document.getElementById('closeEditDay')?.addEventListener('click', closeEditDayModal);
    document.getElementById('editDayModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'editDayModal') closeEditDayModal();
    });

    // Photo upload
    const photoPreview = document.getElementById('dayPhotoPreview');
    const photoInput = document.getElementById('editDayPhoto');

    photoPreview?.addEventListener('click', () => photoInput?.click());

    photoInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                photoPreview.innerHTML = `<img src="${ev.target.result}" alt="썸네일">`;
                photoPreview.classList.add('has-image');
                photoPreview.dataset.newImage = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Edit day form
    document.getElementById('editDayForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const dayKey = document.getElementById('editDayKey').value;
        const title = document.getElementById('editDayName').value.trim();
        const newImage = document.getElementById('dayPhotoPreview').dataset.newImage;

        if (title) {
            updateDay(dayKey, title, newImage);
            closeEditDayModal();
        }
    });

    // Delete day
    document.getElementById('deleteDayBtn')?.addEventListener('click', () => {
        if (editingDay && confirm('이 일정을 삭제하시겠습니까?')) {
            deleteDay(editingDay);
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDetailModal();
            closeEditDayModal();
        }
    });

    setupTypeSelector();
    setupBottomNav();
    setupSearch();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadScheduleData();
    renderAll();
    setupEventListeners();

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Share button
    document.getElementById('shareBtn')?.addEventListener('click', shareApp);

    // Map button
    document.getElementById('mapBtn')?.addEventListener('click', openMapModal);

    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.header-top', { opacity: 0, y: -20, duration: 0.5 });
    gsap.from('.search-bar', { opacity: 0, y: 10, duration: 0.4, delay: 0.2 });
    gsap.from('.chip', { opacity: 0, y: 10, duration: 0.3, stagger: 0.05, delay: 0.3 });

    // Hide splash screen after load
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }
    }, 1500);

    // Initialize Firebase (delayed to let module load)
    setTimeout(() => initFirebase(), 2000);

    // FAB button
    document.getElementById('fabMain')?.addEventListener('click', toggleFab);

    console.log('제주 여행 앱 V14 로드됨! (여행 도구 + 체크리스트 + 예산 계산기)');
});

// ============================================
// PLACE REGISTRY
// ============================================
function openPlaceRegistry(category) {
    if (!category || category === 'all') return;

    currentRegistryCategory = category;

    // Ensure category exists
    if (!placeRegistry[category]) placeRegistry[category] = [];

    document.getElementById('placeRegistryTitle').textContent =
        `${TYPE_LABELS[category] || category} 장소 등록`;
    document.getElementById('newPlaceName').value = '';

    renderPlaceList();
    document.getElementById('placeRegistryModal').classList.add('active');
}

function closePlaceRegistry() {
    document.getElementById('placeRegistryModal').classList.remove('active');
    currentRegistryCategory = null;
}

function renderPlaceList() {
    const container = document.getElementById('placeList');
    if (!container || !currentRegistryCategory) return;

    const places = placeRegistry[currentRegistryCategory] || [];

    if (places.length === 0) {
        container.innerHTML = `<div class="place-empty">등록된 장소가 없습니다</div>`;
        return;
    }

    container.innerHTML = places.map((place, index) => `
        <div class="place-item">
            <span class="place-name">${place}</span>
            <button class="place-delete" onclick="deletePlace(${index})">
                ${ICONS.close}
            </button>
        </div>
    `).join('');
}

function addPlace() {
    if (!currentRegistryCategory) return;

    const input = document.getElementById('newPlaceName');
    const name = input.value.trim();

    if (!name) {
        showToast('장소명을 입력하세요');
        return;
    }

    if (!placeRegistry[currentRegistryCategory]) {
        placeRegistry[currentRegistryCategory] = [];
    }

    // Check duplicate
    if (placeRegistry[currentRegistryCategory].includes(name)) {
        showToast('이미 등록된 장소입니다');
        return;
    }

    placeRegistry[currentRegistryCategory].push(name);
    savePlaces();
    renderPlaceList();
    input.value = '';
    showToast(`'${name}' 등록됨`);
}

function deletePlace(index) {
    if (!currentRegistryCategory) return;

    const deleted = placeRegistry[currentRegistryCategory][index];
    placeRegistry[currentRegistryCategory].splice(index, 1);
    savePlaces();
    renderPlaceList();
    showToast(`'${deleted}' 삭제됨`);
}

// Global functions
window.toggleComplete = toggleComplete;
window.deleteScheduleItem = deleteScheduleItem;
window.toggleItemFavorite = toggleItemFavorite;
window.showItemDetail = showItemDetail;
window.closeDetailModal = closeDetailModal;
window.openAddModal = openAddModal;
window.openEditDayModal = openEditDayModal;
window.closeEditDayModal = closeEditDayModal;
window.scrollToDay = scrollToDay;
window.addAlbumPhotos = addAlbumPhotos;
window.viewAlbumPhoto = viewAlbumPhoto;
window.closePhotoViewer = closePhotoViewer;
window.deleteAlbumPhoto = deleteAlbumPhoto;
window.deleteAlbumPhotoAtIndex = deleteAlbumPhotoAtIndex;
window.openPlaceRegistry = openPlaceRegistry;
window.closePlaceRegistry = closePlaceRegistry;
window.addPlace = addPlace;
window.deletePlace = deletePlace;

// ============================================
// MAP MODAL
// ============================================
let kakaoMapInstance = null;

function openMapModal() {
    const modal = document.getElementById('mapModal');
    modal?.classList.add('active');

    // Initialize Kakao Map if not already
    setTimeout(() => {
        if (!kakaoMapInstance && typeof kakao !== 'undefined') {
            const container = document.getElementById('kakaoMap');
            if (container) {
                const options = {
                    center: new kakao.maps.LatLng(33.4996, 126.5312), // Jeju center
                    level: 9
                };
                kakaoMapInstance = new kakao.maps.Map(container, options);

                // Add markers for key locations
                const locations = [
                    { lat: 33.5097, lng: 126.5219, title: '제주공항', type: 'flight' },
                    { lat: 33.2891, lng: 126.1685, title: '오설록 티뮤지엄', type: 'spot' },
                    { lat: 33.2448, lng: 126.4115, title: '중문관광단지', type: 'spot' },
                    { lat: 33.4584, lng: 126.9423, title: '성산일출봉', type: 'spot' }
                ];

                locations.forEach(loc => {
                    const marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(loc.lat, loc.lng),
                        map: kakaoMapInstance
                    });

                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;">${loc.title}</div>`
                    });

                    kakao.maps.event.addListener(marker, 'click', () => {
                        infowindow.open(kakaoMapInstance, marker);
                    });
                });
            }
        } else if (kakaoMapInstance) {
            kakaoMapInstance.relayout();
        }
    }, 300);
}

function closeMapModal() {
    document.getElementById('mapModal')?.classList.remove('active');
}

window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;

// ============================================
// TRAVEL TOOLS (FAB, Checklist, Budget, Weather)
// ============================================
let checklistItems = JSON.parse(localStorage.getItem('jejuChecklist') || '[]');
let budgetItems = JSON.parse(localStorage.getItem('jejuBudget') || '[]');

// Default checklist items
if (checklistItems.length === 0) {
    checklistItems = [
        { id: 1, text: '여권/신분증', checked: false },
        { id: 2, text: '항공권 확인', checked: false },
        { id: 3, text: '숙소 예약', checked: false },
        { id: 4, text: '렌트카 예약', checked: false },
        { id: 5, text: '카메라 충전기', checked: false },
        { id: 6, text: '썬크림', checked: false }
    ];
    saveChecklist();
}

// FAB Toggle
function toggleFab() {
    const fab = document.getElementById('fabMain');
    const menu = document.getElementById('fabMenu');
    fab.classList.toggle('active');
    menu.classList.toggle('active');
}

// Checklist Functions
function openChecklist() {
    toggleFab();
    document.getElementById('checklistModal').classList.add('active');
    renderChecklist();
}

function closeChecklist() {
    document.getElementById('checklistModal').classList.remove('active');
}

function renderChecklist() {
    const container = document.getElementById('travelChecklist');
    container.innerHTML = checklistItems.map(item => `
        <div class="check-item ${item.checked ? 'completed' : ''}">
            <div class="check-box ${item.checked ? 'checked' : ''}" onclick="toggleCheckItem(${item.id})">
                ${item.checked ? '✓' : ''}
            </div>
            <span class="check-text">${item.text}</span>
            <button class="check-delete" onclick="deleteCheckItem(${item.id})">×</button>
        </div>
    `).join('');
}

function toggleCheckItem(id) {
    const item = checklistItems.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        saveChecklist();
        renderChecklist();
    }
}

function addCheckItem() {
    const input = document.getElementById('newCheckItem');
    if (input.value.trim()) {
        checklistItems.push({
            id: Date.now(),
            text: input.value.trim(),
            checked: false
        });
        input.value = '';
        saveChecklist();
        renderChecklist();
        showToast('항목 추가됨!');
    }
}

function deleteCheckItem(id) {
    checklistItems = checklistItems.filter(i => i.id !== id);
    saveChecklist();
    renderChecklist();
}

function saveChecklist() {
    localStorage.setItem('jejuChecklist', JSON.stringify(checklistItems));
}

// Budget Calculator Functions
function openBudgetCalc() {
    toggleFab();
    document.getElementById('budgetModal').classList.add('active');
    renderBudget();
}

function closeBudgetCalc() {
    document.getElementById('budgetModal').classList.remove('active');
}

function renderBudget() {
    const container = document.getElementById('budgetItems');
    const categoryIcons = {
        flight: '✈️', stay: '🏨', food: '🍽️', activity: '🎢', other: '📦'
    };

    container.innerHTML = budgetItems.map(item => `
        <div class="budget-item">
            <span class="budget-item-icon">${categoryIcons[item.category] || '📦'}</span>
            <span class="budget-item-name">${item.name}</span>
            <span class="budget-item-amount">₩${item.amount.toLocaleString()}</span>
            <button class="budget-item-delete" onclick="deleteBudgetItem(${item.id})">×</button>
        </div>
    `).join('');

    const total = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    document.getElementById('budgetTotal').textContent = `₩${total.toLocaleString()}`;
}

function addBudgetItem() {
    const name = document.getElementById('budgetItemName').value.trim();
    const amount = parseInt(document.getElementById('budgetItemAmount').value) || 0;
    const category = document.getElementById('budgetItemCategory').value;

    if (name && amount > 0) {
        budgetItems.push({ id: Date.now(), name, amount, category });
        document.getElementById('budgetItemName').value = '';
        document.getElementById('budgetItemAmount').value = '';
        saveBudget();
        renderBudget();
        showToast('예산 항목 추가됨!');
    }
}

function deleteBudgetItem(id) {
    budgetItems = budgetItems.filter(i => i.id !== id);
    saveBudget();
    renderBudget();
}

function saveBudget() {
    localStorage.setItem('jejuBudget', JSON.stringify(budgetItems));
}

// Weather Functions
async function refreshWeather() {
    toggleFab();
    showToast('🌤️ 날씨 업데이트 중...');

    // Simulated weather data (replace with real API)
    const weatherData = [
        { icon: '☀️', temp: 22, desc: '맑음', humidity: 55, wind: 8 },
        { icon: '🌤️', temp: 18, desc: '구름 조금', humidity: 65, wind: 12 },
        { icon: '⛅', temp: 16, desc: '흐림', humidity: 70, wind: 15 },
        { icon: '🌧️', temp: 14, desc: '비', humidity: 85, wind: 20 }
    ];

    const weather = weatherData[Math.floor(Math.random() * weatherData.length)];

    setTimeout(() => {
        document.querySelector('.weather-icon').textContent = weather.icon;
        document.querySelector('.weather-temp').textContent = `${weather.temp}°C`;
        document.querySelector('.weather-desc').textContent = `제주 ${weather.desc}`;
        document.querySelector('.weather-detail').innerHTML = `
            <span>💧 ${weather.humidity}%</span>
            <span>🌬️ ${weather.wind}km/h</span>
        `;
        showToast('날씨 업데이트 완료!');
    }, 500);
}

// Window Exports
window.toggleFab = toggleFab;
window.openChecklist = openChecklist;
window.closeChecklist = closeChecklist;
window.toggleCheckItem = toggleCheckItem;
window.addCheckItem = addCheckItem;
window.deleteCheckItem = deleteCheckItem;
window.openBudgetCalc = openBudgetCalc;
window.closeBudgetCalc = closeBudgetCalc;
window.addBudgetItem = addBudgetItem;
window.deleteBudgetItem = deleteBudgetItem;
window.refreshWeather = refreshWeather;
