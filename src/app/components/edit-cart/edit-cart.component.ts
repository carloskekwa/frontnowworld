import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { cartService } from './../../shared/cart.service';
import { FormGroup, FormBuilder, Validators ,FormControl} from "@angular/forms";

var form: FormGroup;
@Component({
  selector: 'app-edit-cart',
  templateUrl: './edit-cart.component.html',
  styleUrls: ['./edit-cart.component.css']
})

export class EditcartComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  items: String[] = [];
  @ViewChild('chipList') chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  editcartForm: FormGroup;

  ngOnInit() {
    this.updatecartForm();
  }

  constructor(
    public fb: FormBuilder,    
    private location: Location,
    private cartApi: cartService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    console.log("id:" + id);
    this.cartApi.GetCart(id).valueChanges().subscribe(data => {
      this.items = data.items;
      console.log(data);
      this.editcartForm.setValue(data);
    })
  }

  /* Update form */
  updatecartForm(){
    
    this.editcartForm = this.fb.group({
      id: new FormControl({ value: '', disabled: true }),
      items: [[]],
      cart_name: ['', [Validators.required]],
      userID: new FormControl({ value: '', disabled: true }),
      Total: ['', [Validators.required]],
    })
  }

  /* Add language */
  add(event: MatChipInputEvent): void {
    var input: any = event.input;
    var value: any = event.value;
    // Add language
    if ((value || '').trim() && this.items.length < 5) {
      this.items.push(value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove language */
  remove(language: any): void {
    const index = this.items.indexOf(language);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editcartForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.editcartForm.get('publication_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Go to previous page */
  goBack(){
    this.location.back();
  }

  /* Submit cart */
  updateCart() {
    var id = this.actRoute.snapshot.paramMap.get('id');
    if(window.confirm('Are you sure you wanna update?')){
        this.cartApi.UpdateCart(id, this.editcartForm.value);
      this.router.navigate(['carts-list']);
    }
  }

}