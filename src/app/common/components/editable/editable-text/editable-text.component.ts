import { Component, Input, Output, EventEmitter} from '@angular/core';
import { EditableComponent } from '../editable-component';

@Component({
  selector: 'bwm-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditablTextComponent extends EditableComponent {
  @Input() rows:string;
  @Input() cols:string;

}
