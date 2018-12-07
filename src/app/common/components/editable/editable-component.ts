import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';


export class EditableComponent implements OnChanges {
  @Input() entity: any;
  @Input() set field(fieldvalue: string){
    this.entityField = fieldvalue;
    this.setOriginValue();
  };
  @Input() classname: string;
  @Input() style: any;
  @Output() entityUpdated = new EventEmitter ();

  public isActiveInput: boolean = false;
  public originEntityValue: any;
  public entityField: string;
  
  constructor() { }

  
  ngOnChanges() {
    this.setOriginValue();
    this.isActiveInput=false;
  }
  
  updateEntity(){
    const entityValue = this.entity[this.entityField];
    if (entityValue !== this.originEntityValue) {
      this.entityUpdated.emit({[this.entityField]: this.entity[this.entityField]});
      this.setOriginValue();
    }
    this.isActiveInput = false;
  }

  cancelUpdate() {
    this.isActiveInput=false;
    this.entity[this.entityField]= this.originEntityValue;
  }

  setOriginValue(){
    this.originEntityValue = this.entity[this.entityField];

  }
}
