import { Component } from '@angular/core';
import { WebsocketService } from "./web-socket.service";
import { MessageService } from "./message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [WebsocketService, MessageService]
})
export class AppComponent {
  title = 'nj-tp-app';

  constructor(private messageService: MessageService) {
    messageService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
    let t=this;
    setTimeout(()=>{
      console.log("timeout");
      t.sendMsg()},5000
    );

   // this.sendMsg();
  }

  private message ={
  "operation": 1,
  "user": {
    "username": "bob",
    "password": "654321"
  },
  message:null,
  session:null
}

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.messageService.messages.next(this.message);
    //this.message.message = "";
  }
}
