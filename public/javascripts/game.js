 $(window).on('load', function () {
  UserData();
  // PlayerData();
 });

//ajax calls
function PlayerData() {
    // run your ajax call here
    $.ajax({
  type: 'POST',
  url: "/game/player",
  dataType: 'json'
  })
    .done(function(data) {
      updatePlayers(data);
      setTimeout(PlayerData, 1000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      // window.location.reload();
    });
}

function UserData() {
    // run your ajax call here
    $.ajax({
  type: 'POST',
  url: "/game/user",
  dataType: 'json'
  })
    .done(function(user_data) {
      UpdateUser(user_data);
      // setTimeout(UserData, 1000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      // window.location.reload();
    });
}

//ui changes
function UpdateUser(user_data){

    if(!user_data.name){
    if(user_data.buy.length > 0){
      $('.BuyPositionTable').show();
      $('.NoBuyPosition').hide();
    }else{
      $('.BuyPositionTable').hide();
      $('.NoBuyPosition').show();
    }

    var buystring="";
    var sellstring="";

    user_data.buy.forEach(function(buy){
      buystring += "<tr><td>"+buy.name+"</td><td>"+buy.quantity+"</td><td>Something</td><td>"+buy.price+"</td><td>Something</td></tr>";
    });

    user_data.sell.forEach(function(sell){
      sellstring += "<tr><td>"+sell.name+"</td><td>"+sell.quantity+"</td><td>Something</td><td>"+sell.price+"</td><td>Something</td></tr>";
    });

    $('.sellTBody').html(sellstring);
    $('.buyTBody').html(buystring);

    if(user_data.sell.length > 0){
      $('.SellPositionTable').show();
      $('.NoSellPosition').hide();
    }else{
      $('.SellPositionTable').hide();
      $('.NoSellPosition').show();
    }

    var stocks=0
    user_data.buy.forEach(function(buy) {
      stocks += (100*buy.quantity)
    });
    user_data.sell.forEach(function(sell) {
      stocks += (100*sell.quantity)
    });   

    $('.UserBalance').text((Math.round((user_data.balance)* 100) / 100) +" Inr");
    $('.UserProfit').text((Math.round((user_data.profit)*100) / 100) +" Inr");
    $('.UserStock').text((Math.round(stocks*100) / 100)+ " Inr");

    if(user_data.profit > 0){
      $('.UserProfit').addClass('positive');
      $('.UserProfit').removeClass('negative');
    }else if(user_data.profit < 0){
      $('.UserProfit').removeClass('positive');
      $('.UserProfit').addClass('negative');
    }else{
      $('.UserProfit').removeClass('positive');
      $('.UserProfit').removeClass('negative');
    }

  }
}



//modal open
$('.buyButton').click(function(){
  var content = $(this).parent().parent().children(':first-child').html();
  var points = $(this).next().text();
  points =points.slice(0, -7);
  $('input[name="b-quantity"]').val(1);
  $('.mini.buying.modal .header').html(content);
  $('.mini.buying.modal .description1').text('Total Margin Needed : '+ (Math.round(100*100) / 100)+' Inr' );
  $('.mini.buying.modal .bPrice input').val(points);
  $('.mini.buying.modal')
  .modal('show')
  ;  
});

$('.mini.buying.modal')
  .modal({
    onApprove : function() {
      var formData={
        quantity: $('input[name=b-quantity]').val(),
        price: $('input[name=b-price]').val(),
        name: $('.mini.buying.modal .header').text().slice(2)
      };
      $.ajax({
          type: 'POST',
          url: "/game/buy",
          data: formData,
          dataType: 'json'
        })
        .done(function(data) {
          UserData();
          // window.location.reload();
        })
        .fail(function() {
          console.log("Ajax failed to fetch data");
        });
      }
});

$('.sellButton').click(function(){
  var content = $(this).parent().parent().children(':first-child').html();
  var points = $(this).prev().text();
  points =points.slice(0, -7);
  $('input[name="s-quantity"]').val(1);
  $('.mini.selling.modal .header').html(content);
  $('.mini.selling.modal .description1').text('Total Margin Needed : '+ (Math.round(100*100) / 100) +' Inr');
  $('.mini.selling.modal .sPrice input').val(points);
  $('.modal.selling')
  .modal('show')
  ;  
});

$('.mini.selling.modal')
  .modal({
    onApprove : function() {
      var formData={
        quantity: $('input[name=s-quantity]').val(),
        price: $('input[name=s-price]').val(),
        name: $('.mini.selling.modal .header').text().slice(2)
      };
      $.ajax({
          type: 'POST',
          url: "/game/sell",
          data: formData,
          dataType: 'json'
        })
        .done(function(data) {
          UserData();
          // window.location.reload();
        })
        .fail(function() {
          console.log("Ajax failed to fetch data");
        });
      }
});


//plus minus in modal
$('.plusButton').click(function(e){
            e.preventDefault();
            fieldName = $(this).attr('field');

            var category = fieldName.slice(0,2);

            var currentVal = parseInt($('input[name='+fieldName+']').val());
            if (!isNaN(currentVal)) {

              $('input[name='+fieldName+']').val(currentVal + 1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Margin Needed : '+ (Math.round(quantity* 100*100) / 100)+' Inr' );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Margin Needed : '+ (Math.round(quantity* 100*100) / 100)+' Inr' );
            }
        });
$('.minusButton').click(function(e){
            e.preventDefault();
            fieldName = $(this).attr('field');

            var category = fieldName.slice(0,2);

            var currentVal = parseInt($('input[name='+fieldName+']').val());
            if (!isNaN(currentVal)) {
              $('input[name='+fieldName+']').val(currentVal - 1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Margin Needed : '+ (Math.round(quantity* 100*100) / 100)+' Inr' );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Margin Needed : '+ (Math.round(quantity* 100) / 100) );
            }
        });

//semantic popups
$('.info.circle.icon')
  .popup({
    inline: true,
  })
;
$('.help.circle.outline.icon')
  .popup({
    inline: true,
  })
;