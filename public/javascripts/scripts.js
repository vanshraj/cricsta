//disabling back button
window.history.forward();
	function noBack() { window.history.forward(); }



//semantic scripts
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
$('.ui.form')
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
            type   : 'empty',
            prompt : 'Please enter a username'
          },
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
            type   : 'empty',
            prompt : 'Please enter a password'
          },
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