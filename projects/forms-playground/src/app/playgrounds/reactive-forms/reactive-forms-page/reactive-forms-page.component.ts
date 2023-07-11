import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banwords } from '../validators/ban-words';
import { passwordShouldmatch } from '../validators/password-should-match';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: ['../../common-page.scss', './reactive-forms-page.component.scss'],
})
export class ReactiveFormsPageComponent implements OnInit {
  phonesLabels = ['Main', 'Mobile', 'Work', 'Home'];
  years = this.getYears();
  skills$!: Observable<string[]>;

  form = this.fb.group({
    firstName: [
      'Oron',
      [Validators.required, Validators.minLength(2), banwords(['test'])],
    ],
    lastName: ['Segev', [Validators.required, Validators.minLength(2)]],
    nickname: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[\w]+$/),
        banwords(['test', 'dummy']),
      ],
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
    password: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ''
    }, { validators: passwordShouldmatch})
  });

  constructor(private userSkills: UserSkillsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.skills$ = this.userSkills
      .getSkills()
      .pipe(tap((skills) => this.buildSkillControls(skills)));
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
}
