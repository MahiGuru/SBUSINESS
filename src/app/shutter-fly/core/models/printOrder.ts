export class PrintOrder {
  public itemPartner;
  public printOrderId: any = '';
  public quantity: any = '';
  public poNum: any = '';
  public jobNum: any = '';
  public status: any = '';
  public createdAt: any = '';
  public updatedAt: any = '';
  public children: any = [];

  constructor(printOrder?: any) {
    if (printOrder) {
      this.itemPartner = {
        item: {
          itemId: printOrder.itemPartner.item.itemId,
          itemNo: printOrder.itemPartner.item.itemNo,
          itemDescription: printOrder.itemPartner.item.itemDescription,
          itemType: printOrder.itemPartner.item.itemTypeCode
        },
        partner: {
          partnerId: printOrder.itemPartner.partner.partnerId,
          partnerType: printOrder.itemPartner.partner.partnerType,
          partnerCode: printOrder.itemPartner.partner.partnerCode
        }
      };
      this.printOrderId = printOrder.printOrderId;
      this.quantity = printOrder.quantity;
      this.poNum = printOrder.poNum;
      this.jobNum = printOrder.jobNum;
      this.status = printOrder.status;
      this.updatedAt = printOrder.updatedAt;
      this.createdAt = printOrder.createdAt;
      this.children = printOrder.children;
    }
  }

}
