import { Injectable } from '@angular/core';
import { Deferred, WebSocketMessagingAdaptor } from './web-socket.service';
import { Data, User } from './payload';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  private login_deferred: Deferred<boolean>;
  private ws: WebSocketMessagingAdaptor;
  private loginSesionData:Data;
  public static readonly URL = "ws://192.168.1.10:9080/messaging";

  public start(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.ws = new WebSocketMessagingAdaptor(CommService.URL);
      this.ws.start().then(observable => {
        observable.subscribe(data => {
          console.log("Response from websocket: " + data);

          switch (data.operation) {

            case Data.OPERATION_LOGIN_RESULT:
              console.log("uff");
              if(data.sessionId){
                this.loginSesionData=data;
                this.login_deferred.resolve(true);
              }else{
                this.login_deferred.reject(data.message);
              }
              break;
            // case Data.OPERATION_SUBSCRIBE:
            //     if (!isValidSession(data.sessionId))
            //         break;

            //     SubscriptionMessage sm = gson.fromJson(data.message, SubscriptionMessage.class);
            //     SubscriptionService.getInstance().addSubscription(sm.topic, this);
            //     break;
            // case Data.OPERATION_REQUEST:
            // if (!isValidSession(data.sessionId))
            //     break;
            // RequestMessage rm = gson.fromJson(data.message, RequestMessage.class);
            // RequestService.getInstance().getReply(this, rm);
            // break;
            default:
            // getSession().close(404, "Wrong operation");
          }
        });

        resolve(true);
      }).catch(reason => {
        reject(reason);
      });


    });
  }

  public login(userName: string, pwd: string): Promise<boolean> {
    if (this.login_deferred) {
      this.login_deferred.reject("new login request");
    }

    this.login_deferred = new Deferred<boolean>();

    if (this.ws.isConnected()) {
      let data = new Data();
      data.operation = Data.OPERATION_LOGIN;
      data.user = new User();
      data.user.username = userName;
      data.user.password = pwd;

      this.ws.send(data);
    }

    return this.login_deferred.promise;
  }
}
