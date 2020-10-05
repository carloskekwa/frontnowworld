import { Cart } from '../../shared/Cart';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { cartService } from '../../shared/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})

export class cartListComponent {
  
  dataSource: MatTableDataSource<Cart>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cartData: any = [];
  displayedColumns: any[] = [
    "cart_name", 
    "Total",
    "userID",
    'action'
  ];
  
  constructor(private cartApi: cartService){
    this.cartApi.GetCartList()
    .snapshotChanges().subscribe(carts => {
        carts.forEach(item => {

         
          let a = item.payload.toJSON();
          console.log(item.key)
          a['$key'] = item.key;
          this.cartData.push(a as Cart)
          console.log(this.cartData)
        })
        /* Data table */
        this.dataSource = new MatTableDataSource(this.cartData);
        /* Pagination */
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    })
  }

  /* Delete */
  deletecart(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.cartApi.Deletecart(e.$key)
    }
  }
  
}