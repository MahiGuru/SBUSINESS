export class Inventory {
  public itemPartner;
  public recieved: any = '';
  public sflyWip: any = '';
  public collated: any = '';
  public waste: any = '';
  public overAge: any = '';
  public completed: any = '';
  public sfOnHand: any = '';
  public pOnHand: any = '';
  public updatedAt: any = '';
  public children: any = [];

  constructor(inventory?: any) {
    if (inventory) {
      this.itemPartner = {
        item: {
          itemId: inventory.itemPartner.item.itemId,
          itemNo: inventory.itemPartner.item.itemNo,
          itemDescription: inventory.itemPartner.item.itemDescription,
          itemType: inventory.itemPartner.item.itemTypeCode
        },
        partner: {
          partnerId: inventory.itemPartner.partner.partnerId,
          partnerType: inventory.itemPartner.partner.partnerType,
          partnerCode: inventory.itemPartner.partner.partnerCode
        }
      };
      this.recieved = inventory.recieved;
      this.sflyWip = inventory.sflyWip;
      this.collated = inventory.collated;
      this.waste = inventory.waste;
      this.overAge = inventory.overAge;
      this.completed = inventory.completed;
      this.sfOnHand = inventory.sfOnHand;
      this.pOnHand = inventory.pOnHand;
      this.updatedAt = inventory.updatedAt;
      this.children = inventory.children;
    }
  }

}
