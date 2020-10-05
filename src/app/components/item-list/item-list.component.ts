import { Component, ViewChild } from '@angular/core';
import { Item } from '../../shared/Item';
import { Cart } from '../../shared/Cart';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ItemService } from '../../shared/item.service';
import { cartService } from '../../shared/cart.service';
import { UtilService } from '../../utils/util.service'
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent{
  dataSource: MatTableDataSource<Item>;
   total : number = 0;
   itemsArray : String[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // - An item should have ID, SKU, name, description, prices
  itemData: any = [];
  displayedColumns: any[] = [
    "SKU", 
    "name",
    "description",
    'prices',
    'action'
  ];
  


  constructor(private itemApi: ItemService, private cartApi: cartService){
    this.cartApi.GetCartList();
    this.itemApi.GetitemList()
    .snapshotChanges().subscribe(items => {
      items.forEach(item => {
        let a = item.payload.toJSON();
          console.log(item.key)
          a['$key'] = item.key;
          this.itemData.push(a as Item)
          console.log(this.itemData)
        })
        /* Data table */
        this.dataSource = new MatTableDataSource(this.itemData);
        /* Pagination */
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    })
  }
   /* addtocard */
   makeTotal(index: number, e,isChecked :boolean){
      const data = this.dataSource.data;
      this.dataSource.data = data;
      var itemPrice: number = +  e.prices;
      if (isChecked){

        this.total = itemPrice + this.total;
        this.itemsArray.push( e.id);
      }else{
        const index =   this.itemsArray.indexOf(e.ID, 0);
        if (index > -1) {
          this.itemsArray.splice(index, 1);
       }
        this.total =this.total   - itemPrice ;
      }
      console.log(this.total);
      console.log(isChecked);
  }

getTotal(){
  return this.total;
}

  /* Submit cart */
  submitcart() {

      var cart : Cart = 
        {
          id: UtilService.generateID(),
          name: "",
          userID:"",
          items:[],
          Total: 0,
          cart_name: ""
      } ;
      cart.Total = this.total
      cart.userID = "666";
      cart.items = this.itemsArray;
      console.log("cart-itemsArray:" + this.itemsArray);
      console.log("cart-items:" + cart.items);
      this.cartApi.Addcart(cart)
      alert("Items Added successfully to your Cart")
      window.location.reload();
  }

  
}
