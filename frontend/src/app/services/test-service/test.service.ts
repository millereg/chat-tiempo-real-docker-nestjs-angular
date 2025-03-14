import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Test {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private http = inject(HttpClient);

  getTest(): Observable<Test> {
    return this.http.get<Test>('api');
  }
}
