import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../model/category';
import { ServiceCategory } from '../service-category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit';
import { DialogConfig } from '@angular/cdk/dialog';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-category-list',
  imports: [MatButtonModule,MatIconModule, MatTableModule, CommonModule,],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryListComponent implements OnInit{ //OnInit es una interfaz de angular que indica que el comoponente quiere ejecutar codigo cuando se inincializa
  dataSource = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'action']; //Columnas que se mostraran en la tabla

  constructor(private serviceCategory: ServiceCategory, //Mi servicio backend
              private dialog: MatDialog, //Sirve para abrir ventanas emergentes
  ) {}

  ngOnInit():void {
    this.serviceCategory.getCategories().subscribe(categories => this.dataSource.data = categories) //Llama al back para pedir las categorias
  }

  createCategory() {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: {}    //Abre un dialogo y le pasa un objetos vacio como datos iniciales
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    }) //espera a que dialogo se cierre para vovler a cargar las categorias desde el back
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: {category}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteCategory(category : Category) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title:"Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos. <br> ¿Desea eliminar la categoría?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceCategory.deleteCategory(category.id).subscribe(result => {
          this.ngOnInit();
        });
      }
    });
  }
}
