import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Game } from '../model/Game';
import { Category } from '../../category/model/category';
import { Author } from '../../author/model/Author';
import { ServiceCategory } from '../../category/service-category';
import { ServiceGame } from '../service-game';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceAuthor } from '../../author/service-author';

@Component({
  selector: 'app-game-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './game-edit.html',
  styleUrl: './game-edit.scss',
})
export class GameEditComponent implements OnInit{
  game: Game;
  authors: Author[];
  categories: Category[];

  constructor(
    public dialogRef: MatDialogRef<GameEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceGame: ServiceGame,
    private serviceCategory: ServiceCategory,
    private serviceAuthor: ServiceAuthor
  ){}

  ngOnInit(): void {
    this.game = this.data.game ? Object.assign({}, this.data.game) : new Game();

    this.serviceCategory.getCategories().subscribe(categories => {
      this.categories = categories;

      if (this.game.category != null){
        const categoryFilter: Category[] = categories.filter(
          (category) => category.id === this.data.game.category.id
        );
        if (categoryFilter != null) {
          this.game.category = categoryFilter[0];
        }
      }
    });

    this.serviceAuthor.getAllAuthors().subscribe(authors => {
      this.authors = authors;

      if (this.game.author != null){
        const authorFilter: Author[] = authors.filter(
          (author) => author.id === this.data.game.author.id);
        if (authorFilter != null) {
          this.game.author = authorFilter[0];
        }
      }
    });
  }

  onSave() {
    this.serviceGame.saveGame(this.game).subscribe((result) => {this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
