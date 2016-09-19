import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MadameService } from './madame-service';
import { MadameSocket } from './madame-socket';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ MadameService, MadameSocket ],
  exports:      [ MadameService, MadameSocket ]
})
export class MadameModule { }