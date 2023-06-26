import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./core/header/header.component";
import { FooterComponent } from "./core/footer/footer.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterModule, HeaderComponent, FooterComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public title: Title) {}
}
