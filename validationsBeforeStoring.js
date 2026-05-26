exports.checkValues = function (DWInputValues) {

  const fields = DWInputValues.Values;

  const montantHTField = fields.find(f => f.FieldName === 'MONTANT_HT');
  const montantTvaField = fields.find(f => f.FieldName === 'MONTANT_TVA');
  const montantTTCField = fields.find(f => f.FieldName === 'MONTANT_TTC');

  if (!montantHTField || !montantTTCField) {
    return Promise.resolve(false);
  }

  const montantHT = parseFloat(String(montantHTField.Item).replace(',', '.'));
  const montantTVA = montantTvaField ? parseFloat(String(montantTvaField.Item).replace(',', '.')) : 0;
  const montantTTC = parseFloat(String(montantTTCField.Item).replace(',', '.'));

  const expectedTTC = Math.round((montantHT + montantTVA) * 100) / 100;
  const actualTTC = Math.round(montantTTC * 100) / 100;

  if (Math.abs(expectedTTC - actualTTC) > 0.01) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};
``