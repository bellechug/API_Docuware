exports.checkValues = function (DWInputValues) {

  const fields = DWInputValues.Values;

  const montantHTField = fields.find(f => f.FieldName === 'MONTANT_HT');
  const montantTvaField = fields.find(f => f.FieldName === 'MONTANT_TVA');
  const montantTTCField = fields.find(f => f.FieldName === 'MONTANT_TTC');

  if (!montantHTField || !montantTTCField) {
    throw new Error("Montants manquants (HT ou TTC)");
  }

  const montantHT = parseFloat(String(montantHTField.Item).replace(',', '.'));
  const montantTVA = montantTvaField ? parseFloat(String(montantTvaField.Item).replace(',', '.')) : 0;
  const montantTTC = parseFloat(String(montantTTCField.Item).replace(',', '.'));

  const round2 = v => Math.round(v * 100) / 100;

  const expectedTTC = round2(montantHT + montantTVA);
  const actualTTC = round2(montantTTC);

  if (Math.abs(expectedTTC - actualTTC) > 0.01) {

    throw new Error(
      `Montant TTC incorrect : attendu ${expectedTTC} (HT + TVA), reçu ${actualTTC}`
    );

  }

  return Promise.resolve(true);
};
