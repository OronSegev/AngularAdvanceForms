import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'customFormControls';
import { User } from '../../../core/users';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  templateUrl: './custom-select-page.component.html',
  styleUrls: ['../../common-page.scss', './custom-select-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SelectModule],
})
export class CustomSelectPageComponent implements OnInit {
  selectValue = 'Albert';
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'IsaacNewton', 'isaac', 'United Kingdom', true),

  ];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.selectValue = 'David';
      this.cd.markForCheck();
    }, 5000);
  }

  onSelectionChanged(value: string | null) {
    console.log('Selected value', value);
  }
}
