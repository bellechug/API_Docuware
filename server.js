// =========================
// IMPORTS
// =========================
const express = require('express');
const bodyParser = require('body-parser');
const validations = require('./validationsBeforeStoring');

const app = express();

// ✅ AJOUT IMPORTANT
const router = express.Router();

// =========================
// MIDDLEWARE
// =========================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =========================
// ROUTES
// =========================

// ✅ Test API
router.get('/', (req, res) => {
  res.json({
    Status: 'OK',
    Reason: 'Validation API is running'
  });
});

// ✅ Endpoint DocuWare
router.post('/', async (req, res) => {

	const apiKey = req.headers['x-api-key'];
	const SECRET_KEY = process.env.API_KEY;

	if (apiKey !== SECRET_KEY){
		return res.json({
			Status : 'Fail',
			Reason : 'Accès non autorisé' 
		})
	}

  try {
    const DWInputValues = req.body;

    if (!DWInputValues || !DWInputValues.Values) {
      return res.json({
        Status: 'Fail',
        Reason: 'Payload invalide'
      });
    }


    const result = await validations.checkValues(DWInputValues);

    if (result.success) {
      return res.json({
        Status: 'OK',
        Reason: ''
      });
    } else {
      return res.json({
        Status: 'Fail',
        Reason: result.message
      });
    }

  } catch (error) {
    console.error("Erreur serveur :", error);

    return res.json({
      Status: 'Fail',
      Reason: 'Erreur interne serveur'
    });
  }

});

// =========================
// REGISTER ROUTES
// =========================
app.use('/api', router);

// =========================
// START SERVER
// =========================
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});