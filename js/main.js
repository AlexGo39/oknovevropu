$(function () {
   
    $('.mobile__menu').click(function(event){
        $('.mobile__menu,.mobile__menu--nav').toggleClass('active');
    });


    // Slider
        $('.slider').slick({
            arrows: true,
            dots: true,
            infinite: true,
            draggable: true,
            slidesToShow: 1,
            variableWidth: true,
            centerMode: true
            
        });


});