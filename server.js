// =========================
// IMPORTS
// =========================
const express = require('express');
const bodyParser = require('body-parser');
const validations = require('./validationsBeforeStoring');

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =========================
// ROUTER
// =========================
const router = express.Router();

// ✅ Test API
router.get('/', (req, res) => {
  res.json({
    Status: 'OK',
    Reason: 'Validation API is running'
  });
});

// ✅ Endpoint DocuWare
router.post('/', (req, res) => {

  const DWInputValues = req.body;

  // Sécurité
  if (!DWInputValues || !DWInputValues.Values) {
    return res.json({
      Status: 'Fail',
      Reason: 'Invalid payload'
    });
  }

  console.log('Payload reçu :', DWInputValues);

validations.checkValues(DWInputValues)
.then(success => {
  return res.json({
    Status: 'OK',
    Reason: ''
  });
})

.catch(error => {
  return res.json({
    Status: 'Fail',
    Reason: error.message
  });
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
``