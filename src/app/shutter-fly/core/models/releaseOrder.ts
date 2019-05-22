export class ReleaseOrder {
  public itemPartner;
  public releaseOrderId: any = '';
  public quantity: any = '';
  public poNum: any = '';
  public waste: any = '';
  public jobNum: any = '';
  public status: any = '';
  public createdAt: any = '';
  public updatedAt: any = '';
  public children: any = [];

  constructor(releaseOrder?: any) {
    if (releaseOrder) {
      this.itemPartner = {
        item: {
          itemId: releaseOrder.itemPartner.item.itemId,
          itemNo: releaseOrder.itemPartner.item.itemNo,
          itemDescription: releaseOrder.itemPartner.item.itemDescription,
          itemType: releaseOrder.itemPartner.item.itemTypeCode
        },
        partner: {
          partnerId: releaseOrder.itemPartner.partner.partnerId,
          partnerName: releaseOrder.itemPartner.partner.partnerName,
          partnerDescription: releaseOrder.itemPartner.partner.partnerDescription,
          partnerType: releaseOrder.itemPartner.partner.partnerType,
          partnerCode: releaseOrder.itemPartner.partner.partnerCode
        }
      };
      this.releaseOrderId = releaseOrder.releaseOrderId;
      this.quantity = releaseOrder.quantity;
      this.waste = releaseOrder.waste;
      this.poNum = releaseOrder.poNum;
      this.jobNum = releaseOrder.jobNum;
      this.status = releaseOrder.status;
      this.updatedAt = releaseOrder.updatedAt;
      this.createdAt = releaseOrder.createdAt;
      this.children = releaseOrder.children;
    }
  }

}
