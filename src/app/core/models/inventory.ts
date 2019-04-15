export class Inventory {

  public id: any = '';
  public description: string = '';
  public itemType: string = '';
  public assemblyPartner: string = '';
  public received: any = '';
  public committed: any = '';
  public adjustment: any = '';
  public shipped:any = '';
  public onhand: any = '';
  public updated: any = '';
  public status: any = 'New';
  constructor(inventory?: any){
    if(inventory){
      this.id = inventory.id || null;
      this.description = inventory.description || null;
      this.itemType = inventory.itemType || null;
      this.assemblyPartner = inventory.assemblyPartner || null;
      this.received = inventory.received || null;
      this.committed = inventory.committed || null;
      this.adjustment = inventory.adjustment || null;
      this.shipped = inventory.shipped || null;
      this.onhand = inventory.onhand || null;
      this.updated = inventory.updated || null;
      this.status = inventory.status || null;
    }
  }

}
