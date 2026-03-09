import { Component, Input } from '@angular/core';
import { Game } from '../../model/Game';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-item.html',
  styleUrl: './game-item.scss',
})
export class GameItemComponent {
  @Input() game: Game;
}
