import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GameItemComponent } from './game-item/game-item';
import { Category } from '../../category/model/category';
import { Game } from '../model/Game';
import { ServiceCategory } from '../../category/service-category';
import { MatDialog } from '@angular/material/dialog';
import { ServiceGame } from '../service-game';
import { GameEditComponent } from '../game-edit/game-edit';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, GameItemComponent],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
})
export class GameListComponent implements OnInit {
  categories: Category[];
  games: Game[];
  filterCategory: Category;
  filterTitle: string;

  constructor(
    private serviceGame: ServiceGame,
    private serviceCategory: ServiceCategory,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.serviceGame.getGames().subscribe((games) => (this.games = games));

    this.serviceCategory
        .getCategories()
        .subscribe((categories) => (this.categories = categories));
  }

  onCleanFilter(): void {
    this.filterTitle = null;
    this.filterCategory = null;
    this.onSearch();
  }

  onSearch(): void {
    const title = this.filterTitle;
    const categoryId =
        this.filterCategory != null ? this.filterCategory.id : null;

    this.serviceGame
        .getGames(title, categoryId)
        .subscribe((games) => (this.games = games));
  }

  createGame() {
      const dialogRef = this.dialog.open(GameEditComponent, {
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
  }

  editGame(game: Game) {
    const dialogRef = this.dialog.open(GameEditComponent, {
      data: { game:game },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onSearch();
    });
  }
}
