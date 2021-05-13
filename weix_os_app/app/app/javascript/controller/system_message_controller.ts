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

export function getSystemMessages(name) {
  return systemMessages.find((s : SystemMessage) => s.name == name);
}



// add all system messages:

//test
systemMessages.push(new SystemMessage('testmessage', 'TEST', 'Das ist eine Test Nachricht an dich!', 'default'));

//mkdir Error
systemMessages.push(new SystemMessage('mkdir_error', 'Fehler', 'Beim erstellen des Verzeichnisses ist ein Fehler aufgetreten!', 'error'));
