//modal open
$('.buyButton').click(function(){
  var content = $(this).parent().parent().children(':first-child').html();
  var points = $(this).next().text();
  points =points.slice(0, -7);
  $('input[name="b-quantity"]').val(1);
  $('.mini.buying.modal .header').html(content);
  $('.mini.buying.modal .description1').text('Total Points Needed : '+ (Math.round(points* 100) / 100) );
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
          window.location.reload();
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
  $('.mini.selling.modal .description1').text('Total Points Needed : '+ (Math.round(points* 100) / 100) );
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
          window.location.reload();
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
              $(this).parent().parent().parent().parent().children('.description1').text('Total Points Needed : '+ (Math.round(price*quantity* 100) / 100) );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Points Needed : '+ (Math.round(price*quantity* 100) / 100) );
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
              $(this).parent().parent().parent().parent().children('.description1').text('Total Points Needed : '+ (Math.round(price*quantity* 100) / 100) );

            } else {
              $('input[name='+fieldName+']').val(1);

              var quantity =$('input[name='+category+'quantity'+']').val();
              var price =$('input[name='+category+'price'+']').val();
              $(this).parent().parent().parent().parent().children('.description1').text('Total Points Needed : '+ (Math.round(price*quantity* 100) / 100) );
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