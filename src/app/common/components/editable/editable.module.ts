import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ImageUploadModule } from "../image-upload/image-upload.module";

import { EditableInputComponent } from "./editable-input/editable-input.component";
import { EditablTextComponent } from './editable-text/editable-text.component';
import { EditableSelectComponent } from './editable-select/editable-select.component';
import { EditableImageComponent } from './editable-image/editable-image.component';



@NgModule ({
  declarations: [
    EditableInputComponent,
    EditablTextComponent,
    EditableSelectComponent,
    EditableImageComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    ImageUploadModule
  ],
  providers:[
  ],
  exports: [
    EditableInputComponent,
    EditablTextComponent,
    EditableSelectComponent,
    EditableImageComponent
  ]
})

export class EditableModule{}