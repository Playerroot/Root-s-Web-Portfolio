console.log("Fancybox binding initiated!");
Fancybox.bind("[data-fancybox]", {
    Toolbar: true,
    loop: true,
    caption: true,
    caption: function (fancybox, slide) {
        return (
            '<div class="f-carousel__slide__caption">' +
            (slide.caption || slide.type) +
            "</div>"
        );
    },
});