import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  async getCategories() {
    return this.productsService.findCategories();
  }

  @Get('categories/:slug/products')
  async getByCategorySlug(
    @Param('slug') slug: string,
    @Query() query: QueryProductsDto,
  ) {
    return this.productsService.findByCategorySlug(slug, query);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
