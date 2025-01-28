import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CatergoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Get()
    async getCategories() {
        return this.categoryService.getCategories();
    }
    
}
