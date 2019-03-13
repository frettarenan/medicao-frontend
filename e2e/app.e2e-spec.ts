import { MedicaoFrontendPage } from './app.po';

describe('medicao-frontend App', () => {
  let page: MedicaoFrontendPage;

  beforeEach(() => {
    page = new MedicaoFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
