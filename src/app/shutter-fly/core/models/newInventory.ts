export class Inventory {
  public id: any = '33';
  public description = '';
  public type = '';
  public partner = '';
  constructor(inventory?: any) {
    if (inventory) {
      this.id = inventory.id || null;
      this.description = inventory.description || null;
      this.type = inventory.type || null;
      this.partner = inventory.partner || null;
    }
  }

}
