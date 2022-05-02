import { CreditcardPipe } from './creditcard.pipe';

describe('CreditcardPipe', () => {
  it('create an instance', () => {
    const pipe = new CreditcardPipe();
    expect(pipe).toBeTruthy();
  });
});
