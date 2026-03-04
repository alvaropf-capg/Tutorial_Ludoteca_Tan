import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthorPage } from './model/AuthorPage';
import { AUTHOR_DATA } from './model/mock-authors';
import { Pageable } from '../core/model/page/Pageable';
import { Author } from './model/Author';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuthor {
  constructor() {}

  getAuthors(pageable: Pageable): Observable<AuthorPage>{
    return of (AUTHOR_DATA);
  }

  saveAuthor(author: Author): Observable<void>{
    return of (null);
  }

  deleteAuthor(idAuthor: number): Observable<void>{
    return of (null);
  }
}
