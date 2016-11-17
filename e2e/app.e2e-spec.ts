import { HumaPage } from './app.po';

describe('huma App', function() {
  let page: HumaPage;

  beforeEach(() => {
    page = new HumaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
