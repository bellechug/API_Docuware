const DWparameters = require('./DWValidationSettings');
const validator = require('validator');

exports.checkValues = function (DWInputValues) {

  const fields = DWInputValues.Values;

  console.log('Fields reçus :', fields);

  // =========================
  // DOCTYPE
  // =========================
  const docTypeField = fields.find(
    f => f.FieldName === DWparameters.fieldNameDOCTYPE
  );

  if (!docTypeField) {
    console.log('Pas de DOCTYPE → on laisse passer');
    return Promise.resolve(true);
  }

  const value = String(docTypeField.Item).toLowerCase();

  const isInvoice =
    value.includes('facture') ||
    value.includes('invoice');

  console.log('Type document :', value);
  console.log('Is invoice ?', isInvoice);

  // =========================
  // MONTANTS
  // =========================
  const montantHTField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_HT
  );

  const montantTvaField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_TVA
  );

  const montantTTCField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_TTC
  );

  if (!montantHTField || !montantTTCField) {
    return Promise.reject(new Error('Montants manquants'));
  }

  const montantHT = parseFloat(
    String(montantHTField.Item).replace(',', '.')
  );

  const montantTVA = montantTvaField
    ? parseFloat(String(montantTvaField.Item).replace(',', '.'))
    : 0;

  const montantTTC = parseFloat(
    String(montantTTCField.Item).replace(',', '.')
  );

  const round2 = v => Math.round(v * 100) / 100;

  const expectedTTC = round2(montantHT + montantTVA);
  const actualTTC = round2(montantTTC);

  console.log('HT:', montantHT);
  console.log('TVA:', montantTVA);
  console.log('TTC attendu:', expectedTTC);
  console.log('TTC reçu:', actualTTC);

  const isValid = Math.abs(expectedTTC - actualTTC) <= 0.01;

  // =========================
  // VALIDATION FINALE
  // =========================

if (isInvoice && !isValid) {
  return Promise.resolve(false);
}

  return Promise.resolve(true);
};
