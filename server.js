// call the packages we need
var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');
var validations = require('./validationsBeforeStoring');    

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();


// ✅ TEST ROUTE
router.get('/', function(req, res) {
    res.json({ 
        Status: 'OK', 
        Reason: 'Validation web service is up and running' 
    });
});


// ✅ ROUTE PRINCIPALE DOCUWARE
router.post('/', function(req, res) {

    var DWInputValues = req.body;

    // 🔒 sécurité
    if (!DWInputValues || !DWInputValues.Values) {
        return res.json({ 
            Status: 'Fail', 
            Reason: 'Invalid payload' 
        });
    }

    if (DWInputValues.Values.length > 0) {

        console.log('Payload reçu :', DWInputValues);

        validations.checkValues(DWInputValues)

        .then(success => {

            if (success) {
                return res.json({ 
                    Status: 'OK', 
                    Reason: '' 
                });
            } else {
                return res.json({ 
                    Status: 'Fail', 
                    Reason: 'Montant TTC incorrect' 
                });
            }

        })

        .catch(function (error) {

            console.error('Erreur validation :', error.message);

            return res.json({ 
                Status: 'Fail', 
                Reason: error.message 
            });

        });

    } else {
        // cas test DocuWare
        return res.json({ 
            Status: 'OK', 
            Reason: '' 
        });
    }

});


// REGISTER ROUTES
app.use('/api', router);


// START SERVER
// =============================================================================

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

console.log(`Validation REST service started on port ${port}`);
