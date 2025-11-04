// 게임 세션 일러스트 5초 후 변환되는 트리거 일부분.

$('.game-tab-item').on('click', function () {
    const gameId = $(this).data('game');
    $('.game-content').hide().removeClass('active');
    $('#' + gameId + '-content').show().addClass('active');
    $('.game-tab-item').removeClass('active');
    $(this).addClass('active');

    // 필요 시 이미지 전환 등 추가 작업
});