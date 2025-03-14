import { Component, inject } from '@angular/core';
import { Test, TestService } from './services/test-service/test.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
  
  private service = inject(TestService);
  testValue: Observable<Test> = this.service.getTest();
}
