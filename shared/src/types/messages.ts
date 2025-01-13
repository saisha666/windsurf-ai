export interface BaseMessage {
  type: string;
  data: unknown;
}

export interface ErrorMessage extends BaseMessage {
  type: 'error';
  data: {
    message: string;
    code: string;
  };
}

export interface SuccessMessage extends BaseMessage {
  type: 'success';
  data: {
    message: string;
  };
}

export type Message = ErrorMessage | SuccessMessage;

export const isErrorMessage = (message: Message): message is ErrorMessage => 
  message.type === 'error';
