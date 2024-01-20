import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, bufferCount, filter, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banWords } from '../validators/ban-words';
import { passwordShouldmatch } from '../validators/password-should-match';
import { UinqueNicknameValidator } from '../validators/uinque-nicknameValidator';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: ['../../common-page.scss', './reactive-forms-page.component.scss'],
})
export class ReactiveFormsPageComponent implements OnInit {
  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective;
  phonesLabels = ['Main', 'Mobile', 'Work', 'Home'];
  years = this.getYears();
  skills$!: Observable<string[]>;

  destroyRef = inject(DestroyRef);

  form = this.fb.group({
    firstName: [
      'Oron',
      [Validators.required, Validators.minLength(2), banWords(['test'])],
    ],
    lastName: ['Segev', [Validators.required, Validators.minLength(2)]],
    nickname: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[\w]+$/),
          banWords(['test', 'dummy']),
        ],
        asyncValidators: [
          this.uniqeNicknameValidator.validate.bind(
            this.uniqeNicknameValidator
          ),
        ],
        updateOn: 'blur',
      },
    ],
    email: ['oron@segev.com', Validators.email],
    yearOfBirth: this.fb.nonNullable.control(
      this.years[this.years.length - 1],
      Validators.required
    ),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
    address: this.fb.nonNullable.group({
      fullAddress: ['', Validators.required],
      city: ['', Validators.required],
      postcode: [0, Validators.required],
    }),
    phones: this.fb.array([
      this.fb.group({
        label: this.fb.nonNullable.control(this.phonesLabels[0]),
        phone: '',
      }),
    ]),
    skills: this.fb.record<boolean>({}),
    password: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: '',
      },
      { validators: passwordShouldmatch }
    ),
  });

  private initialFormValue: any;

  constructor(
    private userSkills: UserSkillsService,
    private fb: FormBuilder,
    private uniqeNicknameValidator: UinqueNicknameValidator,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills().pipe(
      tap((skills) => this.buildSkillControls(skills)),
      tap(() => (this.initialFormValue = this.form.value))
    );

    this.form.controls.yearOfBirth.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.form.controls.passport.markAsDirty()),
        startWith(this.form.controls.yearOfBirth.value)
      )
      .subscribe((yearOfBirth) => {
        this.isAdult(yearOfBirth)
          ? this.form.controls.passport.addValidators(Validators.required)
          : this.form.controls.passport.removeValidators(Validators.required);

        this.form.controls.passport.updateValueAndValidity();
      });
    this.form.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        bufferCount(2, 1),
        filter(([prevState]) => prevState === 'PENDING')
      )
      .subscribe(() => this.cd.markForCheck());
  }

  addPhone() {
    // this.form.controls.phones.push(new FormControl(''))
    this.form.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl(this.phonesLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      })
    );
  }

  removePhone(index: number) {
    this.form.controls.phones.removeAt(index);
  }

  onSubmit(event: Event) {
    console.log(this.form.value);
    this.initialFormValue = this.form.value;
    // ressting From strategy
    // stg 1 - all value set to null, set form pristing
    // this.form.reset();
    // stg 2 - drawback resetForm is not type safe
    // this.formDir.resetForm();
    // stg 3- reset and keep the submitted value
    this.formDir.resetForm(this.form.value);
  }

  onReset(e: Event) {
    e.preventDefault();
    // ressting From strategy
    // stg 1 - all value set to null, set form pristing
    // this.form.reset();
    // stg 2 - drawback resetForm is not type safe
    // this.formDir.resetForm();
    // stg 3- reset and keep the submitted value
    this.formDir.resetForm(this.initialFormValue);
  }

  private getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  private buildSkillControls(skills: string[]) {
    skills.forEach((skill) => {
      this.form.controls.skills.addControl(
        skill,
        new FormControl(false, { nonNullable: true })
      );
    });
  }

  private isAdult(yearOfBirth: number): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth >= 18;
  }
}
