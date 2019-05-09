export class InventoryTransformation {
  public id: any = '';
  public itemNo: any = '';
  public description = '';
  public type = '';
  public partner = '';
  public partnerType = '';
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
      this.id = inventory.item.itemId || null;
      this.itemNo = inventory.item.itemNo || null;
      this.description = inventory.item.itemDescription || null;
      this.type = inventory.item.itemTypeCode || null;
      this.partner = inventory.partner.partnerId || null;
      this.partnerType = inventory.partner.partnerType || null;
      this.received = inventory.recieved || null;
      this.sflywip = inventory.sflyWip || null;
      this.collated = inventory.collated || null;
      this.waste = inventory.waste || null;
      this.average = inventory.overAge || null;
      this.completed = inventory.completed || null;
      this.sfonhand = inventory.sfOnHand || null;
      this.ponhand = inventory.pOnHand || null;
      this.updated = inventory.updated || null;
    }
  }

}
