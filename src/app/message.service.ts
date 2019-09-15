import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { WebsocketService } from "./web-socket.service";
import { map } from "rxjs/operators";

const CHAT_URL = "ws://localhost:9080/messaging";

export interface Message {
  // AUTHENTICATION_LOGIN = 1;  
  // MESSAGING_SEND = 101;
  
  operation:number;
  user:{
      username:string,
      password:string
  };
  message:{
      from:string;
      to:string;
      body:string;
    setn:string;
  };
  session:string
}

@Injectable()
export class MessageService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    //this.myObservable().pipe()
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).pipe(map(
      (response: MessageEvent): Message => {
        return <Message>JSON.parse(response.data);        
      }
    ));
  }
}