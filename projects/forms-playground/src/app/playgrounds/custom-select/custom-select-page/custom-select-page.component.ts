import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'customFormControls';
import { User } from '../../../core/users';
import { SelectValue } from 'projects/custom-form-controls/src/public-api';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  templateUrl: './custom-select-page.component.html',
  styleUrls: ['../../common-page.scss', './custom-select-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SelectModule],
})
export class CustomSelectPageComponent implements OnInit {
  selectValue: SelectValue<User> = [
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
  ];
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'IsaacNewton', 'isaac', 'United Kingdom', true),
  ];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  displayWith(user: User) {
    return user.name;
  }

  comparewith(user1: User | null, user2: User | null) {
    return user1?.id === user2?.id;
  }

  onSelectionChanged(value: any) {
    console.log('Selected value', value);
  }
}
