import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Author } from '../model/Author';
import { MatDialog } from '@angular/material/dialog';
import { ServiceAuthor } from '../service-author';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Pageable } from '../../core/model/page/Pageable';
import { AuthorEditComponent } from '../author-edit/author-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginator],
  templateUrl: './author-list.html',
  styleUrl: './author-list.scss',
})
export class AuthorListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'nationality', 'action'];

  constructor(private serviceAuthor: ServiceAuthor, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(event?: PageEvent){
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC'
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.serviceAuthor.getAuthors(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    })
  }

  createAuthor() {
      const dialogRef = this.dialog.open(AuthorEditComponent, {
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
  }

  editAuthor(author: Author) {
    const dialogRef = this.dialog.open(AuthorEditComponent,  {
      data: { author: author},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteAuthor(author: Author) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar autor',
        description: 'Atención si borra el autor se perderán sus datos. <br> ¿Desea eliminar el autor?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serviceAuthor.deleteAuthor(author.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }

}
