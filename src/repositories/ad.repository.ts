import { ApiError } from "../errors/api.error";
import { IAd } from "../interfaces/ad.interface";
import { Ad } from "../models/ad.model";
import { SearchParams } from "../interfaces/searchParams.interface";

class AdRepository {
  public async findAll(): Promise<IAd[]> {
    return await Ad.find();
  }
  public async findById(id: string): Promise<IAd> {
    return await this.getOneByIdOrThrow(id);
  }
  public async create(data: IAd, loggedUserId: string): Promise<IAd> {
    await this.addAuthorId(data, loggedUserId);
    return await Ad.create(data);
  }
  public async updateById(id: string, data: Partial<IAd>): Promise<IAd> {
    await this.getOneByIdOrThrow(id);
    const { editCount, ...dataWithoutEditCount } = data;
    return await Ad.findOneAndUpdate(
      { _id: id },
      { ...dataWithoutEditCount, $inc: { editCount: 1 } },
      { returnDocument: "after" },
    );
  }
  public async updateViewsById(id: string): Promise<IAd> {
    await this.getOneByIdOrThrow(id);
    return await Ad.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    );
  }
  public async deleteById(id: string): Promise<void> {
    await this.getOneByIdOrThrow(id);
    await Ad.findByIdAndDelete({ _id: id });
  }
  public async findByParams(SearchParams: SearchParams): Promise<IAd[]> {
    try {
      return await Ad.find(SearchParams);
    } catch (e) {
      throw new ApiError(
        ` (${e}) No sales found for the given car and region`,
        422,
      );
    }
  }
  private async getOneByIdOrThrow(adId: string): Promise<IAd> {
    const ad = await Ad.findById(adId);
    if (!ad) {
      throw new ApiError("Advertisement not found,", 422);
    }
    return ad;
  }
  private async addAuthorId(data: IAd, loggedUserId: string): Promise<string> {
    return (data.authorId = loggedUserId);
  }
}

export const adRepository = new AdRepository();
