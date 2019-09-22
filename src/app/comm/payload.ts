export class Data {
  public static readonly VERSION = 1;
  public static readonly OPERATION_LOGIN = 1;
  public static readonly OPERATION_LOGIN_RESULT = 2;
  public static readonly OPERATION_LOGOUT = 3;
  public static readonly OPERATION_LOGOUT_RESULT = 4;
  public static readonly OPERATION_SUBSCRIBE = 100;
  public static readonly OPERATION_SUPPLY = 200;
  public static readonly OPERATION_REQUEST = 300;

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
  returnvaues: any[];
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
  //Todo : add support for limited fields subscription
}


export class SupplyMessage {

  // BATCH_BEGIN = 1;    
  // BATCH_END = 2;    
  // ADD = 3;    
  // UPDATE = 4;    
  // DELETE = 5;    

  phase: number;
  supply: string;

  //Todo : add support for limited fields subscription
}