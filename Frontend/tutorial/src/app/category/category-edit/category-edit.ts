import { Component, OnInit, Inject} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../model/category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceCategory } from '../service-category';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEditComponent implements OnInit{
  category: Category;

  constructor(
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {category: Category}, //esto inyecta datos dentro del dialogo cuando se abre
    private ServiceCategory: ServiceCategory
  ) {}

  ngOnInit(): void {
    //this.category = this.data.category != null ? this.data.category : new Category(); //Si llega una categoria edita y no llega nada crea una nueva
    this.category = this.data.category ? Object.assign({}, this.data.category) : new Category(); //Para este caso nos viene mejor esta otra linea ya que edita una copia de la categoria que escogemos
  }

  onSave() {
    this.ServiceCategory.saveCategory(this.category).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
