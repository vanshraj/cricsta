 $(window).on('load', function () {
  clockData();
 });
//ajax calls
function clockData() {
    // run your ajax call here
  $.ajax({
  type: 'POST',
  url: "/game/account",
  dataType: 'json'
  })
    .done(function(time) {
      runClock(time);
      setTimeout(clockData, 60000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      // setTimeout(PlayerData, 1000);
      window.location.reload();
    });
}

var x;
function runClock(time){
    // console.log(d);
    clearInterval(x);
    var countDownDate = new Date(time).getTime();

    $('.gamestart').addClass('disabled');
    // Update the count down every 1 second
    x = setInterval(function() {
        // Get todays date and time
        var now = new Date().getTime();
        
        // Find the distance between now an the count down date
        var distance = countDownDate - now - 60*1000*15;
        
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var y = hours + "h "+ minutes + "m " + seconds + "s to start";
        // Output the result in an element with id="demo"
        $('.gamestart').text(y);
        
        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            $('.gamestart').text("Get Started");
            $('.gamestart').removeClass('disabled');
        }
    }, 1000);
}
