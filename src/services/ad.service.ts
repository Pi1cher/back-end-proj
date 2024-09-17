import { UserAccountType } from "../enums/user/accountType.enum";
import { ApiError } from "../errors/api.error";
import { IAd } from "../interfaces/ad.interface";
import { ConversionRate } from "../interfaces/conversion.interface";
import { SearchParams } from "../interfaces/searchParams.interface";
import { adRepository } from "../repositories/ad.repository";
import { userRepository } from "../repositories/user.repository";
import { convertPrice, fetchConversionRates } from "./currency.service";

class AdService {
  public async findAll(): Promise<IAd[]> {
    return await adRepository.findAll();
  }
  public async findById(id: string): Promise<IAd> {
    return await adRepository.findById(id);
  }
  public async create(data: IAd, loggedUserId: string): Promise<IAd> {
    const conversionRates: ConversionRate[] = await fetchConversionRates();
    if (!conversionRates) {
      throw new ApiError("Failed to fetch conversion rates", 500);
    }
    const { convertedCurrencies, buyRates, saleRates } = convertPrice(
      data.price,
      data.currency,
      conversionRates,
    );
    const user = await userRepository.findById(loggedUserId);
    const loggedUserAds = await adRepository.findByParams({
      authorId: loggedUserId,
    });
    if (
      user.accountType === UserAccountType.basic &&
      loggedUserAds.length >= 1
    ) {
      throw new ApiError(
        "You can create only one advertisement with a basic account. If you want to add more advertisement please but premium account",
        403,
      );
    }
    return await adRepository.create(
      {
        ...data,
        convertedCurrencies: convertedCurrencies,
        currencyRate: {
          dollarBuy: buyRates["USD"].toString(),
          dollarSale: saleRates["USD"].toString(),
          euroBuy: buyRates["EUR"].toString(),
          euroSale: saleRates["EUR"].toString(),
        },
      },
      loggedUserId,
    );
  }
  public async updateById(id: string, data: Partial<IAd>): Promise<IAd> {
    return await adRepository.updateById(id, data);
  }
  public async updateViewsById(id: string): Promise<IAd> {
    return await adRepository.updateViewsById(id);
  }
  public async deleteById(id: string): Promise<void> {
    return await adRepository.deleteById(id);
  }
  public async findInRegion(adInfo: IAd): Promise<number> {
    const searchParams: SearchParams = {
      region: adInfo.region,
      brand: adInfo.brand,
      model: adInfo.model,
    };
    const priceForCarInRegion = await adRepository.findByParams(searchParams);
    const totalPrices = priceForCarInRegion.reduce(
      (sum, ad) => sum + ad.price,
      0,
    );
    const averagePrice = totalPrices / priceForCarInRegion.length;
    return averagePrice;
  }
  public async findInUkraine(adInfo: IAd): Promise<number> {
    const searchParams: SearchParams = {
      brand: adInfo.brand,
      model: adInfo.model,
    };
    const priceForCarInRegion = await adRepository.findByParams(searchParams);
    const totalPrices = priceForCarInRegion.reduce(
      (sum, ad) => sum + ad.price,
      0,
    );
    const averagePrice = totalPrices / priceForCarInRegion.length;
    return averagePrice;
  }
}
export const adService = new AdService();
