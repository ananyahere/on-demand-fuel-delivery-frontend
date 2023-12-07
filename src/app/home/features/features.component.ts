import { Component } from '@angular/core';
import { IconDefinition, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  faCheck: IconDefinition = faCheck;
}
