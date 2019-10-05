import { Injectable } from '@angular/core';
import { Deferred, WebSocketMessagingAdaptor } from './web-socket.service';
import { Data, User, SubscriptionMessage, SupplyMessage, ReplyMessage, RequestMessage } from './payload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  private login_deferred: Deferred<boolean>;
  private ws: WebSocketMessagingAdaptor;
  private loginSesionData: Data;

  private subscriptions: { [id: string]: Subscription[] } = {};
  private requestCounter: number = 0;
  private subsCounter: number = 0;
  private pendingRequests: { [id: number]: Deferred<ReplyMessage> }={};


  public static readonly URL = "ws://localhost:9080/messaging";

  public start(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.ws = new WebSocketMessagingAdaptor(CommService.URL);
      this.ws.start().then(observable => {
        observable.subscribe(data => {
          console.log("Response from websocket: " + data);

          switch (data.operation) {

            case Data.OPERATION_LOGIN_RESULT:
              console.log("uff");
              if (data.sessionId) {
                this.loginSesionData = data;
                this.login_deferred.resolve(true);
              } else {
                this.login_deferred.reject(data.message);
              }
              break;
            case Data.OPERATION_SUPPLY:
              if (!data.sessionId) break;

              let supply = <SupplyMessage>JSON.parse(data.message);

              let subscriptions = this.subscriptions[supply.id];
              if (subscriptions) {
                subscriptions.forEach((x) => x.onSupply(supply));
              }

              break;
            case Data.OPERATION_REPLY:
              if (!data.sessionId) break;

              let reply = <ReplyMessage>JSON.parse(data.message);
              if (this.pendingRequests[reply.id]) {
                this.pendingRequests[reply.id].resolve(reply);
              }
              break;
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
      this.loginSesionData = undefined;
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


  subscribe(topic: string, onSupply: (suply: SupplyMessage) => void): ISubscription {
    if (!this.loginSesionData) throw new Error("Not logged in");

    if (!this.ws.isConnected()) throw new Error("Not connected to server");


    let data = new Data();
    data.operation = Data.OPERATION_SUBSCRIBE;
    data.user = this.loginSesionData.user;
    data.sessionId = this.loginSesionData.sessionId;
    let subMs = new SubscriptionMessage();
    subMs.topic = topic;
    subMs.id = (this.subsCounter++).toString();

    data.message = JSON.stringify(subMs);
    this.ws.send(data);

    let subscription = new Subscription(subMs.id,topic, onSupply, this);

    if (!this.subscriptions[subMs.id]) this.subscriptions[subMs.id] = [];


    this.subscriptions[subMs.id].push(subscription);

    return subscription;
  }

  unsubscribe(sub: Subscription) {

    if (!this.loginSesionData) throw new Error("Not logged in");

    if (!this.ws.isConnected()) throw new Error("Not connected to server");


    let data = new Data();
    data.operation = Data.OPERATION_UNSUBSCRIBE;
    data.user = this.loginSesionData.user;
    data.sessionId = this.loginSesionData.sessionId;
    let subMs = new SubscriptionMessage();
    subMs.topic = sub.topic;
    subMs.id = sub.id;

    data.message = JSON.stringify(subMs);
    this.ws.send(data);    

    if (this.subscriptions[sub.id]) this.subscriptions[sub.id] = [];   

  }


  request(name: string, args: { [name: string]: any }): Promise<ReplyMessage> {
    if (!this.loginSesionData) throw new Error("Not logged in");

    if (!this.ws.isConnected()) throw new Error("Not connected to server");


    let data = new Data();
    data.operation = Data.OPERATION_REQUEST;
    data.user = this.loginSesionData.user;
    data.sessionId = this.loginSesionData.sessionId;
    let requestMessage = new RequestMessage();
    requestMessage.name = name;
    requestMessage.argNames = [];
    requestMessage.argValues = [];
    requestMessage.id = this.requestCounter++;

    for (const name in args) {
      const value = args[name];
      requestMessage.argNames.push(name);
      requestMessage.argValues.push(value);

    }

    data.message = JSON.stringify(requestMessage);
    this.ws.send(data);
    let def = new Deferred<ReplyMessage>();

    this.pendingRequests[requestMessage.id] = def;
    return def.promise;

  }


}
export interface ISubscription {
  dispose();
  readonly topic: String;
  readonly id: String;

}

export class Subscription implements ISubscription {

  supplies: Observable<String>;


  constructor(private _topic: string,
    private _id: string,
    public onSupply: (suply: SupplyMessage) => void,
    private commService: CommService) {

  }

  public get topic(): string {
    return this._topic;
  }

  
  public get id(): string {
    return this._id;
  }


  dispose() {
    this.commService.unsubscribe(this);
  }

}