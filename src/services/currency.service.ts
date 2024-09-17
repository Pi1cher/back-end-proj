import axios from "axios";

import { ConversionRate } from "../interfaces/conversion.interface";

export const fetchConversionRates = async () => {
  try {
    const response = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11",
    );
    const conversionRates: ConversionRate[] = response.data;
    return conversionRates;
  } catch (e) {
    return e.message;
  }
};

export const convertPrice = (
  price: number,
  currency: string,
  conversionRates: ConversionRate[],
): {
  convertedCurrencies: {
    USD: number;
    EUR: number;
    UAH: number;
  };
  buyRates: { [key: string]: number };
  saleRates: { [key: string]: number };
} => {
  const buyRates: { [key: string]: number } = {};
  const saleRates: { [key: string]: number } = {};

  for (const rate of conversionRates) {
    buyRates[rate.ccy] = parseFloat(rate.buy);
    saleRates[rate.ccy] = parseFloat(rate.sale);
  }

  let convertedCurrencies;

  if (currency === "USD") {
    convertedCurrencies = {
      USD: price,
      EUR: (price * buyRates["USD"]) / saleRates["EUR"],
      UAH: price * buyRates["USD"],
    };
  } else if (currency === "EUR") {
    convertedCurrencies = {
      USD: (price * buyRates["EUR"]) / saleRates["USD"],
      EUR: price,
      UAH: price * buyRates["EUR"],
    };
  } else if (currency === "UAH") {
    convertedCurrencies = {
      USD: price / saleRates["USD"],
      EUR: price / saleRates["EUR"],
      UAH: price,
    };
  } else {
    convertedCurrencies = {
      USD: price,
      EUR: price,
      UAH: price,
    };
  }

  return {
    convertedCurrencies,
    buyRates,
    saleRates,
  };
};
