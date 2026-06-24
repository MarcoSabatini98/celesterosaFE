import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCard as ProductCardModel } from '../../core/models/catalog.models';
import { EuroPipe } from '../pipes/euro.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, EuroPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<ProductCardModel>();
}
