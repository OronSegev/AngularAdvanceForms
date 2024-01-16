import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: ['../../common-page.scss', './dynamic-forms-page.component.scss'],
})
export class DynamicFormsPageComponent implements OnInit {
  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected fromConfig$!: Observable<object>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fromConfig$ = this.formLoadingTrigger.pipe(
      switchMap(config => this.http.get(`assets/${config}.form.json`))
    );
  }
}
