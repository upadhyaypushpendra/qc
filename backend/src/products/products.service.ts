import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(query: QueryProductsDto) {
    const { page = 1, limit = 20, categoryId, search, sort, inStock } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (inStock !== undefined) filter.inStock = inStock;

    if (search) {
      filter.$text = { $search: search };
    }

    let sortObj: any = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else if (sort === 'newest') sortObj.createdAt = -1;

    const total = await this.productModel.countDocuments(filter);
    const products = await this.productModel
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    return this.productModel.findOne({ slug }).lean();
  }

  async findByCategorySlug(categorySlug: string, query: QueryProductsDto) {
    const category = await this.categoryModel.findOne({ slug: categorySlug }).lean();
    if (!category) {
      throw new Error('Category not found');
    }

    return this.findAll({
      ...query,
      categoryId: category._id.toString(),
    });
  }

  async findCategories() {
    return this.categoryModel.find().sort({ sortOrder: 1 }).lean();
  }

  async findCategoryBySlug(slug: string) {
    return this.categoryModel.findOne({ slug }).lean();
  }
}
