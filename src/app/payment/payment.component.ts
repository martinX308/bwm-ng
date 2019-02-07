import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'bwm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  stripe: any;
  elements: any;

  @ViewChild('cardNumber') cardNumRef:ElementRef;
  @ViewChild('cardExpiry') cardExpRef:ElementRef;
  @ViewChild('cardCvc') cardCvcRef:ElementRef;

  cardNum: any;
  cardExp: any;
  cardCvc: any;

  error: string ='';
  token: any = undefined;

  @Output() paymentConfirmed = new EventEmitter();

  isValidatingCard: boolean = false;

  constructor() { 
    this.stripe = Stripe(environment.STRIPE_PK);
    this.elements = this.stripe.elements();

    this.onChange = this.onChange.bind(this);
  }

  ngOnInit() {
    this.cardNum = this.elements.create('cardNumber', {style: style});
    this.cardNum.mount(this.cardNumRef.nativeElement);

    this.cardExp = this.elements.create('cardExpiry', {style: style});
    this.cardExp.mount(this.cardExpRef.nativeElement);

    this.cardCvc = this.elements.create('cardCvc', {style: style});
    this.cardCvc.mount(this.cardCvcRef.nativeElement);

    this.cardNum.addEventListener('change', this.onChange);
    this.cardExp.addEventListener('change', this.onChange);
    this.cardCvc.addEventListener('change', this.onChange);

  }

  ngOnDestroy(){
    this.cardNum.removeEventListener('change',this.onChange);
    this.cardExp.removeEventListener('change',this.onChange);
    this.cardCvc.removeEventListener('change',this.onChange);

    this.cardNum.destroy();
    this.cardExp.destroy();
    this.cardCvc.destroy();
  }

  onChange(event) {
    if (event.error) {
      this.error = event.error.message;
    } else {
      this.error = '';
    }
    
  }

  async onSubmit(){
    this.isValidatingCard = true;
    const {token, error} = await this.stripe.createToken(this.cardNum);
    this.isValidatingCard = false;

    if (error) {
      console.error(error);
    } else {
      this.token = token;
      this.paymentConfirmed.emit(token);
    }
  }

  isCardValid():boolean {
    return this.cardNum._complete && this.cardCvc._complete && this.cardExp._complete;
  }
}

const style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};