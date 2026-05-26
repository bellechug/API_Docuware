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
router.post('/', async (req, res) => {

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
    return res.json({
      Status: 'Fail',
      Reason: 'Erreur serveur'
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
``