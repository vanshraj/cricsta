 $(window).on('load', function () {
  UserData();
 });

//ajax calls
function PlayerData() {
    // run your ajax call here
  $.ajax({
  type: 'GET',
  url: "/game/player",
  dataType: 'json'
  })
    .done(function(data) {
      updatePlayers(data);
      setTimeout(PlayerData, 1000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      // setTimeout(PlayerData, 1000);
      window.location.reload();
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
      PlayerData();
      // setTimeout(UserData, 1000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      window.location.reload();
    });
}
//table changes
function updatePlayers(data){

  $.each( data.team1players, function(index, player){
    var pname = player.name;
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var points = (Math.round(player.points* 100) / 100)
    $(querystring).text(points+' Points');
  });

  $.each( data.team2players, function(index, player){
    var pname = player.name;
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var points = (Math.round(player.points* 100) / 100)
    $(querystring).text(points+ ' Points');
  });

  $('.buyTBody tr').each(function(){

    var pname=$(this).children().html();
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var currentVal = $(querystring).text();

    currentVal =currentVal.slice(0, -7);
    $(this).children('.currentPosition').text(currentVal);

    var boughtPrice=$(this).children('.boughtPrice').text();
    var boughtQty=$(this).children('.boughtQty').text();
    var currentProfit = currentVal - boughtPrice;
    currentProfit *= boughtQty;
    currentProfit = (Math.round(currentProfit* 100) / 100)

    $(this).children('.currentProfit').text(currentProfit);

    if(currentProfit > 0){
      $('.currentProfit').addClass('positive');
      $('.currentProfit').removeClass('negative');
    }else if(currentProfit < 0){
      $('.currentProfit').removeClass('positive');
      $('.currentProfit').addClass('negative');
    }else{
      $('.currentProfit').removeClass('positive');
      $('.currentProfit').removeClass('negative');
    }
    
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
      buystring += "<tr player-name='"+buy.name+"'><td>"+buy.name+"</td><td class='boughtQty'>"+buy.quantity+"</td><td class='currentPosition'>Something</td><td class='boughtPrice'>"+(Math.round(buy.price* 100) / 100)+"</td><td class='currentProfit'>Something</td></tr>";
    });

    user_data.sell.forEach(function(sell){
      var closedProfit =(Math.round(sell.quantity*(sell.price-sell.buyprice)* 100) / 100);
      var theclass='';
      if(closedProfit > 0){
        theclass='positive';
      }else if(closedProfit < 0){
        theclass='negative'; 
      }
      sellstring += "<tr><td>"+sell.name+"</td><td>"+sell.quantity+"</td><td>"+(Math.round(sell.price* 100) / 100)+"</td><td>"+(Math.round(sell.buyprice* 100) / 100)+"</td><td class='"+theclass+"'>"+closedProfit+"</td></tr>";
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
      stocks += (buy.price*buy.quantity)
    });
    // user_data.sell.forEach(function(sell) {
    //   stocks += (*sell.quantity)
    // });   

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
  var points = $(this).parent().prev().text();
  points =points.slice(0, -7);
  $('input[name="b-quantity"]').val(1);
  $('.mini.buying.modal .header').html(content);
  $('.mini.buying.modal .description1').text('Total Cash Needed : '+ (Math.round(points*100) / 100)+' Inr' );
  $('.mini.buying.modal .bPrice input').val((Math.round(points*100) / 100));
  $('.mini.buying.modal')
  .modal('show')
  ;  
});

$('.mini.buying.modal')
  .modal({
    onApprove : function() {
      var bquantity= $('input[name=b-quantity]').val();
      var bprice= $('input[name=b-price]').val();
      var ubalance= $('.UserBalance').text();
      ubalance = ubalance.slice(0, -4);
      ubalance -= bquantity*bprice;
      if(ubalance<0){
        window.alert("You don't have the required balance.");
      }else{
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
      }
      
});

$('.sellButton').click(function(){
  var content = $(this).parent().parent().children(':first-child').html();
  var points = $(this).parent().prev().text();
  points =points.slice(0, -7);
  $('input[name="s-quantity"]').val(1);
  $('.mini.selling.modal .header').html(content);
  $('.mini.selling.modal .description1').text('Total Cash Returning : '+ (Math.round(points*100) / 100) +' Inr');
  $('.mini.selling.modal .sPrice input').val((Math.round(points*100) / 100));
  $('.modal.selling')
  .modal('show')
  ;  
});

$('.mini.selling.modal')
  .modal({
    onApprove : function() {
      var pname = $('.mini.selling.modal .header').text().slice(2)
      var querystring ='tr[player-name="'+pname+'"]';
      var formData={
        quantity: $('input[name=s-quantity]').val(),
        price: $('input[name=s-price]').val(),
        name: $('.mini.selling.modal .header').text().slice(2),
        buyprice: $(querystring).children().next().next().next().html()
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


//twice button
$('.twiceButton').click(function(e){
            e.preventDefault();
            fieldName = $(this).attr('field');

            var category = fieldName.slice(0,2);

            var currentVal = parseInt($('input[name='+fieldName+']').val());
            if (!isNaN(currentVal)) {
              $('input[name='+fieldName+']').val(2);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Cash : '+ (Math.round(quantity* price*100) / 100)+' Inr' );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Cash : '+ (Math.round(quantity* price*100) / 100) );
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