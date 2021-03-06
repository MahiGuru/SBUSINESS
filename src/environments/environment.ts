// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://hxserver2019.southindia.cloudapp.azure.com/vendorinventory/api/',
  partner: 'partners',
  inventoryItems: 'items',
  inventoryList: 'inventory/onhand',
  saveNewInventory: 'inventory/itempartnerupdate',
  deletePartner: 'inventory/itempartnerdelete',
  printList: 'print/orders',
  printItems: 'print/items',
  releaseItems: 'release/items',
  savePrintRecord: 'print/order/manage',
  releasesList: 'release/orders',
  releaseManage: 'release/order/manage',
  authenticate: 'authenticate'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
