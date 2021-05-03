export class SystemMessage {

  name : string;
  title : string;
  message : string;
  type : string;
  
  constructor(name : string, title : string, message : string, type : string) {
    this.name = name;
    this.title = title;
    this.message = message;
    this.type = type;
  }
}

var systemMessages : SystemMessage[] = [];

// add all system messages:

systemMessages.push(new SystemMessage('testmessage', 'TEST', 'Das ist eine Test Nachricht an dich!', 'default'));








export function getSystemMessages(name) {
  return systemMessages.find((s : SystemMessage) => s.name == name);
}