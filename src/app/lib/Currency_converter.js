export async function convertFromUSD(amountUSD, targetCurrency) {
  if (targetCurrency === 'USD') return amountUSD.toFixed(2);

  const res = await fetch(`https://api.frankfurter.app/latest?amount=${amountUSD}&from=USD&to=${targetCurrency}`);
  const data = await res.json();
  return data.rates[targetCurrency]?.toFixed(2) || amountUSD.toFixed(2);
}