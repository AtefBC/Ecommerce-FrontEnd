import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;


  previousKeyword: string | any = null;


  //route hya l route active taw (l lien l mahloul)
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    //nekhdhou les parametres ml route
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }


  }


  handleListProducts() {
    //chech if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" and convert to number
      //the ! is to say that it is not null
      //the + to convert string to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      //link without category
      this.currentCategoryId = 1;
    }

    //check if we have a diff category than the previous
    //if we have a different category => Page return to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}
                    , thePageNumber=${this.thePageNumber}`)

    //get the products for given ID
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      )

  }


  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    //if we have diff keyword than the previous => page returns to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword} ,
     thePageNumber=${this.thePageNumber}`);


    //search for product using keyword
    this.productService.searchProductPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      )
  }

  updatePageSize(pageSize: number) {
    this.thePageNumber = 1;
    this.thePageSize = pageSize;
    this.listProducts();
  }

}
