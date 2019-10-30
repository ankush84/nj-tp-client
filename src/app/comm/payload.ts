export class Data {
  public static readonly VERSION = 1;
  public static readonly OPERATION_LOGIN = 1;
  public static readonly OPERATION_LOGIN_RESULT = 2;
  public static readonly OPERATION_LOGOUT = 3;
  public static readonly OPERATION_LOGOUT_RESULT = 4;
  public static readonly OPERATION_SUBSCRIBE = 100;
  public static readonly OPERATION_UNSUBSCRIBE = 101;
  public static readonly OPERATION_SUPPLY = 200;
  public static readonly OPERATION_REQUEST = 300;
  public static readonly OPERATION_REPLY = 400;
  public static readonly OPERATION_PING = 500;
  public static readonly OPERATION_PONG = 501;

  protocolversion: number;
  operation: number;
  user: User;
  message: string;
  sessionId: string;
}

export class User {
  username: string;
  password: string;
}


export class ReplyMessage {
  name: string;
  id: number;
  returnValues: any[];
  returnCode: number;
}


export class RequestMessage {
  name: string;
  id: number;
  argNames: string[];
  argValues: any[];
}

export class SubscriptionMessage {
  topic: string;
  id: string;
  //Todo : add support for limited fields subscription
}


export class SupplyMessage {

  public static readonly BATCH_BEGIN = 1;    
  public static readonly BATCH_END = 2;    
  public static readonly ADD = 3;    
  public static readonly UPDATE = 4;    
  public static readonly DELETE = 5;    

  phase: number;
  supply: string;
  topic: string;
  id: string;

  //Todo : add support for limited fields subscription
}