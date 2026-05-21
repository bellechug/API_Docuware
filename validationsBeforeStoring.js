const DWparameters = require('./DWValidationSettings');
const validator = require('validator');

exports.checkValues = function (DWInputValues) {
  const fields = DWInputValues.Values;

  // ===== DOCTYPE =====
  const docTypeField = fields.find(
    f => f.FieldName === DWparameters.fieldNameDOCTYPE
  );

  if (!docTypeField) {
    return Promise.resolve(true);
  }

  const isInvoice =
    validator.contains(
      String(docTypeField.Item).toLowerCase(),
      DWparameters.TRIGGER_STRING_DOCTYPE_INVOICE_FR.toLowerCase()
    ) ||
    validator.contains(
      String(docTypeField.Item).toLowerCase(),
      DWparameters.TRIGGER_STRING_DOCTYPE_INVOICE.toLowerCase()
    );

  console.log('Is invoice ?', isInvoice);

  // ===== MONTANTS =====
  const montantHTField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_HT
  );

  const montantTvaField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_TVA
  );

  const montantTTCField = fields.find(
    f => f.FieldName === DWparameters.fieldNameMONTANT_TTC
  );

  // HT et TTC obligatoires
  if (!montantHTField || !montantTTCField) {
    console.log('Montant HT ou TTC manquant -> document invalide');
    return Promise.resolve(false);
  }

  const montantHT = parseFloat(
    String(montantHTField.Item).replace(',', '.')
  );

  const montantTTC = parseFloat(
    String(montantTTCField.Item).replace(',', '.')
  );

  // TVA optionnelle
  const montantTVA = montantTvaField
    ? parseFloat(String(montantTvaField.Item).replace(',', '.'))
    : 0;

  const calculatedTTC = montantHT + montantTVA;

  const round2 = v => Math.round(v * 100) / 100;

  const expectedTTC = round2(calculatedTTC);
  const actualTTC = round2(montantTTC);

  const tolerance = 0.01;

  const isTTCValid =
    Math.abs(expectedTTC - actualTTC) <= tolerance;

  console.log('HT:', montantHT);
  console.log('TVA:', montantTVA);
  console.log('TTC attendu:', expectedTTC);
  console.log('TTC document:', actualTTC);
  console.log('Montant TTC valide ?', isTTCValid);

  if (isInvoice && !isTTCValid) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};
