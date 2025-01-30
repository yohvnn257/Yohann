import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-particuliers',
  imports: [ButtonModule,TableModule],
  templateUrl: './particuliers.component.html',
  styleUrl: './particuliers.component.scss'
})
export class ParticuliersComponent {

  listeClientParticuliers: any[]=['sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd'];

}
