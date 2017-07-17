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
      window.alert('Bought');
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
      window.alert('Sold');
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