// $('주어 혹은 선택자').함수 (function (){
//      // 함수 > 동사 느낌
//      실행 구문
// })

// ⭐️ 스크롤바 너비를 계산하는 함수 (한번만 호출하면 됨)
function getScrollbarWidth() {
    const outer = $('<div>').css({ visibility: 'hidden', width: 100, overflow: 'scroll' }).appendTo('body');
    const inner = $('<div>').css('width', '100%').appendTo(outer);
    const widthWithScroll = outer.width();
    const widthWithoutScroll = inner.width();
    outer.remove();
    return widthWithScroll - widthWithoutScroll;
}

// -----------------------------------------------------------
// 세션 별 스크립트 (스크립트가 길어져서 게임 세션 일부분은 따로 스크립트로 만듬)
$(document).ready(function () {
    // 스크롤 //
    $(window).scroll(function () {
        let curScroll = $(this).scrollTop();
        $('.cur-scroll span').text(curScroll);

        // 스크롤할때마다 현재 값을 보여주면서 나옴
        if (curScroll > 0 && $(window).width() >= 768) {
            $('header').addClass('on');
        } else {
            $('header').removeClass('on');
        }


        let winh = $(window).height();
        let baseline = curScroll + winh * 0.3;

        if (baseline >= $('#tip').offset().top) {
            console.log("Tip 섹션 활성화: " + baseline + " >= " + $('#tip').offset().top);
            $('#tip').addClass('on');
            $('.main-nav-list li').eq(5).addClass('active-tab').siblings().removeClass('active-tab'); // 이제 메인 내비만 찾음!

            // 다른 섹션 비활성화
            $('#tip').siblings().removeClass('on');
            return; // 여기서 함수 종료
        } else if (baseline >= $('#movie').offset().top) {
            $('#movie').addClass('on').siblings().removeClass('on');
            $('nav ul li').eq(4).addClass('on').siblings().removeClass('on');
        } else if (baseline >= $('#game').offset().top) {
            $('#game').addClass('on').siblings().removeClass('on');
            $('nav ul li').eq(3).addClass('on').siblings().removeClass('on');
        } else if (baseline >= $('#folio').offset().top) {
            $('#folio').addClass('on').siblings().removeClass('on');
            $('nav ul li').eq(2).addClass('on').siblings().removeClass('on');
        } else if (baseline >= $('#about').offset().top) {
            $('#about').addClass('on').siblings().removeClass('on');
            $('nav ul li').eq(1).addClass('on').siblings().removeClass('on');
        } else {
            $('#home').addClass('on').siblings().removeClass('on');
            $('nav ul li').eq(0).addClass('on').siblings().removeClass('on');
        }

        if (curScroll > $('#home').height()) {
            $('.top-btn').addClass('show');
        } else {
            $('.top-btn').removeClass('show');
        }
        // if(조건){조건이 충족될 경우의 값}
        // if(조건){조건이 충족될 경우의 값} else{조건 불충족 되었을 경우의 값}
    })

    $('nav li').click(function () {
        $(this).addClass('on').siblings().removeClass('on');
    })

    $('.darkmode-btn').click(function () {
        $(this).toggleClass('on');
        $('body, #wrap').toggleClass('on');
    });


    $('h1').click(function () {
        $(this).toggleClass('on');
    })


    let scrollPositon = 0;
    // 스크롤 저장위치 변수

    $('.ham-btn, .nav-bg').click(function () {
        $(this).toggleClass('on').siblings().toggleClass('on');
    })

    $('.nav-icon').click(function () {
        if ($(window).width() >= 768) {  // 괄호 추가
            $(this).toggleClass('on');
        }
    });



    // 게임별 현재 보여지는 영상 인덱스
    const currentVideoIndexes = {
        'CP2077': 0,
        'L4D2': 0,
        'OW': 0,
        'Yugioh': 0
    };

    // 한 번에 보여줄 영상 개수
    const videosToShow = 2;

    // 초기 상태: 첫 번째 게임 탭 활성화
    // $('.game-list h2:first').addClass('active');
    // $('#CP2077').css('display', 'flex');
    updateVideoDisplay('CP2077');

    // 게임 탭 클릭 이벤트
    $('.game-list h2').click(function () {
        // 탭 활성화
        $('.game-list h2').removeClass('active');
        $(this).addClass('active');

        // 모든 게임 영상 숨기기
        $('.game-video').hide();

        // 클릭한 탭에 해당하는 게임 영상 보이기
        const gameId = getGameId($(this).text().trim());
        $('#' + gameId).css('display', 'flex');

        // 해당 게임의 영상 업데이트
        updateVideoDisplay(gameId);
    });

    // 이전/다음 버튼 클릭 이벤트 연결
    $('.prev-video').click(function () {
        const gameId = $(this).closest('.game-video').attr('id');
        navigateVideos(gameId, -1);
    });

    $('.next-video').click(function () {
        const gameId = $(this).closest('.game-video').attr('id');
        navigateVideos(gameId, 1);
    });

    // 게임 이름으로 ID 가져오기
    function getGameId(gameName) {
        const idMap = {
            'Cyberpunk 2077': 'CP2077',
            'Left 4 Dead 2': 'L4D2',
            'OverWatch': 'OW',
            'Yu-gi-oh duel links': 'Yugioh'
        };
        return idMap[gameName];
    }

    // 영상 이동 함수
    function navigateVideos(gameId, direction) {
        const totalVideos = $('#' + gameId + ' .video-list li').length;
        let currentIndex = currentVideoIndexes[gameId];

        // 새 인덱스 계산 (최대 인덱스는 totalVideos - videosToShow)
        currentIndex += direction * videosToShow;

        // 범위 체크
        if (currentIndex < 0) {
            currentIndex = 0;
        } else if (currentIndex > totalVideos - videosToShow) {
            currentIndex = Math.max(0, totalVideos - videosToShow);
        }

        // 인덱스 저장 및 화면 업데이트
        currentVideoIndexes[gameId] = currentIndex;
        updateVideoDisplay(gameId);
    }

    // 영상 표시 업데이트
    function updateVideoDisplay(gameId) {
        const $videos = $('#' + gameId + ' .video-list li');
        const totalVideos = $videos.length;
        const currentIndex = currentVideoIndexes[gameId];

        // 모든 영상 숨기기
        $videos.hide();

        // 현재 인덱스부터 videosToShow개 보이기
        for (let i = currentIndex; i < currentIndex + videosToShow && i < totalVideos; i++) {
            $videos.eq(i).show();
        }

        // 카운터 업데이트
        const endIndex = Math.min(currentIndex + videosToShow, totalVideos);
        $('#' + gameId + ' .video-counter').text((currentIndex + 1) + ' - ' + endIndex + ' / ' + totalVideos);

        // 버튼 활성화/비활성화
        $('#' + gameId + ' .prev-video').prop('disabled', currentIndex === 0);
        $('#' + gameId + ' .next-video').prop('disabled', currentIndex + videosToShow >= totalVideos);
    }

    let gameImageIntervals = {}; // 각 게임별 setInterval ID를 저장할 객체

    // 게임 이미지 자동 전환 시작 함수 (범용)
    function activateGameImageTransition(gameId) {
        // 기존 interval이 있으면 정리 (다른 탭으로 이동 시 이전에 실행되던 거 멈춤)
        if (gameImageIntervals[gameId]) {
            clearInterval(gameImageIntervals[gameId]);
            delete gameImageIntervals[gameId]; // 객체에서도 삭제
        }

        const $gameImages = $('#' + gameId + '-content .game-changing-image');
        let currentImageIndex = 0;

        // 만약 이미지가 1개 이하이면 전환 로직 불필요 (보여줄 이미지가 없거나 하나뿐)
        if ($gameImages.length <= 1) return;

        // 초기 상태 설정: 모든 이미지 숨기고 첫 번째 이미지만 'active' 클래스 부여
        $gameImages.removeClass('active');
        $gameImages.eq(currentImageIndex).addClass('active');

        // 5초마다 이미지 전환 (시간은 원하는 대로 조절 가능! 1초 = 1000밀리초)
        gameImageIntervals[gameId] = setInterval(() => {
            $gameImages.eq(currentImageIndex).removeClass('active'); // 현재 이미지 'active' 제거
            currentImageIndex = (currentImageIndex + 1) % $gameImages.length; // 다음 이미지 인덱스 계산 (마지막 이미지면 다시 처음으로)
            $gameImages.eq(currentImageIndex).addClass('active'); // 다음 이미지에 'active' 부여
        }, 5000); // 5초 = 5000밀리초
    }

    // 게임 이미지 자동 전환 정지 함수 (범용)
    function deactivateGameImageTransition(gameId) {
        if (gameImageIntervals[gameId]) {
            clearInterval(gameImageIntervals[gameId]); // 실행 중인 interval 정지
            delete gameImageIntervals[gameId]; // 객체에서 해당 ID 삭제
        }
    }
    $('.game-content').hide();           // 모든 게임 콘텐츠 영역을 숨김
    $('.game-tab-item').removeClass('active'); // 모든 탭 메뉴의 active 클래스 제거
    $('.game-content').each(function () {
        const $wrapper = $(this).find('.game-illustration-wrapper');
        const $images = $wrapper.find('.game-changing-image');
        let currentIndex = 0;

        $images.removeClass('active');
        $images.eq(currentIndex).addClass('active');

        setInterval(function () {
            $images.eq(currentIndex).removeClass('active');
            currentIndex = (currentIndex + 1) % $images.length;
            $images.eq(currentIndex).addClass('active');
        }, 3000);
    });

    // --- ✨ Movie 세션 영상 팝업 모달 스크립트 시작 (최종 수정) ✨ ---
    const $videoModal = $('#videoModal');
    const $youtubePlayer = $('#youtubePlayer');
    const $modalCloseBtn = $videoModal.find('.modal-close-btn');

    let currentScrollPosition = 0; // 스크롤 위치를 저장할 변수
    let scrollbarWidth = 0;        // 스크롤바 너비를 저장할 변수

    // 문서 로드 시점에 스크롤바 너비 계산
    scrollbarWidth = getScrollbarWidth();
    // console.log("Root! 계산된 스크롤바 너비:", scrollbarWidth); // 디버깅용


    // 'open-youtube-modal' 클래스를 가진 링크 클릭 이벤트
    $(document).on('click', '.open-youtube-modal', function (e) {
        console.log("영상 링크 클릭됨!");
        e.preventDefault();

        const videoId = $(this).data('video-id');
        const videoTitle = $(this).text();

        if (videoId) {
            const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

            $youtubePlayer.attr('src', youtubeEmbedUrl);
            $videoModal.fadeIn(300);
            $videoModal.find('.video-title').empty();
            $videoModal.find('.video-title').text(videoTitle);

            // !!!!! 스크롤 위치 저장 및 스크롤 방지 변경 !!!!!
            currentScrollPosition = $(window).scrollTop(); // 현재 스크롤 위치 저장!
            $('html').css('scroll-behavior', 'smooth'); // 팝업창이 떴을떄 스크롤 고정
            $('body').addClass('modal-open'); // body에 modal-open 클래스 추가 (CSS에서 fixed)
            $('body').css({                   // body에 top, padding-right 직접 적용
                'top': -currentScrollPosition + 'px',
                'padding-right': scrollbarWidth + 'px' // 스크롤바 너비만큼 패딩
            });
            // !!!!! 변경 끝 !!!!!

        } else {
            console.warn("Root's scripts.js: data-video-id가 없어 영상을 재생할 수 없습니다. (아직 준비 중인 영상일 수 있습니다.)");
        }
    });

    // 모달 닫기 버튼 클릭 이벤트
    $modalCloseBtn.on('click', function () {
        console.log('Close button clicked!');
        closeVideoModal();
    });

    // 모달 오버레이 바깥 영역 클릭 시 닫기
    $videoModal.on('click', function (e) {
        if ($(e.target).is($videoModal)) { // 오버레이 자체를 클릭했는지 확인
            console.log('Overlay clicked!');
            closeVideoModal();
        }
    });

    // ESC 키 눌렀을 때 모달 닫기
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $videoModal.css('display') !== 'none') {
            console.log('ESC pressed!');
            closeVideoModal();
        }
    });

    // 영상 모달 닫는 함수
    function closeVideoModal() {
        console.log('closeVideoModal function called!');
        $videoModal.fadeOut(300, function () {
            $youtubePlayer.attr('src', 'about:blank');
            $videoModal.find('.video-title').empty();

            // !!!!! 스크롤 위치 복원 및 스크롤 해제 변경 !!!!!
            // body의 스타일 초기화!
            $('body').removeClass('modal-open');
            $('body').css({
                'top': '',
                'padding-right': ''
            });
            $('html').css('scroll-behavior', 'auto');  //팝업창 닫고 스크롤 점프 버그 방지

            // ⭐️ 스크롤 위치 복원 (setTimeout으로 렌더링 주기 후에 실행)
            setTimeout(function () {
                $(window).scrollTop(currentScrollPosition); // 저장된 위치로 스크롤!
            }, 1); // 1ms 지연 (이게 마지막 테스트에서 스크롤이 가장 안 튀었던 값)
            // !!!!! 변경 끝 !!!!!
        });
    }
    // --- ✨ Movie 세션 영상 팝업 모달 스크립트 끝 ✨ ---


    // 모달관련 
    // 사이버펑크 팁 모달 안에 있는 '갤러리 보기' 버튼 클릭 이벤트

    $(document).on('click', '.open-cp2077-gallery-btn', function () {
        console.log("Root's scripts.js: 사이버펑크 갤러리 보기 버튼 클릭됨!"); //작동 확인용

        const $modalContent = $(this).closest('#cp2077-tip-modal'); // 현재 모달 콘텐츠 div를 찾고
        const galleryItems = []; // Fancybox에 전달할 갤러리 아이템들을 모을 배열
        let startIndex = 0; // 갤러리 시작 시 보여줄 아이템의 인덱스

        // '#cp2077-tip-modal' 안의 'CP2077_gallery' 그룹 내 모든 '<a>' 태그를 찾아 처리합니다.
        $modalContent.find('div[data-fancybox="CP2077_gallery"] a').each(function (index) {
            const $item = $(this);
            const src = $item.attr('data-src'); // 'data-src' 속성 값 가져오기

            if (src && typeof src === 'string') { // 'data-src'가 유효한 문자열일 때만 처리합니다.
                let itemType = $item.attr('data-type');

                if (!itemType) { // 'data-type'이 없을 경우 'src' 값으로 타입을 유추합니다.
                    if (src.match && src.match(/\.(mp4|webm|ogg)$/i)) { itemType = 'video'; }
                    else if (src.match && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) { itemType = 'image'; }
                    else if (src.startsWith('https://www.youtube.com/embed/') || src.startsWith('https://www.youtube.com/watch?v=')) { itemType = 'iframe'; }
                    else { itemType = 'image'; } // 기본값
                }

                galleryItems.push({ src: src, type: itemType, caption: $item.attr('data-caption') });

                // 'cp2077-youtube-trigger' ID를 가진 영상 아이템 발견 시 시작점으로 설정
                if ($item.attr('id') === 'cp2077-youtube-trigger') {
                    startIndex = galleryItems.length - 1;
                }
            } else {
                console.warn(`Root's scripts.js: CP2077_gallery 그룹 내 아이템에 유효한 data-src 속성이 없습니다. (인덱스: ${index})`, $item[0]);
            }
        });

        if (galleryItems.length === 0) {
            console.warn("Root's scripts.js: Fancybox 갤러리에 유효한 아이템이 없습니다. HTML의 data-src 속성을 다시 확인해주세요.");
            return;
        }

        Fancybox.show(galleryItems, {
            startIndex: startIndex,
            groupAll: true, // 전달된 'galleryItems' 배열 전체를 하나의 그룹으로 취급
            Toolbar: true, loop: true, caption: true,
            caption: function (fancybox, slide) {
                return ('<div class="f-carousel__slide__caption">' + (slide.caption || slide.type) + "</div>");
            },
        });
    });

    // 오버워치 팁 모달 안에 있는 '갤러리 보기' 버튼 클릭 이벤트
    $(document).on('click', '.open-ow-gallery-btn', function () {
        console.log("Root's scripts.js: 오버워치 갤러리 보기 버튼 클릭됨!"); //작동 확인용

        const $modalContent = $(this).closest('#ow-tip-modal'); // 현재 모달 콘텐츠 div를 찾고
        const galleryItems = []; // Fancybox에 전달할 갤러리 아이템들을 모을 배열
        let startIndex = 0; // 갤러리 시작 시 보여줄 아이템의 인덱스

        // '#ow-tip-modal' 안의 'ow_gallery' 그룹 내 모든 '<a>' 태그를 찾아 처리합니다.
        $modalContent.find('div[data-fancybox="ow_gallery"] a').each(function (index) {
            const $item = $(this);
            const src = $item.attr('data-src'); // 'data-src' 속성 값 가져오기

            if (src && typeof src === 'string') { // 'data-src'가 유효한 문자열일 때만 처리합니다.
                let itemType = $item.attr('data-type');

                if (!itemType) { // 'data-type'이 없을 경우 'src' 값으로 타입을 유추합니다.
                    if (src.match && src.match(/\.(mp4|webm|ogg)$/i)) { itemType = 'video'; }
                    else if (src.match && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) { itemType = 'image'; }
                    else if (src.startsWith('https://www.youtube.com/embed/') || src.startsWith('https://www.youtube.com/watch?v=')) { itemType = 'iframe'; }
                    else { itemType = 'image'; } // 기본값
                }

                galleryItems.push({ src: src, type: itemType, caption: $item.attr('data-caption') });

                // 'ow-youtube-trigger' ID를 가진 영상 아이템 발견 시 시작점으로 설정
                if ($item.attr('id') === 'ow-youtube-trigger') {
                    startIndex = galleryItems.length - 1;
                }
            } else {
                console.warn(`Root's scripts.js: ow_gallery 그룹 내 아이템에 유효한 data-src 속성이 없습니다. (인덱스: ${index})`, $item[0]);
            }
        });

        if (galleryItems.length === 0) {
            console.warn("Root's scripts.js: Fancybox 갤러리에 유효한 아이템이 없습니다. HTML의 data-src 속성을 다시 확인해주세요.");
            return;
        }

        Fancybox.show(galleryItems, {
            startIndex: startIndex,
            groupAll: true, // 전달된 'galleryItems' 배열 전체를 하나의 그룹으로 취급
            Toolbar: true, loop: true, caption: true,
            caption: function (fancybox, slide) {
                return ('<div class="f-carousel__slide__caption">' + (slide.caption || slide.type) + "</div>");
            },
        });
    });

    // 레포데 팁 모달 안에 있는 '갤러리 보기' 버튼 클릭 이벤트
    $(document).on('click', '.open-L4D-gallery-btn', function () {
        console.log("Root's scripts.js: 레포데 갤러리 보기 버튼 클릭됨!"); //작동 확인용

        const $modalContent = $(this).closest('#L4D-tip-modal'); // 현재 모달 콘텐츠 div를 찾고
        const galleryItems = []; // Fancybox에 전달할 갤러리 아이템들을 모을 배열
        let startIndex = 0; // 갤러리 시작 시 보여줄 아이템의 인덱스

        // '#L4D-tip-modal' 안의 'L4D_gallery' 그룹 내 모든 '<a>' 태그를 찾아 처리합니다.
        $modalContent.find('div[data-fancybox="L4D_gallery"] a').each(function (index) {
            const $item = $(this);
            const src = $item.attr('data-src'); // 'data-src' 속성 값 가져오기

            if (src && typeof src === 'string') { // 'data-src'가 유효한 문자열일 때만 처리합니다.
                let itemType = $item.attr('data-type');

                if (!itemType) { // 'data-type'이 없을 경우 'src' 값으로 타입을 유추합니다.
                    if (src.match && src.match(/\.(mp4|webm|ogg)$/i)) { itemType = 'video'; }
                    else if (src.match && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) { itemType = 'image'; }
                    else if (src.startsWith('https://www.youtube.com/embed/') || src.startsWith('https://www.youtube.com/watch?v=')) { itemType = 'iframe'; }
                    else { itemType = 'image'; } // 기본값
                }

                galleryItems.push({ src: src, type: itemType, caption: $item.attr('data-caption') });

                // 'L4D-youtube-trigger' ID를 가진 영상 아이템 발견 시 시작점으로 설정
                if ($item.attr('id') === 'L4D-youtube-trigger') {
                    startIndex = galleryItems.length - 1;
                }
            } else {
                console.warn(`Root's scripts.js: L4D_gallery 그룹 내 아이템에 유효한 data-src 속성이 없습니다. (인덱스: ${index})`, $item[0]);
            }
        });

        if (galleryItems.length === 0) {
            console.warn("Root's scripts.js: Fancybox 갤러리에 유효한 아이템이 없습니다. HTML의 data-src 속성을 다시 확인해주세요.");
            return;
        }

        Fancybox.show(galleryItems, {
            startIndex: startIndex,
            groupAll: true, // 전달된 'galleryItems' 배열 전체를 하나의 그룹으로 취급
            Toolbar: true, loop: true, caption: true,
            caption: function (fancybox, slide) {
                return ('<div class="f-carousel__slide__caption">' + (slide.caption || slide.type) + "</div>");
            },
        });
    });

    // 유희왕 팁 모달 안에 있는 '갤러리 보기' 버튼 클릭 이벤트
    $(document).on('click', '.open-YUGIOH-gallery-btn', function () {
        console.log("Root's scripts.js: 유희왕 갤러리 보기 버튼 클릭됨!"); //작동 확인용

        const $modalContent = $(this).closest('#YUGIOH-tip-modal'); // 현재 모달 콘텐츠 div를 찾고
        const galleryItems = []; // Fancybox에 전달할 갤러리 아이템들을 모을 배열
        let startIndex = 0; // 갤러리 시작 시 보여줄 아이템의 인덱스

        // '#YUGIOH-tip-modal' 안의 'YUGIOH_gallery' 그룹 내 모든 '<a>' 태그를 찾아 처리합니다.
        $modalContent.find('div[data-fancybox="YUGIOH_gallery"] a').each(function (index) {
            const $item = $(this);
            const src = $item.attr('data-src'); // 'data-src' 속성 값 가져오기

            if (src && typeof src === 'string') { // 'data-src'가 유효한 문자열일 때만 처리합니다.
                let itemType = $item.attr('data-type');

                if (!itemType) { // 'data-type'이 없을 경우 'src' 값으로 타입을 유추합니다.
                    if (src.match && src.match(/\.(mp4|webm|ogg)$/i)) { itemType = 'video'; }
                    else if (src.match && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) { itemType = 'image'; }
                    else if (src.startsWith('https://www.youtube.com/embed/') || src.startsWith('https://www.youtube.com/watch?v=')) { itemType = 'iframe'; }
                    else { itemType = 'image'; } // 기본값
                }

                galleryItems.push({ src: src, type: itemType, caption: $item.attr('data-caption') });

                // 'YUGIOH-youtube-trigger' ID를 가진 영상 아이템 발견 시 시작점으로 설정
                if ($item.attr('id') === 'YUGIOH-youtube-trigger') {
                    startIndex = galleryItems.length - 1;
                }
            } else {
                console.warn(`Root's scripts.js: YUGIOH_gallery 그룹 내 아이템에 유효한 data-src 속성이 없습니다. (인덱스: ${index})`, $item[0]);
            }
        });

        if (galleryItems.length === 0) {
            console.warn("Root's scripts.js: Fancybox 갤러리에 유효한 아이템이 없습니다. HTML의 data-src 속성을 다시 확인해주세요.");
            return;
        }

        Fancybox.show(galleryItems, {
            startIndex: startIndex,
            groupAll: true, // 전달된 'galleryItems' 배열 전체를 하나의 그룹으로 취급
            Toolbar: true, loop: true, caption: true,
            caption: function (fancybox, slide) {
                return ('<div class="f-carousel__slide__caption">' + (slide.caption || slide.type) + "</div>");
            },
        })
    })

    console.log("Root's scripts.js: Intersection Observer 정의 시작!");

    const $scrollPager = $('.scroll-pager'); // 스크롤 페이저 요소!
    const $footer = $('footer');             // 푸터 요소
    const footerElement = $footer[0];        // Intersection Observer는 순수 DOM 요소를 필요로 함

    // 🚨 조건 확인 로그 추가! (어떤 조건 때문에 초기화가 안 되는지 확인용)
    console.log("Root's scripts.js: 스크롤 페이저 존재?", $scrollPager.length > 0);
    console.log("Root's scripts.js: 푸터 존재?", $footer.length > 0);
    console.log("Root's scripts.js: 푸터 DOM 요소:", footerElement);
    console.log("Root's scripts.js: Intersection Observer 지원?", 'IntersectionObserver' in window);
    console.log("Root's scripts.js: 현재 창 너비 (PC 기준)?", $(window).width() > 768);

    // 모든 조건이 충족될 때만 Intersection Observer 초기화
    if ($scrollPager.length > 0 && footerElement && 'IntersectionObserver' in window && $(window).width() > 768) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log("Root's scripts.js: Observer Entry:", entry); // 각 엔트리 정보 찍어보기!
                // 푸터가 10% 이상 화면에 보이면 스크롤 페이저 숨기기
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    console.log("Root's scripts.js: 푸터 보임! 페이저 숨김!");
                    $scrollPager.fadeOut(200); // 부드럽게 사라지게
                } else {
                    // 푸터가 충분히 화면에서 벗어나면 스크롤 페이저 다시 보이게 (단, PC일 때만)
                    if ($(window).width() > 768) {
                        console.log("Root's scripts.js: 푸터 안 보임! 페이저 보임!");
                        $scrollPager.fadeIn(200); // 부드럽게 다시 나타나게
                    }
                }
            });
        }, {
            threshold: 0.1 // 푸터가 뷰포트의 10% 정도 보이기 시작하면 콜백 함수 실행
        });

        // 푸터 요소를 관찰 시작
        observer.observe(footerElement);
        console.log("Root's scripts.js: Intersection Observer 시작됨. 푸터 관찰 중!");
    } else {
        console.log("Root's scripts.js: Intersection Observer 초기화 조건 미달!", {
            $scrollPagerExists: $scrollPager.length > 0,
            footerElementExists: !!footerElement,
            observerSupported: 'IntersectionObserver' in window,
            isPCWidth: $(window).width() > 768
        });
    }

    console.log("Root's scripts.js: Intersection Observer 정의 완료!");

    // --------------------------------------------------------------------
    // ✨ 창 크기 변경 (resize) 이벤트 처리 ✨
    // --------------------------------------------------------------------
    $(window).on('resize', function () {
        console.log("Root's scripts.js: 창 크기 변경됨! 현재 너비:", $(window).width());
        if ($(window).width() <= 768) {
            console.log("Root's scripts.js: 모바일 너비 감지, 페이저 숨김");
            $scrollPager.hide();
        } else {
            console.log("Root's scripts.js: PC 너비 감지, 푸터 가시성 재확인");
            // PC 너비로 변경되었을 때, Intersection Observer의 상태를 강제로 동기화.
            // 푸터가 보이지 않는 상태면 페이저를 다시 보이게 함.
            if (footerElement && 'IntersectionObserver' in window) {
                const tempObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) {
                            $scrollPager.fadeIn(200);
                        } else {
                            $scrollPager.fadeOut(200);
                        }
                    });
                    tempObserver.disconnect(); // 한 번 확인 후 바로 해제
                });
                tempObserver.observe(footerElement);
            }
        }
    });

    // --------------------------------------------------------------------
    // ✨ 페이지 로드 시 초기 상태 설정 ✨
    // --------------------------------------------------------------------
    if ($(window).width() <= 768) {
        console.log("Root's scripts.js: 초기 로드: 모바일 너비, 페이저 숨김");
        $scrollPager.hide();
    } else {
        console.log("Root's scripts.js: 초기 로드: PC 너비, 옵저버 로직에 따라 처리");
        // 이 부분은 Intersection Observer가 자동으로 푸터를 관찰하기 시작하므로
        // 별도의 초기화 로직은 필요 없음. (observer.observe(footerElement); 에서 처리)
    }
});