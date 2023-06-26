import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Directive } from '@angular/core';
import {
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, finalize, map, of, take } from 'rxjs';

@Directive({
  selector: '[appUniqeNickname]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqeNicknameDirective,
      multi: true,
    },
  ],
})
export class UniqeNicknameDirective implements AsyncValidator {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  validate(control: AbstractControl<string>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.http.get<any[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`).pipe(
      map(users => {
        return users.length === 0 ? null : {appUniqeNickname: { isTaken: true }}
      }),
      catchError(() => of({appUniqeNickname: { unknownError: true }})),
      take(1),
      finalize(() => this.cd.markForCheck()) // allow update ui when change detection set to onPush
    );
  }
}
