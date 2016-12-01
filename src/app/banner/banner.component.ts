import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  template: `
  <header role="banner">
    <h2><span>SEC</span> Compare</h2>
  </header>
  `,
  styleUrls: ['./banner.component.less']
})
export class BannerComponent {
  title = 'app works!!';

}
