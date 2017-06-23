//Google analytics scripts
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-101117440-1', 'auto');
  ga('send', 'pageview');


//semantic scripts

//mobile menu
$('.menuToggle').on('click',function(){
    $('.left.sidebar')
    .sidebar('toggle')
  ;  
});


//accordian
$('.ui.accordion')
  .accordion()
;

//messages close btn
$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;

//form validations
$('.ui.form.register')
  .form({
    fields: {
      name: {
        identifier: 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name'
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid email.'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'minLength[6]',
            prompt : 'Your password must be at least {ruleValue} characters'
          }
        ]
      },
      password2: {
        identifier: 'password2',
        rules: [
          {
            type   : 'match[password]',
            prompt : 'Password does not matches'
          }
        ]
      },
    }
  })
;
$('.ui.form.login')
  .form({
    fields: {
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid email.'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'minLength[6]',
            prompt : 'Your password must be at least {ruleValue} characters'
          }
        ]
      }
    }
  })
;

$('.ui.form.addblog')
  .form({
    fields: {
      head: {
        identifier: 'head',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please give your post a title.'
          }
        ]
      },
      body: {
        identifier: 'body',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please add some content.'
          }
        ]
      },
      
    }
  })
;