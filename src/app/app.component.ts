import { Component, Input } from '@angular/core';
import { CommService } from './comm/comm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: []
})
export class AppComponent {
  title = 'nj-tp-app';

  @Input()
  showLogin: boolean;  
  @Input()
  showDashboard: boolean;

  constructor(private commService:CommService) {
   
    commService.start().then(res => {
      if (res) {
        this.showLogin = true;        
      }
    });

    
  }

  onLoginResult(result:boolean):void{
    this.showLogin=!result;
    this.showDashboard=result;
  }
}
