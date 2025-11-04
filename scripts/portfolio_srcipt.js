// jscripts/portfolio-swiper.js
const myPortfolioSwiper = new Swiper('.myPortfolioSwiper', {
    // 💡 필수 옵션 💡
    direction: 'horizontal', // 슬라이드 방향: 'horizontal' (가로) 또는 'vertical' (세로)
    loop: true,              // 무한 반복 슬라이드

    // 💡 자동 재생 (Autoplay) 설정 (핵심!) 💡
    autoplay: {
        delay: 3000,                    // 3초(3000ms)마다 슬라이드 변경
        disableOnInteraction: false,    // 사용자(마우스 클릭/드래그 등)가 슬라이드 조작 후에도 자동 재생 계속
    },

    // 💡 추가적인 옵션 (선택 사항) 💡
    slidesPerView: 1, // 한 번에 보여줄 슬라이드 개수
    spaceBetween: 30, // 슬라이드 간의 간격 (px)

    // 만약 네비게이션 버튼을 HTML에 넣었다면 (swiper-button-next, swiper-button-prev)
    navigation: {
        nextEl: '.swiper-button-next', // 다음 버튼 셀렉터
        prevEl: '.swiper-button-prev', // 이전 버튼 셀렉터
    },

    // 만약 페이지네이션(점들)을 HTML에 넣었다면 (swiper-pagination)
    pagination: {
        el: '.swiper-pagination', // 페이지네이션 컨테이너 셀렉터
        clickable: true,          // 페이지네이션 점 클릭으로 슬라이드 이동 가능
    },

    // 💡 반응형 설정 (선택 사항) 💡
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});