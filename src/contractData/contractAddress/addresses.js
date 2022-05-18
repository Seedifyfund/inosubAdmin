import { services } from '../../services';
let networkId = 56;
async function fetchNetworkId() {
  networkId = await services.getNetworkId();
}
fetchNetworkId();
function getContractAddresses() {
  if (networkId === '0x61' || +networkId === 97)
    return {
      nft:'0xdaa5afe30425435EbEf2453710bbC07893124732',//'0xCF4C944402f7FeF282738b8C7791d269281164B7',//'0xdD0A4C0639195A4C489661a7df13004257212C81',
      marketPlace:"0x2a4dadC64FC2c763e152E02f1232c5F5615AF258",//'0x76fEeA64953010810c085AC5298C7D463905132d',//'0x7E2C77C74BF6b9E82a16b01471eb84B2bfB6ef17'
    };
  else if (+networkId === 56 || networkId === '0x38')
    return {
      nft:"0xdaa5afe30425435EbEf2453710bbC07893124732",//'0xCF4C944402f7FeF282738b8C7791d269281164B7',//'0xdD0A4C0639195A4C489661a7df13004257212C81',
      marketPlace:"0x2a4dadC64FC2c763e152E02f1232c5F5615AF258",//'0x76fEeA64953010810c085AC5298C7D463905132d',//'0x7E2C77C74BF6b9E82a16b01471eb84B2bfB6ef17'
    };
  else
    return {
      nft:"0xdaa5afe30425435EbEf2453710bbC07893124732",//'0xCF4C944402f7FeF282738b8C7791d269281164B7',//'0xdD0A4C0639195A4C489661a7df13004257212C81',
      marketPlace:"0x2a4dadC64FC2c763e152E02f1232c5F5615AF258",//'0x76fEeA64953010810c085AC5298C7D463905132d',//'0x7E2C77C74BF6b9E82a16b01471eb84B2bfB6ef17'
    };
}
export default getContractAddresses;
