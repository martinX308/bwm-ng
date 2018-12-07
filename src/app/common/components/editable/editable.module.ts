import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EditableInputComponent } from "./editable-input/editable-input.component";
import { EditablTextComponent } from './editable-text/editable-text.component';
import { EditableSelectComponent } from './editable-select/editable-select.component';



@NgModule ({
  declarations: [
    EditableInputComponent,
    EditablTextComponent,
    EditableSelectComponent
  ],
  imports:[
    CommonModule,
    FormsModule
  ],
  providers:[
  ],
  exports: [
    EditableInputComponent,
    EditablTextComponent,
    EditableSelectComponent
  ]
})

export class EditableModule{}