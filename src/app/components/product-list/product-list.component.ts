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

  products : Product[];
  currentCategoryId: number;
  searchMode : boolean;

  //route hya l route active taw (l lien l mahloul)
  constructor(private productService : ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    //nekhdhou les parametres ml route
    this.route.paramMap.subscribe(()=>{
      this.listProducts()
    });
  }

  listProducts() {
    this.searchMode= this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    

  }


  handleListProducts() {
        //chech if id param is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if(hasCategoryId){
          //get the "id" and convert to number
          //the ! is to say that it is not null
          //the + to convert string to number
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        }
        else{
          //link without category
          this.currentCategoryId = 1;
        }
        this.productService.getProductList(this.currentCategoryId).subscribe(
          data => {
            this.products = data;
          }
        )

  }

  handleSearchProducts(){
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products= data;
      }
    )

  }

}
