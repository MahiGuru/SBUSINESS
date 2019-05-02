export class Inventory {
  public id: any = '33';
  public description = '';
  public type = '';
  public partner = '';
  public received: any = '';
  public sflywip: any = '';
  public collated: any = '';
  public waste: any = '';
  public average: any = '';
  public completed: any = '';
  public sfonhand: any = '';
  public ponhand: any = '';
  public updated: any = '';
  constructor(inventory?: any) {
    if (inventory) {
      this.id = inventory.id || null;
      this.description = inventory.description || null;
      this.type = inventory.type || null;
      this.partner = inventory.partner || null;
      this.received = inventory.received || null;
      this.sflywip = inventory.sflywip || null;
      this.collated = inventory.collated || null;
      this.waste = inventory.waste || null;
      this.average = inventory.average || null;
      this.completed = inventory.completed || null;
      this.sfonhand = inventory.sfonhand || null;
      this.ponhand = inventory.ponhand || null;
      this.updated = inventory.updated || null;
    }
  }

}
