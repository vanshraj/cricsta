 $(window).on('load', function () {
  UserData();
  PlayerData();
  $('.ui.hidden.divider').hide();
  $('.ui.small.menu').each(function(){
    $(this).removeClass('fixed');
  });
 });

var userG;

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
      setTimeout(PlayerData, 500);
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
      userG=user_data;
      UpdateUser(user_data);
      // setTimeout(UserData, 1000);
    })
    .fail(function() {
      console.log("Ajax failed to fetch data ");
      window.location.reload();
    });
}
//table changes
function updatePlayers(data){

  if(data.transfer){
    //enable buttons
    var countDownDate = new Date(data.timestamp).getTime();
    countDownDate+=60*1000;

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // If the count down is over, write some text 
    if (distance < 0) {
      //disable buttons
      $('.buyButton').each(function(){
        $(this).addClass('disabled');
      });
      $('.sellButton').each(function(){
        $(this).addClass('disabled');
      });
      $('.ui.positive.right.labeled.icon.button').each(function(){
        $(this).addClass('disabled');
      });
      $('.transferGreen').addClass('transferRed').removeClass('transferGreen');
      //although green but time over show balls
      $('.countdown').text(Math.round(data.balls) + " balls remaining");
    }else{

      $('.buyButton').each(function(){
        $(this).removeClass('disabled');
      });
      $('.sellButton').each(function(){
        $(this).removeClass('disabled');
      });

      $('.transferRed').addClass('transferGreen').removeClass('transferRed');

      $('.ui.positive.right.labeled.icon.button').each(function(){
        $(this).removeClass('disabled');
      });
      //show time remaining
      $('.countdown').text(minutes + "m " + seconds + "s ");
    }
  }
  else{
    //disable buttons
    $('.buyButton').each(function(){
      $(this).addClass('disabled');
    });
    $('.sellButton').each(function(){
      $(this).addClass('disabled');
    });
    $('.ui.positive.right.labeled.icon.button').each(function(){
      $(this).addClass('disabled');
    });
    $('.transferGreen').addClass('transferRed').removeClass('transferGreen');
    $('.countdown').text(Math.round(data.balls) +" balls remaining.");
  }

  var stocks=0;
  var userprofit=0;

  $.each( data.team1players, function(index, player){
    var pname = player.name;
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var points = (Math.round(player.points));
    $(querystring).text(points+' Points');
  });

  $.each( data.team2players, function(index, player){
    var pname = player.name;
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var points = (Math.round(player.points));
    $(querystring).text(points+ ' Points');
  });



  var toptenplayer=[];
  $('.userplayers').each(function(){
    var val=0;
    var name=$(this).children('.userplayername').text();
    val += parseInt($(this).children('.userbalance').text());
    $(this).children('.userbuyname').each(function(){
      var pname=$(this).attr('p');
      var qty=$(this).attr('q');
      var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
      var currentVal = $(querystring).text();
      currentVal =currentVal.slice(0, -7);
      val +=parseInt(currentVal*qty);
    });
    toptenplayer.push({"name":name, "points":val})
  });

  toptenplayer = _.sortBy(toptenplayer,'points');
  toptenplayer = _.reverse(toptenplayer);
  toptenplayer = _.slice(toptenplayer,0,10);
  leaderstring="";
  toptenplayer.forEach(function(player,i){
      leaderstring += "<tr><td>"+parseInt(i+1)+"</td><td>"+player.name+"</td><td>"+player.points+"</td></tr>";
  });
  $('.leaderbody').html(leaderstring);




  $('.buyTBody tr').each(function(){

    var pname=$(this).children().html();
    var querystring ='tr[p-name="'+pname+'"] .currentPoints p';
    var currentVal = $(querystring).text();

    currentVal =currentVal.slice(0, -7);
    // console.log(currentVal);

    $(this).children('.currentPosition').text(currentVal);

    var boughtPrice=$(this).children('.boughtPrice').text();
    var boughtQty=$(this).children('.boughtQty').text();
    stocks+=currentVal*boughtQty;
    var currentProfit = currentVal - boughtPrice;
    currentProfit *= boughtQty;
    currentProfit = (Math.round(currentProfit));
    $(this).children('.currentProfit').text(currentProfit);

    userprofit+=currentProfit;
    if(currentProfit > 0){
      $(this).children('.currentProfit').addClass('positive');
      $(this).children('.currentProfit').removeClass('negative');
    }else if(currentProfit < 0){
      $(this).children('.currentProfit').removeClass('positive');
      $(this).children('.currentProfit').addClass('negative');
    }else{
      $(this).children('.currentProfit').removeClass('positive');
      $(this).children('.currentProfit').removeClass('negative');
    }
    
  });

  $('.sellTBody tr').each(function(){
    userprofit+=parseInt($(this).children('.closedProfit').text());
  });

  $('.UserStock').text((Math.round(stocks))+ " Chips");
  $('.UserProfit').text((Math.round((userprofit))) +" Chips");
    
    if(userprofit > 0){
      $('.UserProfit').addClass('positive');
      $('.UserProfit').removeClass('negative');
    }else if(userprofit < 0){
      $('.UserProfit').removeClass('positive');
      $('.UserProfit').addClass('negative');
    }else{
      $('.UserProfit').removeClass('positive');
      $('.UserProfit').removeClass('negative');
    }
  
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
      buystring += "<tr player-name='"+buy.name+"'><td>"+buy.name+"</td><td><div onclick='sellButtonFun(this)', class='ui button red mini inverted sellButton disabled'>Sell</div></td><td class='boughtQty'>"+buy.quantity+"</td><td class='currentPosition'>"+buy.price+"</td><td class='boughtPrice'>"+(Math.round(buy.price))+"</td><td class='currentProfit'>"+0+"</td></tr>";
    });

    user_data.sell.forEach(function(sell){
      var closedProfit =(Math.round(sell.quantity*(sell.price-sell.buyprice)));
      var theclass='';
      if(closedProfit > 0){
        theclass='positive closedProfit';
      }else if(closedProfit < 0){
        theclass='negative closedProfit'; 
      }else{
        theclass='closedProfit';
      }
      sellstring += "<tr><td>"+sell.name+"</td><td>"+sell.quantity+"</td><td>"+(Math.round(sell.price))+"</td><td>"+(Math.round(sell.buyprice))+"</td><td class='"+theclass+"'>"+closedProfit+"</td></tr>";
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

    $('.UserBalance').text((Math.round((user_data.balance))) +" Chips");

  }
}



//modal open
$('.buyButton').click(function(){
  var content = $(this).parent().parent().children(':first-child').html();
  var points = $(this).parent().prev().text();
  points =points.slice(0, -7);
  $('input[name="b-quantity"]').val(1);
  $('.mini.buying.modal .header').html(content);
  $('.mini.buying.modal .description1').text('Total Cash Needed : '+ (Math.round(points))+' Chips' );
  $('.mini.buying.modal .bPrice input').val((Math.round(points)));
  $('.mini.buying.modal')
  .modal('show')
  ;  
});

function sellButtonFun(element){
  var content = $(element).parent().parent();
  var points = content.children('.currentPosition').text();
  content = content.attr('player-name');
  $('input[name="s-quantity"]').val(1);
  $('.mini.selling.modal .header').text(content);
  $('.mini.selling.modal .description1').text('Total Cash Returning : '+ (Math.round(points)) +' Chips');
  $('.mini.selling.modal .sPrice input').val((Math.round(points)));
  $('.modal.selling')
  .modal('show')
  ;  
}



$('.mini.buying.modal')
  .modal({
    onApprove : function() {
      var bquantity= $('input[name=b-quantity]').val();
      var bprice= $('input[name=b-price]').val();
      var bname= $('.mini.buying.modal .header').text().slice(2);
      var ubalance= $('.UserBalance').text();
      ubalance = ubalance.slice(0, -6);
      ubalance -= bquantity*bprice;
      
      var flag=0;
      userG.buy.forEach(function(buy){
        if(buy.name==bname){
          if((parseInt(buy.quantity)+parseInt(bquantity))>2){
            flag=1;
          }
        }
      });


      if(flag||bquantity>2||bquantity<0){
        window.alert("You can only hold atmost 2 stocks of a player.");
      }
      else if(ubalance<0){
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

$('.mini.selling.modal')
  .modal({
    onApprove : function() {
      var pname = $('.mini.selling.modal .header').text();
      var querystring ='tr[player-name="'+pname+'"]';
      var formData={
        quantity: $('input[name=s-quantity]').val(),
        price: $('input[name=s-price]').val(),
        name: $('.mini.selling.modal .header').text(),
        buyprice: $(querystring).children('.boughtPrice').text()
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
              $(this).parent().parent().parent().parent().children('.description1').text('Total Cash : '+ (Math.round(quantity* price))+' Chips' );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Cash : '+ (Math.round(quantity* price)) );
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