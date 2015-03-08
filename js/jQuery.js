/**
 * Created by camer_000 on 10/21/2014.
 */
/*position basket vertically and stop 313px from the top*/
$(window).scroll(function(){
    $("#RIGHT_BOTTOM_GRAY_PANEL2").css("top",Math.max(0,313-$(this).scrollTop()));
});
/*position basket horizontally absolute*/
$(window).load(function(event) {
    $("#RIGHT_BOTTOM_GRAY_PANEL2").css("margin-left", 706-$(document).scrollLeft());
});