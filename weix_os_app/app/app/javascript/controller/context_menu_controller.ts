export enum ContextMenuFunctions {
  addToDesktop,
  removeFromDesktop,
  addToToolbar,
  removeFromToolbar
}

export class ContextMenu {

  private static instance : ContextMenu;

  private constructor() {

  }

  public static getInstance() {
    if(this.instance == null) {
      this.instance = new ContextMenu();
    }

    return this.instance;
  }
}