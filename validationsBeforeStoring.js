const DWparameters = require('./DWValidationSettings');
const validator = require('validator');


exports.checkValues = function (DWInputValues) {

  const fields = DWInputValues.Values;

  console.log('Fields reçus :', fields);

  // ===== RÉCUPÉRATION DES CHAMPS =====
  const montantHTField = fields.find(f => f.FieldName === 'MONTANT_HT');
  const montantTvaField = fields.find(f => f.FieldName === 'MONTANT_TVA');
  const montantTTCField = fields.find(f => f.FieldName === 'MONTANT_TTC');

  console.log('HT:', montantHTField);
  console.log('TVA:', montantTvaField);
  console.log('TTC:', montantTTCField);

  if (!montantHTField || !montantTTCField) {
    console.log('Champs manquants');
    return Promise.resolve(false);
  }

  const montantHT = parseFloat(String(montantHTField.Item).replace(',', '.'));
  const montantTVA = montantTvaField ? parseFloat(String(montantTvaField.Item).replace(',', '.')) : 0;
  const montantTTC = parseFloat(String(montantTTCField.Item).replace(',', '.'));

  const expectedTTC = Math.round((montantHT + montantTVA) * 100) / 100;
  const actualTTC = Math.round(montantTTC * 100) / 100;

  console.log('TTC attendu:', expectedTTC);
  console.log('TTC reçu:', actualTTC);

  // ✅ TEST SIMPLE
  if (Math.abs(expectedTTC - actualTTC) > 0.01) {
    console.log('❌ ERREUR DETECTEE');
    return Promise.resolve(false);
  }

  console.log('✅ OK');
  return Promise.resolve(true);
};
