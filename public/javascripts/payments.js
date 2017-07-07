//monthly payment
paypal.Button.render({

            env: 'sandbox', // sandbox | production

            // PayPal Client IDs - replace with your own
            // Create a PayPal app: https://developer.paypal.com/developer/applications/create
            client: {
       
        		sandbox: 'AQ6Rd80TDw3pzJFduLf0lZLoweR82vHTTbbrgqJ1Oj1hmbY3i2VhnwN9YsH1zSEmPowctmZaBdYIODQo',
                production: 'AbDZoNeorLW0xNRRszGJKQXubEcNGPHf6cRS2tPZJudSAxk6MQ7pe4W9gWQ2qV6Ne9STziKVYIa8pJSS'
            },

            // Show the buyer a 'Pay Now' button in the checkout flow
            commit: true,

            // payment() is called when the button is clicked
            payment: function(data, actions) {

                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total: '0.01', currency: 'USD' }
                            }
                        ]
                    }
                });
            },

            // onAuthorize() is called when the buyer approves the payment
            onAuthorize: function(data, actions) {

                // Make a call to the REST api to execute the payment
                return actions.payment.execute().then(function() {
                    window.alert('Payment Complete!');
                });
            }

        }, '#paypal-button-month');


//yearly payment
paypal.Button.render({

            env: 'sandbox', // sandbox | production

            // PayPal Client IDs - replace with your own
            // Create a PayPal app: https://developer.paypal.com/developer/applications/create
            client: {
       
        		sandbox: 'AQ6Rd80TDw3pzJFduLf0lZLoweR82vHTTbbrgqJ1Oj1hmbY3i2VhnwN9YsH1zSEmPowctmZaBdYIODQo',
                production: 'AbDZoNeorLW0xNRRszGJKQXubEcNGPHf6cRS2tPZJudSAxk6MQ7pe4W9gWQ2qV6Ne9STziKVYIa8pJSS'
            },

            // Show the buyer a 'Pay Now' button in the checkout flow
            commit: true,

            // payment() is called when the button is clicked
            payment: function(data, actions) {

                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total: '0.01', currency: 'USD' }
                            }
                        ]
                    }
                });
            },

            // onAuthorize() is called when the buyer approves the payment
            onAuthorize: function(data, actions) {

                // Make a call to the REST api to execute the payment
                return actions.payment.execute().then(function() {
                    window.alert('Payment Complete!');
                });
            }

        },  '#paypal-button-year');