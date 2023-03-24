export function getShortAddress(address){
    let length = address.length;
    return address.slice(0, 7) + "....." + address.slice(length - 5, length);
}