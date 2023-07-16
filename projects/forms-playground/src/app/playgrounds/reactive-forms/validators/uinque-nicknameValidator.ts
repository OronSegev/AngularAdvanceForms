import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UinqueNicknameValidator implements AsyncValidator {
  constructor(private http: HttpClient) {}

  validate(
    control: AbstractControl<string | null>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.http
      .get<unknown[]>(
        `https://jsonplaceholder.typicode.com/users?username=${control.value}`
      )
      .pipe(
        map((users) =>
          users.length === 0 ? null : { uniqeName: { isTaken: true } }
        ),
        catchError(() => of({ uniqeName: { unknownError: true } }))
      );
  }
}
