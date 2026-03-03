import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation',
  imports: [MatButtonModule],
  templateUrl: './dialog-confirmation.html',
  styleUrl: './dialog-confirmation.scss',
})
export class DialogConfirmationComponent {
  title: string;
  description: string;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit():void {
    this.title = this.data.title;
    this.description = this.data.description;
  }

  onClose(value = false) {
    this.dialogRef.close(value);
  }
}
