import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('top/trending')
  async getTopProducts() {
    return this.productsService.getTopProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommendations/my-frequent')
  async getMyFrequentProducts(@CurrentUser() user: any) {
    return this.productsService.getFrequentProductsByUser(user.sub);
  }

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
