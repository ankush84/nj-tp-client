//https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
import { Observable, Observer, observable } from "rxjs";
import { ReplyMessage, RequestMessage, Data, User } from './payload';
import { map } from "rxjs/operators";

export class Deferred<T> {
  public promise;
  public reject;
  public resolve;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export class WebsocketConnector {

  public connect(url): Promise<WebSocket> {

    return new Promise<WebSocket>((resolve, reject) => {

      let ws = new WebSocket(url);
      ws.onopen = (y: Event) => {
        resolve(ws);
      };
      ws.onerror = (y: Event) => {
        reject("error");
      };
    });
  }
}

interface NjTPServer {
  login(user, pwd): Promise<Data>;
  logout(): Promise<Data>;
  //subscribe(topic):promise<subscription>
  reqest(reqest: RequestMessage): Promise<ReplyMessage>
}

export class WebSocketMessagingAdaptor {

  private ws: WebSocket;

  constructor(private url: String) {

  }

  public start(): Promise<Observable<Data>> {
    return new Promise<Observable<Data>>((resolve, reject) => {
      let websocketConnector = new WebsocketConnector();
      websocketConnector.connect(this.url).then((ws: WebSocket) => {

        this.ws = ws;
        //this.isConnected = true;

        let observable: Observable<Data> = new Observable((obs: Observer<MessageEvent>) => {
          ws.onmessage = obs.next.bind(obs);
          ws.onerror = obs.error.bind(obs);
          ws.onclose = obs.complete.bind(obs);
          return ws.close.bind(ws);
        }).pipe(map(
          (response: MessageEvent): Data => {
            return <Data>JSON.parse(response.data);
          }
        ));
        console.log("connected");
        resolve(observable);
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  public send(data: Data) {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify(data));
    }
  }


  public isConnected(): boolean {
    return this.ws && this.ws.readyState == WebSocket.OPEN;
  }
}





