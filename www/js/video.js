function init_video_event() {
    $(".close").on('click', function(e) {
        closeAllModals();
    });

    $('.btnVideo').on('click',function(e){
        //clicking back btn takes you to dashboard
        // showBackButton('dashboard');
        // showATab('takeVideo');
        $("#videoInfo").addClass("is-visible")
    });

    $("#videoInfo .btnOk").on('click', function(e) {
        alert("Take video");
    });
}
